import { getDicts, addDict, delDict, updateDict, getDictTypes, addDictType, updateDictType, delDictType, getDictTypesWithCode } from '@/api/dict'

const dict = {
  state: {},
  mutations: {

  },
  actions: {
    // 选择的用户查收藏信息
    getDictsList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getDicts(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getDictTypesList ({ commit }, id) {
      return new Promise((resolve, reject) => {
        getDictTypes(id).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getDictTypesWithCode ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getDictTypesWithCode(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addDictInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        addDict(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addDictTypeInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        addDictType(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    removeDict ({ commit }, params) {
      return new Promise((resolve, reject) => {
        delDict(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    removeDictType ({ commit }, params) {
      return new Promise((resolve, reject) => {
        delDictType(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    updateDictInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        updateDict(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    updateDictTypeInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        updateDictType(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default dict
