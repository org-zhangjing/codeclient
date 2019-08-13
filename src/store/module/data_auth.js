import { getAllDataAuth, addDataAuth, updateDataAuth, delDataAth, getMenuListAll, getRoleListAll } from '@/api/data_auth'

const data_auth = {
  state: {},
  mutations: {

  },
  actions: {
    // 查询数据权限
    getDataAuth ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAllDataAuth(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addDataAuth ({ commit }, params) {
      return new Promise((resolve, reject) => {
        addDataAuth(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    delDataAth ({ commit }, id) {
      return new Promise((resolve, reject) => {
        delDataAth(id).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    updateDataAuth ({ commit }, params) {
      return new Promise((resolve, reject) => {
        updateDataAuth(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getMenuListAll ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getMenuListAll(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getRoleListAll ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getRoleListAll(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default data_auth
