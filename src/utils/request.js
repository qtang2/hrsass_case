import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getTimeStamp } from './auth'

// 3600 seconds
const timeOut = 3600

const service = axios.create({
  // when do npm run dev, it is development environment
  // then process.env will find the env.development file to get VUE_APP_BASE_API
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// request interceptors set
service.interceptors.request.use(config => {
  // configuration for request, and it must be returned
  // can add auth information here
  if (store.getters.token) {
    if (IsCheckTimeOut()) {
      // token expired, then logout and go to login page
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token expired '))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// response interceptors
// response data will firstly go to response interceptor
// interceptor has two params which are two callback functions
// one is for when successfully pass the interceptors, another one is for fail
service.interceptors.response.use(response => {
  // this is the successful callback for the interceptors
  console.log('resolve in the response interceptors ========')
  console.log(response)
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    console.log('reject in the response interceptors')
    return Promise.reject(new Error(message))
  }
}, error => {
  // this is the failed callback for the interceptors

  //  back end telling that token is expired
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    console.log('failed messss')
    Message.error(error.message)
  }

  // end the promise chain, which means cannot .then , instead go to .catch
  return Promise.reject(error)
})

function IsCheckTimeOut() {
  var currentTime = Date.now()
  var timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > timeOut
}

export default service
