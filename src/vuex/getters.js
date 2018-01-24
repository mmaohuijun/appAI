import $Storage from '../api/storage.js'
const getters = {
  getAppId: () => {
    return $Storage.sessionStorage.getItem('appId')
  },
  getIntentId: () => {
    return $Storage.sessionStorage.getItem('intentId')
  },
  getEntityId: () => {
    return $Storage.sessionStorage.getItem('entityId')
  },
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
  menuList: () => {
    return $Storage.sessionStorage.getItem('menuList')
  },
  keySideBarMap: () => {
    return $Storage.sessionStorage.getItem('keySideBarMap')
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
