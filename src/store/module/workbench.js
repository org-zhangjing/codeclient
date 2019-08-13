import { getWorkbenchs, editSelfWorkbench } from '@/api/workbench'
const workflow = {
  state: {},
  mutations: {

  },
  actions: {
    // 根据用户id查询当前用户工作台
    getWorkbenchList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getWorkbenchs().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    editSelfWorkbenchs ({ commit }, params) {
      return new Promise((resolve, reject) => {
        editSelfWorkbench(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
export default workflow
