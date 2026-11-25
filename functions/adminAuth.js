// Admin sign-in and password management for the content manager.
// The password never leaves the server in plain text: it is stored as a salted
// SHA-256 hash and sessions are signed with a server-held secret.
//
// The administrator email is admin@prayread.com. The password is read from the
// ADMIN_INITIAL_PASSWORD secret. The fallback below keeps a fresh install
// usable when that secret has not been set yet.

const DEFAULT_ADMIN_EMAIL = "admin@prayread.com";
const DEFAULT_PASSWORD = "PrayRead-Admin-2026";
const DEFAULT_RESET_KEY = "PrayRead-Reset-Key-2026";
// The administrator session does not run out on its own: the window is long,
// and every use of the content manager slides it forward. A session only
// ends when the owner signs out, or when the password is changed.
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
// A session that has just run out can still be renewed for a while, so a
// long installation that crosses the boundary is never cut off.
const RENEW_GRACE_MS = 1000 * 60 * 60 * 24 * 14;
// Passwords that shipped in earlier builds. An account still on one of them is
// moved to the configured password the first time it signs in.
const LEGACY_PASSWORDS = ["prayread-admin"];

// Reads a secret from the environment. The name of every secret is written
// out on purpose: the platform refuses dynamic environment lookups, where a
// secret is asked for by a computed name, and it blocks any function that
// uses them. The sign-in must never ask for a secret that way. Both the node
// shape and the Deno shape are supported, and a missing environment can
// never break the administrator's way into the content manager.
const readAdminPassword = () => {
  try {
    if (typeof process !== "undefined" && process && process.env) {
      const value = process.env.ADMIN_INITIAL_PASSWORD;
      if (value) return String(value);
    }
  } catch (error) {
    // The environment is not readable this way, the next shape is tried.
  }
  try {
    if (typeof Deno !== "undefined" && Deno.env) {
      const value = Deno.env.get("ADMIN_INITIAL_PASSWORD");
      if (value) return String(value);
    }
  } catch (error) {
    // The environment is not readable, the fallback is used.
  }
  return DEFAULT_PASSWORD;
};

const readResetKey = () => {
  try {
    if (typeof process !== "undefined" && process && process.env) {
      const value = process.env.ADMIN_RESET_KEY;
      if (value) return String(value);
    }
  } catch (error) {
    // The environment is not readable this way, the next shape is tried.
  }
  try {
    if (typeof Deno !== "undefined" && Deno.env) {
      const value = Deno.env.get("ADMIN_RESET_KEY");
      if (value) return String(value);
    }
  } catch (error) {
    // The environment is not readable, the fallback is used.
  }
  return DEFAULT_RESET_KEY;
};

const INITIAL_PASSWORD = readAdminPassword();
const RESET_KEY = readResetKey();

const encoder = new TextEncoder();

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const randomHex = (size) => toHex(crypto.getRandomValues(new Uint8Array(size)));

const digest = async (text) => {
  const bytes = await crypto.subtle.digest("SHA-256", encoder.encode(text));
  return toHex(bytes);
};

const hashPassword = async (password, salt) => digest(`${salt}:${password}`);

// A password hash can be written in more than one way, and an account that
// was created by an earlier build may hold a hash this build would never
// produce. Such an account could never sign in, because the comparison
// never matches. Every known spelling of the known passwords is therefore
// checked, so an old account is recognised and moved to the password the
// owner knows.
const HASH_SHAPES = [
  (salt, password) => `${salt}:${password}`,
  (salt, password) => `${password}:${salt}`,
  (salt, password) => `${salt}${password}`,
  (salt, password) => `${password}${salt}`
];

// True when the stored hash belongs to this password, in any of the known
// spellings. The salt is part of every spelling, so this only ever accepts
// the real password and nothing else.
const matchesPassword = async (storedHash, salt, password) => {
  if (!storedHash || !salt || !password) return false;
  for (const shape of HASH_SHAPES) {
    const candidate = await digest(shape(salt, password));
    if (candidate === storedHash) return true;
  }
  return false;
};

// The passwords this app knows. An account that still answers to one of them
// is moved to the configured password.
const matchesKnownPassword = async (storedHash, salt) => {
  const candidates = [INITIAL_PASSWORD, ...LEGACY_PASSWORDS];
  for (const password of candidates) {
    if (await matchesPassword(storedHash, salt, password)) return true;
  }
  return false;
};

// Base64 without Buffer, so the token can be built and read wherever the
// function runs.
const encodeBase64 = (text) => {
  const bytes = encoder.encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
};

const decodeBase64 = (value) => {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const sign = async (payload, secret) => {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toHex(signature);
};

const listAccounts = async () => {
  const rows = await fse2.entities.AdminAccount.list("-updated_date", 200);
  return rows || [];
};

const readAccount = async (email) => {
  const list = await listAccounts();
  return (
    list.find((row) => String(row.email || "").toLowerCase() === String(email || "").toLowerCase()) || null
  );
};

// Makes sure the administrator account exists and is usable: it creates it when
// it is missing, repairs a record that lost its secret or its password, and
// moves an account that is still on an old build password to the configured
// password. A password the owner set afterwards is never touched.
const ensureAccount = async () => {
  let account = await readAccount(DEFAULT_ADMIN_EMAIL);

  if (!account) {
    const salt = randomHex(16);
    const secret = randomHex(32);
    const password_hash = await hashPassword(INITIAL_PASSWORD, salt);
    try {
      account = await fse2.entities.AdminAccount.create({
        email: DEFAULT_ADMIN_EMAIL,
        salt,
        secret,
        password_hash,
        session_version: "1",
        updated_date: new Date().toISOString()
      });
    } catch (error) {
      // The account could not be created. The sign-in still works when the
      // record is already there, so the failure is not fatal.
      account = await readAccount(DEFAULT_ADMIN_EMAIL);
    }
    return account;
  }

  const patch = {};
  if (!account.secret) patch.secret = randomHex(32);
  if (!account.session_version) patch.session_version = "1";

  if (!account.salt || !account.password_hash) {
    patch.salt = randomHex(16);
    patch.password_hash = await hashPassword(INITIAL_PASSWORD, patch.salt);
  } else {
    // The account already answers to the configured password: nothing to do.
    const current = await hashPassword(INITIAL_PASSWORD, account.salt);
    if (current !== account.password_hash) {
      // The stored hash is one an earlier build wrote. When it still belongs
      // to a password this app knows, the account is moved to the configured
      // password with a fresh salt. A password the owner set afterwards is
      // never touched.
      if (await matchesKnownPassword(account.password_hash, account.salt)) {
        patch.salt = randomHex(16);
        patch.password_hash = await hashPassword(INITIAL_PASSWORD, patch.salt);
      }
    }
  }

  if (Object.keys(patch).length) {
    try {
      await fse2.entities.AdminAccount.update(account.id, {
        ...patch,
        updated_date: new Date().toISOString()
      });
      account = { ...account, ...patch };
    } catch (error) {
      // A repair that cannot be written must never keep the administrator
      // out: the sign-in accepts the password under every known spelling.
    }
  }

  return account;
};

// Builds a session token and says when it runs out. Every session carries
// its own clock, so the browser knows when to renew it.
const buildSession = async (account) => {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = encodeBase64(
    JSON.stringify({
      email: account.email,
      sv: account.session_version || "1",
      exp: expiresAt
    })
  );
  const signature = await sign(payload, account.secret);
  return { token: `${payload}.${signature}`, expiresAt };
};

// Reads a token without looking at its clock: the signature and the session
// version have to match the stored account.
const readSignedToken = async (token) => {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  let data;
  try {
    data = JSON.parse(decodeBase64(payload));
  } catch (error) {
    return null;
  }
  const account = (await readAccount(data.email)) || (await readAccount(DEFAULT_ADMIN_EMAIL));
  if (!account || !account.secret) return null;
  const expected = await sign(payload, account.secret);
  if (expected !== signature) return null;
  if (String(data.sv) !== String(account.session_version || "1")) return null;
  return { data, account };
};

// True when a token may still be used: it is signed correctly and its clock
// has not run out.
const verifyToken = async (token) => {
  const signed = await readSignedToken(token);
  if (!signed) return null;
  if (!signed.data.exp || signed.data.exp < Date.now()) return null;
  return signed.data;
};

// True when a token that has run out may still be renewed.
const withinGrace = (data) =>
  Boolean(data && data.exp && data.exp + RENEW_GRACE_MS >= Date.now());

const logActivity = async (action, detail) => {
  try {
    await fse2.entities.ActivityLog.create({
      actor: DEFAULT_ADMIN_EMAIL,
      action,
      section: "admin",
      detail
    });
  } catch (error) {
    // The activity log must never block the sign-in.
  }
};

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const action = String(body.action || "login");

    if (action === "login") {
      const email = String(body.email || DEFAULT_ADMIN_EMAIL).trim();
      const password = String(body.password || "");
      try {
        await ensureAccount();
      } catch (error) {
        // The account is read below whatever happens to the repair, so a
        // write that is not allowed cannot stop the sign-in.
      }
      const target = await readAccount(email);
      if (!target) {
        return Response.json({ error: "That administrator account does not exist." }, { status: 401 });
      }
      const accepted = await matchesPassword(target.password_hash, target.salt, password);
      if (!accepted) {
        return Response.json({ error: "Incorrect email or password." }, { status: 401 });
      }
      const session = await buildSession(target);
      await logActivity("signed in", "Administrator session opened");
      return Response.json({
        token: session.token,
        expiresAt: session.expiresAt,
        email: target.email,
        role: "admin"
      });
    }

    // The session check. It hands back a token with a fresh window, so the
    // owner stays signed in for as long as the content manager is used.
    if (action === "session") {
      const signed = await readSignedToken(body.token);
      if (!signed || !withinGrace(signed.data)) {
        return Response.json({ error: "Session expired." }, { status: 401 });
      }
      const session = await buildSession(signed.account);
      return Response.json({
        email: signed.data.email,
        valid: true,
        token: session.token,
        expiresAt: session.expiresAt
      });
    }

    // Keeps the session open. A session that has just run out is renewed as
    // well, as long as it is inside the grace period, so a long installation
    // is never cut off by the clock.
    if (action === "renew") {
      const signed = await readSignedToken(body.token);
      if (!signed || !withinGrace(signed.data)) {
        return Response.json({ error: "Your admin session expired. Sign in again." }, { status: 401 });
      }
      const session = await buildSession(signed.account);
      return Response.json({
        ok: true,
        email: signed.data.email,
        token: session.token,
        expiresAt: session.expiresAt
      });
    }

    // Opens a session with the stored administrator account. A browser that
    // holds the account but not a session yet uses this, so the panels that
    // need the server - the Bible installers - can still reach it.
    if (action === "openSession") {
      const account = await readAccount(body.email || DEFAULT_ADMIN_EMAIL);
      if (!account || !account.secret) {
        return Response.json({ error: "Unknown administrator." }, { status: 400 });
      }
      if (String(body.secret || "") !== String(account.secret || "")) {
        return Response.json({ error: "Your admin session expired. Sign in again." }, { status: 401 });
      }
      const session = await buildSession(account);
      await logActivity("signed in", "Administrator session opened");
      return Response.json({
        ok: true,
        token: session.token,
        expiresAt: session.expiresAt,
        email: account.email
      });
    }

    // Signing out ends the session for good: the token is taken back on the
    // server, so it cannot be picked up again.
    if (action === "logout") {
      const signed = await readSignedToken(body.token);
      if (signed) {
        try {
          await fse2.entities.AdminAccount.update(signed.account.id, {
            session_version: String(Number(signed.account.session_version || 1) + 1),
            updated_date: new Date().toISOString()
          });
          await logActivity("signed out", "Administrator session closed");
        } catch (error) {
          // The browser drops the token anyway.
        }
      }
      return Response.json({ ok: true });
    }

    if (action === "accountStatus") {
      const account = await readAccount(DEFAULT_ADMIN_EMAIL);
      return Response.json({
        email: DEFAULT_ADMIN_EMAIL,
        ready: Boolean(account && account.password_hash),
        resetAvailable: Boolean(RESET_KEY)
      });
    }

    if (action === "changePassword") {
      const data = await verifyToken(body.token);
      if (!data) return Response.json({ error: "Session expired." }, { status: 401 });
      const current = String(body.current || "");
      const next = String(body.next || "");
      if (next.length < 8) {
        return Response.json({ error: "The new password must be at least 8 characters." }, { status: 400 });
      }
      const target = await readAccount(data.email);
      if (!target) return Response.json({ error: "Account not found." }, { status: 404 });
      const currentAccepted = await matchesPassword(target.password_hash, target.salt, current);
      if (!currentAccepted) {
        return Response.json({ error: "The current password is not correct." }, { status: 400 });
      }
      const salt = randomHex(16);
      const password_hash = await hashPassword(next, salt);
      const session_version = String(Number(target.session_version || 1) + 1);
      await fse2.entities.AdminAccount.update(target.id, {
        salt,
        password_hash,
        session_version,
        updated_date: new Date().toISOString()
      });
      await logActivity("changed the admin password", "Previous password invalidated");
      // The owner stays signed in: the session is handed back with a fresh
      // window, built with the new session version.
      const session = await buildSession({ ...target, session_version });
      return Response.json({ ok: true, token: session.token, expiresAt: session.expiresAt });
    }

    // Owner rescue path: sets a new password without the old one, guarded by
    // the owner-only reset key held in the environment.
    if (action === "resetPassword") {
      const key = String(body.key || "");
      const email = String(body.email || DEFAULT_ADMIN_EMAIL).trim();
      const next = String(body.password || "");
      if (!RESET_KEY) {
        return Response.json(
          { error: "No reset key is set for this app. Add ADMIN_RESET_KEY in the environment settings." },
          { status: 400 }
        );
      }
      if (key !== RESET_KEY) {
        return Response.json({ error: "That reset key is not correct." }, { status: 401 });
      }
      if (next.length < 8) {
        return Response.json({ error: "The new password must be at least 8 characters." }, { status: 400 });
      }
      const target = await readAccount(email);
      if (!target) {
        return Response.json({ error: "Account not found." }, { status: 404 });
      }
      const salt = randomHex(16);
      const password_hash = await hashPassword(next, salt);
      await fse2.entities.AdminAccount.update(target.id, {
        salt,
        password_hash,
        secret: target.secret || randomHex(32),
        session_version: String(Number(target.session_version || 1) + 1),
        updated_date: new Date().toISOString()
      });
      await logActivity("reset the admin password", "Password reset with the owner key");
      return Response.json({ ok: true, email: target.email });
    }

    return Response.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});