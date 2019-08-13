import axios from 'axios'
import store from '@/store'
import { Notice } from 'iview'

import i18n from '@/locale' // eslint-disable-line

// import { Spin } from 'iview'
const addErrorLog = errorInfo => { // eslint-disable-line
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    // if (store.state.user) {
    //   config.headers.Authorization = `Bearer ${store.state.user.token}`
    // }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 新增全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      // 这里需要i18n支持的话，就可以根据data中的返回的code进行取值然后提示notice（将10001换成data.code就可以了）
      // console.log('i18n', i18n.vm.locale, i18n.vm.messages[i18n.vm.locale].code['10001'])
      return { data, status }
    }, error => {
      this.destroy(url)
      // let errorInfo = error.response
      // if (!errorInfo) {
      //   const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
      //   errorInfo = {
      //     statusText,
      //     status,
      //     request: { responseURL: config.url }
      //   }
      // }
      // addErrorLog(errorInfo)
      const { data } = error.response
      if (data.code !== 'ok') {
        // toast error msg
        Notice.error({
          title: '提示',
          desc: data.msg
        })
      }
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
  fetch (options) {
    // {url: '', data: {}, params: {}, method: 'get'}
    const instance = axios.create()
    options.method = 'get'
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
  post (options) {
    const instance = axios.create()
    options.method = 'post'
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
  put (options) {
    const instance = axios.create()
    options.method = 'put'
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
  del (options) {
    const instance = axios.create()
    options.method = 'delete'
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
