import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './plugins/element.js'
// 导入全局样式表
import '@/assets/css/global.css'
// 导入字体图标
import '@/assets/fonts/iconfont.css'
// 导入树形表格组件
import treeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
// 导入进度条NProgess 的对应的js、css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.component('tree-table', treeTable)
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 添加请求拦截器  request -- 展示进度条
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = window.sessionStorage.getItem('token')
  NProgress.start()

  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器  response -- 隐藏进度条
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  NProgress.done()
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
