import { getMenus, addMenu, delMenu, updateMenu, addMenuBtn, getBtns, delBtn, updateBtn, menuBtnAll } from '@/api/menu'

const menu = {
  state: {},
  mutations: {

  },
  actions: {
    getMenusList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getMenus(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getAllBtns ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getBtns(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    menuBtnAll ({ commit }, params) {
      return new Promise((resolve, reject) => {
        menuBtnAll(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addMenuInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        addMenu(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    removeMenu ({ commit }, id) {
      return new Promise((resolve, reject) => {
        delMenu(id).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    updateMenuInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        updateMenu(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addMenuBtnInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        addMenuBtn(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    delBtn ({ commit }, params) {
      return new Promise((resolve, reject) => {
        delBtn(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    updateBtn ({ commit }, params) {
      return new Promise((resolve, reject) => {
        updateBtn(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default menu
