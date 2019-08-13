import { addAdminInfo, getAdminList, deleteAdminById, updateStaffInfo, updateAdminInfo, getJournalList, updatePassWordInFo, buildExcelFile } from '@/api/admin'

const admin = {
  state: {},
  mutations: {

  },
  actions: {
    // 获取所有系统用户
    getAllAdmin ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getAdminList(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 删除系统用户
    delAdmin ({ commit }, id) {
      return new Promise((resolve, reject) => {
        deleteAdminById(id || 0).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 增加系统用户
    addAdmin ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        addAdminInfo(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    updateStaff ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        updateStaffInfo(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 修改
    updateAdmin ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        updateAdminInfo(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 修改密码
    updatePassWord ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        updatePassWordInFo(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 生成表格
    buildExcelFile ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        buildExcelFile(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getAllJournal ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getJournalList(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default admin
