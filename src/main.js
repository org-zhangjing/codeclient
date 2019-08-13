// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@babel/polyfill'

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'

import ECharts from 'vue-echarts'

// import VueSocketIO from 'vue-socket.io' // 在 webpack 环境下指向 components/ECharts.vue
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
// 注册组件后即可使用
Vue.component('v-chart', ECharts)

// Vue.use(new VueSocketIO({
//   debug: false,
//   connection: 'http://localhost:8090',
//   vuex: {
//     store,
//     // actionPrefix: 'SOCKET_'
//     mutationPrefix: 'SOCKET_'
//   },
//   options: { path: '/ws' } // Optional options
// }))

// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(TreeTable)
Vue.use(VOrgTree)
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
Vue.prototype.$lodash = require('lodash')
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
