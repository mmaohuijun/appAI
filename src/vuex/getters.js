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
  }
}

export default getters
