import { removeTaskConf, updateTaskConf, addTaskConf, getTaskConfList, removeDataSendingConf, updateDataSendingConf, addDataSendingConf, getDataSendingConfList, getDataAssemblyConfList, addDataAssemblyConf, updateDataAssemblyConf, removeDataAssemblyConf, getRedisConfList, addRedisConf, removeRedisConf, updateRedisConf, getKafkaConfList, addKafkaConf, removeKafkaConf, updateKafkaConf } from '@/api/conf'

const conf = {
  state: {},
  mutations: {

  },
  actions: {
    removeTaskConf ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        removeTaskConf(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    updateTaskConf ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        updateTaskConf(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addTaskConf ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        addTaskConf(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getTaskConfList ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getTaskConfList(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    removeDataSendingConf ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        removeDataSendingConf(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    updateDataSendingConf ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        updateDataSendingConf(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addDataSendingConf ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        addDataSendingConf(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getDataSendingConfList ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getDataSendingConfList(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    removeDataAssemblyConf ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        removeDataAssemblyConf(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    updateDataAssemblyConf ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        updateDataAssemblyConf(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addDataAssemblyConf ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        addDataAssemblyConf(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getDataAssemblyConfList ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getDataAssemblyConfList(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getRedisConfList ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getRedisConfList(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addRedisConf ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        addRedisConf(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    removeRedisConf ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        removeRedisConf(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    updateRedisConf ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        updateRedisConf(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getKafkaConfList ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getKafkaConfList(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addKafkaConf ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        addKafkaConf(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    removeKafkaConf ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        removeKafkaConf(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    updateKafkaConf ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        updateKafkaConf(payload).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default conf
