import { getHistorys, getTodos, startProcess, finishWorkItem, endProcess, getHistoryComments, getProcessImg } from '@/api/workflow'

const workflow = {
  state: {},
  mutations: {

  },
  actions: {
    // 查询历史列表
    getHistoryList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getHistorys(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 查询待办列表
    getTodoList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getTodos(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    startProcess ({ commit }, params) {
      return new Promise((resolve, reject) => {
        startProcess(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    finishWorkItem ({ commit }, params) {
      return new Promise((resolve, reject) => {
        finishWorkItem(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    endProcess ({ commit }, params) {
      return new Promise((resolve, reject) => {
        endProcess(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getHistoryComments ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getHistoryComments(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getProcessImg ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getProcessImg(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default workflow
