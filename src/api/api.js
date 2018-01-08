import axios from 'axios'
import qs from 'qs'

const $axios = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 30000,
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded'
    'Content-Type': 'application/x-www-form-urlencoded; application/json;charset=UTF-8'
  },
  withCredentials: true,
  transformRequest: [function (data) {
    return data instanceof FormData ? data : qs.stringify(data)
  }]
})

const responseStatus = {
  ok: '000', // 操作成功
  sessionInvalid: '003', // 会话已失效
  noAuthority: '004', // 权限不足
  customError: '998' // 后台自定义错误
}

  // 添加请求拦截器
$axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
$axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  const resCode = response.data.resCode
  const retMsg = response.data.retMsg

  if (resCode === responseStatus.ok) {
    return response.data
  } else {
    console.log('showErrorMsg', retMsg)
    return null
  }
  // return response
}, function (error) {
  // 对响应错误做点什么
  console.log(error)
  return Promise.reject(error)
})

// console.log($axios.get())
export default $axios
