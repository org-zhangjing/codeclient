/*
 * @Author: chaozhou
 * @Date: 2018-05-27 10:05:53
 * @Last Modified by: chaozhou
 * @Last Modified time: 2018-05-27 10:12:02
 */
import http from '@/libs/api.request'
/**
 * 获取任务列表
 * @param {object} params
 */
const getJobs = params => {
  return http.fetch({
    url: '/job/queryjob',
    params
  })
}

/**
 * 添加任务
 * @param {object} params
 */
const addJob = params => {
  return http.post({
    url: '/job/addjob',
    data: params
  })
}

/**
 * 删除任务
 * @param {object} params
 */
const delJob = params => {
  return http.post({
    url: '/job/deletejob',
    data: params
  })
}

/**
 * 暂停任务
 * @param {object} params
 */
const pauseJob = params => {
  return http.post({
    url: '/job/pausejob',
    data: params
  })
}

/**
 * 恢复任务
 * @param {object} params
 */
const resumeJob = params => {
  return http.post({
    url: '/job/resumejob',
    data: params
  })
}

/**
 * 更新任务
 * @param {object} params
 */
const updateJob = params => {
  return http.post({
    url: '/job/reschedulejob',
    data: params
  })
}

export { getJobs, addJob, delJob, pauseJob, resumeJob, updateJob }
