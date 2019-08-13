import { getJobs, addJob, delJob, pauseJob, resumeJob, updateJob } from '@/api/job'

const job = {
  state: {},
  mutations: {

  },
  actions: {
    // 选择的用户查收藏信息
    getJobsList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getJobs(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addJobInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        addJob(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    removeJob ({ commit }, params) {
      return new Promise((resolve, reject) => {
        delJob(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    pauseJob ({ commit }, params) {
      return new Promise((resolve, reject) => {
        pauseJob(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    resumeJob ({ commit }, params) {
      return new Promise((resolve, reject) => {
        resumeJob(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    updateJob ({ commit }, params) {
      return new Promise((resolve, reject) => {
        updateJob(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default job
