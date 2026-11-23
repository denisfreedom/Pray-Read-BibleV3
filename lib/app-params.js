// FSe2-compatible app params
export const appParams = {
  appId: localStorage.getItem('fse2_app_id') || 'local',
  token: localStorage.getItem('fse2_token') || '',
  fromUrl: window.location.href,
  functionsVersion: 'latest',
  appBaseUrl: window.location.origin,
};
