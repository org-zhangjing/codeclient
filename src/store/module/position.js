import { getPosi, addPosition, getPositionRoles, updatePositionInfo, addPostOrg, getposiListAuth, getsetAuthOrgTree, delPosition, addempPositionAuth } from '@/api/position'

const position = {
  state: {},
  mutations: {

  },
  actions: {
    getPosiList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPosi(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addPositionInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        addPosition(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 查询某岗位下已授权的角色
    positionRoles ({ commit }, orgId) {
      return new Promise((resolve, reject) => {
        getPositionRoles(orgId).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 通过员工id找已授权的岗位和未授权的岗位
    posiListAuth ({ commit }, staffIId) {
      return new Promise((resolve, reject) => {
        getposiListAuth(staffIId).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 岗位删除
    delPosition ({ commit }, params) {
      return new Promise((resolve, reject) => {
        delPosition(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    empPositionAuth ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        addempPositionAuth(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    postOrg ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        addPostOrg(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 通过员工id找已授权的机构和未授权的岗位
    setAuthOrgTree ({ commit }, staffIId) {
      return new Promise((resolve, reject) => {
        getsetAuthOrgTree(staffIId).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    updatePositionInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        updatePositionInfo(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default position
