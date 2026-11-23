// Admin sign-in and password management for the content manager.
// The password never leaves the server in plain text: it is stored as a salted
// SHA-256 hash and sessions are signed with a server-held secret.

const DEFAULT_ADMIN_EMAIL = "admin@prayread.com";
const DEFAULT_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || "prayread-admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

const encoder = new TextEncoder();

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const hashPassword = async (password, salt) => {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(`${salt}:${password}`));
  return toHex(digest);
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

const readAccount = async (email) => {
  const rows = await fse2.entities.AdminAccount.list("-updated_date", 50);
  const list = rows || [];
  return list.find((row) => String(row.email || "").toLowerCase() === String(email || "").toLowerCase()) || null;
};

const ensureAccount = async () => {
  const rows = await fse2.entities.AdminAccount.list("-updated_date", 50);
  const list = rows || [];
  if (list.length) return list[0];
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
  const secret = toHex(crypto.getRandomValues(new Uint8Array(32)));
  const password_hash = await hashPassword(DEFAULT_PASSWORD, salt);
  const created = await fse2.entities.AdminAccount.create({
    email: DEFAULT_ADMIN_EMAIL,
    salt,
    secret,
    password_hash,
    session_version: "1",
    updated_date: new Date().toISOString()
  });
  return created;
};

const buildToken = async (account) => {
  const payload = Buffer.from(
    JSON.stringify({
      email: account.email,
      sv: account.session_version || "1",
      exp: Date.now() + SESSION_TTL_MS
    })
  ).toString("base64");
  const signature = await sign(payload, account.secret);
  return `${payload}.${signature}`;
};

const verifyToken = async (token) => {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  const account = await readAccount(DEFAULT_ADMIN_EMAIL);
  const all = await fse2.entities.AdminAccount.list("-updated_date", 50);
  const candidate = (all || []).find((row) => row.secret) || account;
  if (!candidate) return null;
  const expected = await sign(payload, candidate.secret);
  if (expected !== signature) return null;
  const data = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
  if (data.exp < Date.now()) return null;
  if (String(data.sv) !== String(candidate.session_version || "1")) return null;
  return data;
};

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const action = String(body.action || "login");

    if (action === "login") {
      const email = String(body.email || DEFAULT_ADMIN_EMAIL).trim();
      const password = String(body.password || "");
      const account = await ensureAccount();
      const target = await readAccount(email);
      if (!target) {
        return Response.json({ error: "That administrator account does not exist." }, { status: 401 });
      }
      const attempt = await hashPassword(password, target.salt);
      if (attempt !== target.password_hash) {
        return Response.json({ error: "Incorrect email or password." }, { status: 401 });
      }
      const token = await buildToken(target);
      await fse2.entities.ActivityLog.create({
        actor: target.email,
        action: "signed in",
        section: "admin",
        detail: "Administrator session opened"
      });
      return Response.json({ token, email: target.email, account: account ? true : false });
    }

    if (action === "session") {
      const data = await verifyToken(body.token);
      if (!data) return Response.json({ error: "Session expired." }, { status: 401 });
      return Response.json({ email: data.email, valid: true });
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
      const currentHash = await hashPassword(current, target.salt);
      if (currentHash !== target.password_hash) {
        return Response.json({ error: "The current password is not correct." }, { status: 400 });
      }
      const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
      const password_hash = await hashPassword(next, salt);
      await fse2.entities.AdminAccount.update(target.id, {
        salt,
        password_hash,
        session_version: String(Number(target.session_version || 1) + 1),
        updated_date: new Date().toISOString()
      });
      await fse2.entities.ActivityLog.create({
        actor: target.email,
        action: "changed the admin password",
        section: "settings",
        detail: "Previous password invalidated"
      });
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});