'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_PATH: '"/"',
  BASE_URL: '"http://172.18.84.125:8010/"'
})
