import { fse2 } from "@/api/fse2Client";
// Client helpers for the admin session token.
const TOKEN_KEY = "pr_admin_token";

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

export const callAdmin = async (action, payload = {}) => {
  const response = await fse2.functions.invoke("adminAuth", { action, token: getAdminToken(), ...payload });
  const data = response && response.data ? response.data : response;
  return data;
};