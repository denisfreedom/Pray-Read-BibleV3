// FSe2-compatible app params.
//
// The platform issues an app token for the signed-in visitor. It is stored per
// app under "fse2_app_token_<appId>", so the token is read live through
// getters: the value is always current, even after a sign-in that happens
// after this module was loaded.

const APP_ID_KEY = "fse2_app_id";

const readAppId = () => {
  try {
    return localStorage.getItem(APP_ID_KEY) || "local";
  } catch {
    return "local";
  }
};

const readToken = () => {
  try {
    const appId = readAppId();
    return (
      localStorage.getItem(`fse2_app_token_${appId}`) ||
      localStorage.getItem("fse2_token") ||
      localStorage.getItem("fse2_app_token") ||
      ""
    );
  } catch {
    return "";
  }
};

export const appParams = {
  get appId() {
    return readAppId();
  },
  get token() {
    return readToken();
  },
  get fromUrl() {
    try {
      return window.location.href;
    } catch {
      return "";
    }
  },
  get functionsVersion() {
    return "latest";
  },
  get appBaseUrl() {
    try {
      return window.location.origin;
    } catch {
      return "";
    }
  }
};

export default appParams;