import _ from 'lodash'

const Storage = function (storage) {
  this.storage = storage
}

Storage.prototype = {
  constructor: Storage,
  setItem (name, data) {
    // 转换为基本类型 [object Number] ...
    const valuetype = Object.prototype.toString.call(data)
    if (_.isObject(data) && !_.isFunction(data)) {
      data = JSON.stringify(data)
    }
    this.storage.setItem('_' + name + '_type', valuetype)
    this.storage.setItem(name, data)
  },
  getItem (name) {
    let value, valuetype
    if (this.has(name)) {
      value = this.storage.getItem(name)
      valuetype = this.storage.getItem('_' + name + '_type')
      if (valuetype === '[object Object]' || valuetype === '[object Array]') {
        value = JSON.parse(value)
      }
    }
    return value
  },
  // 判断对象是否有 自身属性(不包括原型链上的)
  has (name) {
    return this.storage.hasOwnProperty(name)
  },
  removeItem (name) {
    if (this.has(name)) {
      this.storage.removeItem(name)
      this.storage.removeItem('_' + name + '_type')
    }
  }
}

const $Storage = {
  sessionStorage: new Storage(window.sessionStorage),
  localStorage: new Storage(window.localStorage)
}

export default $Storage
