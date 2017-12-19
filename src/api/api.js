import axios from 'axios'
import qs from 'qs'

const $axios = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  withCredentials: true,
  transformRequest: [function (data) {
    return data instanceof FormData ? data : qs.stringify(data)
  }]
})
// console.log($axios.get())
export default $axios
