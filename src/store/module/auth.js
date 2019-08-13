import { authOrgRole, getOrgRoles, getEmpRoles, authEmpRole, getFuncTree, setRoleAuth, getAuthButns } from '@/api/auth'

const role = {
  state: {},
  mutations: {

  },
  actions: {
    // 给某机构授权某个角色
    orgAuth ({ commit }, params) {
      return new Promise((resolve, reject) => {
        authOrgRole(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 给某员工授权某个角色
    empAuth ({ commit }, params) {
      return new Promise((resolve, reject) => {
        authEmpRole(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    orgRoles ({ commit }, orgId) {
      return new Promise((resolve, reject) => {
        getOrgRoles(orgId).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    empRoles ({ commit }, empId) {
      return new Promise((resolve, reject) => {
        getEmpRoles(empId).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getFuncTree ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getFuncTree(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    setRoleAuth ({ commit }, params) {
      return new Promise((resolve, reject) => {
        setRoleAuth(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getAuthButns ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAuthButns(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default role
