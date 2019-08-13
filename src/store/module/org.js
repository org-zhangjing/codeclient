import { getOrgs, addOrg, delOrg, updateOrg, addOrgEmp } from '@/api/org'

const org = {
  state: {},
  mutations: {

  },
  actions: {
    // 选择的用户查收藏信息
    getOrgsList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getOrgs(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addOrgInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        addOrg(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    removeOrg ({ commit }, id) {
      return new Promise((resolve, reject) => {
        delOrg(id).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    updateOrgInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        updateOrg(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addOrgEmpInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        addOrgEmp(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default org
