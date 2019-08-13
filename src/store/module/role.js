import { getRoles, addRole, delRole, updateRole } from '@/api/role'

const role = {
  state: {},
  mutations: {

  },
  actions: {
    // 选择的用户查收藏信息
    getRolesList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getRoles(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addRoleInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        addRole(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    removeRole ({ commit }, params) {
      return new Promise((resolve, reject) => {
        delRole(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    updateRoleInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        updateRole(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default role
