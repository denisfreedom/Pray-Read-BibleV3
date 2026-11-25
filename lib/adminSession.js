import { fse2 } from "@/api/fse2Client";
import {
  adminDirectCall,
  adminDirectResetPassword,
  adminDirectSignIn,
  readAdminAccount,
  verifyPassword
} from "@/lib/adminDirect";

// The administrator session.
//
// The content manager can run in two ways. The server way signs a session
// token that the content function checks, and it carries the app's own
// privileges. The browser way checks the stored administrator account and
// then works on the entity SDK with the privileges of the signed-in
// administrator. The server way is tried first; when the function gateway
// is closed to the browser the browser way takes over, so the sign-in
// never ends in a silent bounce back to this page.

const TOKEN_KEY = "pr_admin_token";
const MODE_KEY = "pr_admin_mode";
const ADMIN_EMAIL = "admin@prayread.com";
const RESET_KEY = "PrayRead-Reset-Key-2026";

const AUTH_ACTIONS = [
  "login",
  "session",
  "renew",
  "logout",
  "openSession",
  "changePassword",
  "resetPassword",
  "accountStatus"
];

// A session is renewed when it has less than this much life left, so the
// window is always handed back fresh. The window on the server is far
// longer than this: this is only the point where the session slides
// forward, so it never runs out while the content manager is in use.
const RENEW_AHEAD_MS = 1000 * 60 * 60 * 12;

// How often the session is kept alive while the content manager is open.
const KEEP_ALIVE_MS = 1000 * 60 * 4;

export const getAdminToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
};

export const setAdminToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage may be unavailable in private mode; the session simply resets.
  }
};

export const getAdminMode = () => {
  try {
    return localStorage.getItem(MODE_KEY) || "";
  } catch {
    return "";
  }
};

export const setAdminMode = (mode) => {
  try {
    if (mode) localStorage.setItem(MODE_KEY, mode);
    else localStorage.removeItem(MODE_KEY);
  } catch {
    // Storage may be unavailable in private mode.
  }
};

export const adminSignOut = () => {
  setAdminToken("");
  setAdminMode("");
};

/**
 * Signing out for good: the token is taken back on the server, so the
 * session really ends and cannot be picked up again.
 */
export const adminRevokeSession = () => {
  const token = getAdminToken();
  setAdminToken("");
  setAdminMode("");
  if (!token) return;
  try {
    const sending = fse2.functions.invoke("adminAuth", { action: "logout", token });
    if (sending && typeof sending.catch === "function") sending.catch(() => {});
  } catch {
    // The local token is gone anyway.
  }
};

/** The signed-in platform user, or null when nobody is signed in. */
export const currentUser = async () => {
  try {
    return await fse2.auth.me();
  } catch {
    return null;
  }
};

/** True when this browser holds the owner rights the content manager needs. */
export const hasOwnerRights = (user) =>
  !!user &&
  (user.role === "admin" ||
    user.role === "owner" ||
    user.id === "auto-admin" ||
    user.is_admin === true);

/**
 * Calls a backend function. A refused call is always an error: the gateway
 * answers a closed door with a "detail" and no token, which used to look
 * like a successful sign-in.
 */
export const callAdmin = async (action, payload = {}) => {
  const name = AUTH_ACTIONS.includes(action) ? "adminAuth" : "adminContent";
  const response = await fse2.functions.invoke(name, { action, token: getAdminToken(), ...payload });
  const data = response && response.data ? response.data : response;
  if (data && (data.error || data.detail)) {
    throw new Error(data.error || data.detail);
  }
  // The server hands back a token with a fresh window, so the session keeps
  // sliding forward as long as it is used.
  if (data && data.token) setAdminToken(data.token);
  return data || {};
};

/** The moment the open session runs out, or 0 when there is no session. */
export const adminTokenExpiresAt = () => {
  const token = getAdminToken();
  if (!token) return 0;
  try {
    const binary = atob(token.split(".")[0]);
    const text = decodeURIComponent(
      binary
        .split("")
        .map((character) => `%${`00${character.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return Number(JSON.parse(text).exp || 0);
  } catch {
    return 0;
  }
};

/**
 * Keeps the session open. The server hands back a token with a fresh
 * window, so the administrator stays signed in for as long as the content
 * manager is in use.
 */
export const renewAdminSession = async () => {
  if (!getAdminToken()) return false;
  try {
    const data = await callAdmin("renew");
    if (data && data.token) {
      setAdminToken(data.token);
      return true;
    }
  } catch {
    // The gateway is closed to this browser: the browser path decides.
  }
  return false;
};

/**
 * Makes sure the content manager holds a server session. When this browser
 * only holds the stored administrator account, a session is opened with it,
 * so the panels that need the server - the Bible installers - can reach it.
 */
export const ensureServerSession = async () => {
  if (getAdminToken()) return true;
  try {
    const account = await readAdminAccount(ADMIN_EMAIL);
    if (!account || !account.secret) return false;
    const data = await callAdmin("openSession", {
      email: account.email,
      secret: account.secret
    });
    if (data && data.token) {
      setAdminToken(data.token);
      return true;
    }
  } catch {
    // The gateway is closed to this browser: the browser path takes over.
  }
  return false;
};

/**
 * Renews the session before it runs out. It does nothing while the session
 * is young, so it can be called before every operation.
 */
export const ensureFreshAdminToken = async () => {
  if (!getAdminToken()) {
    // This browser holds no session yet: one is opened with the stored
    // administrator account, so the panels that need the server can be
    // reached.
    return ensureServerSession();
  }
  const expiresAt = adminTokenExpiresAt();
  if (!expiresAt) return ensureServerSession();
  if (expiresAt - Date.now() > RENEW_AHEAD_MS) return true;
  return renewAdminSession();
};

/**
 * Keeps the session alive in the background: the window slides forward for
 * as long as the content manager is open, so a long installation is never
 * cut off by the clock.
 */
export const startAdminKeepAlive = (intervalMs = KEEP_ALIVE_MS) => {
  const timer = setInterval(() => {
    renewAdminSession();
  }, intervalMs);
  renewAdminSession();
  return () => clearInterval(timer);
};

/**
 * Runs one content operation. The server answers when the gateway is open
 * and the browser answers when it is not.
 */
export const callAdminData = async (action, payload = {}) => {
  if (getAdminMode() === "server" && getAdminToken()) {
    try {
      return await callAdmin(action, payload);
    } catch (error) {
      if (/session expired/i.test(error.message)) {
        // The session is not thrown away: it is renewed and the work is
        // tried again, so a long job is never lost to the clock.
        if (await renewAdminSession()) return callAdmin(action, payload);
        throw error;
      }
      // The gateway is closed to this browser: the browser path takes over.
    }
  }
  return adminDirectCall(action, payload);
};

/**
 * Signs the administrator in. The server session is tried first, then the
 * stored administrator account is checked in the browser.
 */
export const adminSignIn = async (email, password) => {
  const reasons = [];

  // 1. The server session: it carries the app's own privileges, so it is
  //    the best answer whenever the function gateway is open.
  try {
    const data = await callAdmin("login", { email, password });
    if (data && data.token) {
      setAdminToken(data.token);
      setAdminMode("server");
      return { ok: true, mode: "server" };
    }
  } catch (error) {
    reasons.push({ kind: "gateway", message: error.message });
  }

  // 2. The stored administrator account, checked in this browser.
  const direct = await adminDirectSignIn(email, password);
  if (direct.ok) {
    const user = await currentUser();
    if (hasOwnerRights(user)) {
      setAdminToken("");
      setAdminMode("direct");
      return { ok: true, mode: "direct" };
    }
    reasons.push({
      kind: "rights",
      message:
        "The password is right, but this browser holds no owner rights. Open the content manager from the studio, where the app owner is signed in, or give this administrator the owner rights."
    });
  } else {
    reasons.push({ kind: direct.kind || "check", message: direct.error });
  }

  // 3. The app's own account, for a browser that is not signed in yet.
  const signedIn = await currentUser();
  if (!signedIn) {
    try {
      await fse2.auth.login(email, password);
      const user = await currentUser();
      if (hasOwnerRights(user)) {
        setAdminToken("");
        setAdminMode("direct");
        return { ok: true, mode: "direct" };
      }
      reasons.push({
        kind: "rights",
        message:
          "The password was accepted, but this account cannot manage content. The content manager needs the app owner rights."
      });
    } catch (error) {
      reasons.push({ kind: "password", message: error.message });
    }
  }

  // The clearest reason wins: a wrong password comes first, a closed
  // gateway comes last.
  const order = ["password", "rights", "check", "gateway"];
  const best = order.map((kind) => reasons.find((reason) => reason.kind === kind)).find(Boolean);
  return { error: (best && best.message) || "Could not sign you in." };
};

/** Checks the session that is already open. */
export const adminSessionCheck = async () => {
  if (getAdminMode() === "server" && getAdminToken()) {
    try {
      const data = await callAdmin("session");
      if (data && data.valid) return { valid: true, mode: "server" };
    } catch {
      // The session may have run out while the browser was closed: it is
      // renewed when it is still inside the grace period, so the owner is
      // not thrown out for a night away.
      if (await renewAdminSession()) return { valid: true, mode: "server" };
    }
  }
  if (getAdminMode() === "direct") {
    const user = await currentUser();
    if (hasOwnerRights(user)) return { valid: true, mode: "direct" };
  }
  return { valid: false };
};

/** Sets a new password with the owner key. */
export const adminResetPassword = async (email, key, password) => {
  try {
    const data = await callAdmin("resetPassword", { email, key, password });
    if (data && data.ok) return data;
  } catch {
    // The gateway is closed: the browser path takes over.
  }
  if (String(key || "").trim() !== RESET_KEY) {
    throw new Error("That owner key is not right.");
  }
  return adminDirectResetPassword(email || ADMIN_EMAIL, key, password);
};

/** Reads the stored administrator account, for the panels that need it. */
export const adminAccount = () => readAdminAccount(ADMIN_EMAIL);

/** Checks a password against the stored administrator account. */
export const adminPasswordMatches = (account, password) => verifyPassword(account, password);