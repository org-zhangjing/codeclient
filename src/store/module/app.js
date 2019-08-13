import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  // setRouterListInLocalstorage,
  // getRouterListInLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead, backendMenusToRouters
} from '@/libs/util'
import beforeClose from '@/router/before-close'
import { saveErrorLogger } from '@/api/data'
import router from '@/router'
import routers from '@/router/routers'
import config from '@/config'
import { listUserMenus } from '@/api/user'

import defMenus from '@/router/menus'
const { homeName } = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: getHomeRoute(routers, homeName),
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false,
    routers: [],
    hasGetRouter: false,
    btns: [],
    echartsDatas: []
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(state.routers, rootState.user.access),
    errorCount: state => state.errorList.length
  },
  mutations: {
    clearStateInfo (state) {
      state.hasGetRouter = false
      state.routers = []
    },
    setRouters (state, routers) {
      state.routers = routers
    },
    setBtns (state, btns) {
      state.btns = btns
    },
    setHasGetRouter (state, status) {
      state.hasGetRouter = status
    },
    setHomeRoute (state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setTagNavList (state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      if (route.meta && route.meta.beforeCloseName && route.meta.beforeCloseName in beforeClose) {
        new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
          if (close) {
            closePage(state, route)
          }
        })
      } else {
        closePage(state, route)
      }
    },
    addTag (state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) {
      localSave('local', lang)
      state.local = lang
    },
    addError (state, error) {
      state.errorList.push(error)
    },
    setHasReadErrorLoggerStatus (state, status = true) {
      state.hasReadErrorPage = status
    },
    SOCKET_backMsg (state, data) {
      state.echartsDatas.push(data[1])
      if (state.echartsDatas.length > 31) {
        state.echartsDatas.shift()
      }
    }
  },
  actions: {
    addErrorLog ({ commit, rootState }, info) {
      if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false)
      const { user: { token, userId, name } } = rootState
      let data = {
        ...info,
        time: Date.parse(new Date()),
        token,
        userId,
        name
      }
      saveErrorLogger(info).then(() => {
        commit('addError', data)
      })
    },
    getRouters ({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          listUserMenus().then(res => {
            let { data } = res
            data = data.data
            const btns = data.button
            const menus = data.menu ? (data.menu.children ? data.menu.children : []) : []
            let routers = backendMenusToRouters(menus.concat(defMenus))
            commit('setRouters', routers)
            commit('setBtns', btns)
            commit('setHasGetRouter', true)
            resolve(routers)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
