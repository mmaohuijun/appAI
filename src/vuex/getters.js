import $Storage from '../api/storage.js'
const getters = {
  getIntentId: () => {
    return $Storage.sessionStorage.getItem('intentId')
  },
  getEntityId: () => {
    return $Storage.sessionStorage.getItem('entityId')
  },
  // getAppId: () => $Storage.sessionStorage.getItem('appId'),
  getAppId: state => state.apps.appId,
  getAppName: () => {
    return $Storage.sessionStorage.getItem('appName')
  },
  getUserName: () => {
    return $Storage.localStorage.getItem('userName')
  },
  getUserAuthId: () => {
    return $Storage.sessionStorage.getItem('userAuthId')
  },
  getRoleAuthId: () => {
    return $Storage.sessionStorage.getItem('roleAuthId')
  },
  getSideBarMenu: () => {
    return $Storage.localStorage.getItem('sideBarMenu')
  },
  firstRoute: state => state.settings.firstRoute,
  loginStatus: state => state.settings.hasLogin,
  hasUserInfo: () => {
    const userInfo = $Storage.sessionStorage.getItem('userInfo')
    return userInfo !== undefined
  },
  auth: state => state.settings.auth,
  username: state => state.settings.username,
  sideBarMenu: state => state.settings.sideBarMenu
}

export default getters
