/*
 * @Author: chaozhou
 * @Date: 2018-05-27 10:05:53
 * @Last Modified by: chaozhou
 * @Last Modified time: 2018-05-27 10:12:02
 */
import http from '@/libs/api.request'

/**
 * 历史列表
 * @param {object} params
 */
const getHistorys = params => {
  return http.fetch({
    url: `/flow/task/historic`,
    params
  })
}

/**
 * 待办列表
 * @param {object} params
 */
const getTodos = params => {
  return http.fetch({
    url: `/flow/task/${params.assignee}`
  })
}

/**
 * 发起审批（启动流程）
 * @param {object} params
 */
const startProcess = params => {
  return http.post({
    url: `/flow/process/start`,
    data: params
  })
}

/**
 * 完成工作项
 * @param {object} params
 */
const finishWorkItem = params => {
  return http.post({
    url: `/flow/task`,
    data: params
  })
}

/**
 * 结束工作流
 * @param {object} params
 */
const endProcess = params => {
  return http.post({
    url: `/flow/endFlow`,
    data: params
  })
}

/**
 * 查询历史批示
 * @param {object} params
 */
const getHistoryComments = params => {
  return http.fetch({
    url: `/flow/task/comment/${params.taskId}`
  })
}

/**
 * 查询历史批示
 * @param {object} params
 */
const getProcessImg = params => {
  return http.fetch({
    url: `/flow/read-resource`,
    responseType: 'arraybuffer',
    params
  })
}

export { getHistorys, getTodos, startProcess, finishWorkItem, endProcess, getHistoryComments, getProcessImg }
