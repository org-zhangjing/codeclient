/*
 * @Author: chaozhou
 * @Date: 2018-05-27 10:05:53
 * @Last Modified by: chaozhou
 * @Last Modified time: 2018-06-01 11:33:12
 */
import http from '@/libs/api.request'

/**
 * 获取redis列表
 * @param {object} params
 */
const getRedisConfList = params => {
  return http.fetch({
    url: '/conf/redis',
    params
  })
}

/**
 * 添加redis
 * @param {object} params
 */
const addRedisConf = params => {
  return http.post({
    url: '/conf/redis',
    data: params
  })
}

/**
 * 修改redis
 * @param {object} params
 */
const updateRedisConf = params => {
  return http.put({
    url: '/conf/redis',
    data: params
  })
}

/**
 * 添加redis
 * @param {object} params
 */
const removeRedisConf = params => {
  return http.del({
    url: '/conf/redis/' + params.id
  })
}

/**
 * 获取kafka列表
 * @param {object} params
 */
const getKafkaConfList = params => {
  return http.fetch({
    url: '/conf/kafka',
    params
  })
}

/**
 * 添加kafka
 * @param {object} params
 */
const addKafkaConf = params => {
  return http.post({
    url: '/conf/kafka',
    data: params
  })
}

/**
 * 修改kafka
 * @param {object} params
 */
const updateKafkaConf = params => {
  return http.put({
    url: '/conf/kafka',
    data: params
  })
}

/**
 * 添加kafka
 * @param {object} params
 */
const removeKafkaConf = params => {
  return http.del({
    url: '/conf/kafka/' + params.id
  })
}

/**
 * 获取dataAssembly列表
 * @param {object} params
 */
const getDataAssemblyConfList = params => {
  return http.fetch({
    url: '/conf/dataAssembly',
    params
  })
}

/**
 * 添加dataAssembly
 * @param {object} params
 */
const addDataAssemblyConf = params => {
  return http.post({
    url: '/conf/dataAssembly',
    data: params
  })
}

/**
 * 修改dataAssembly
 * @param {object} params
 */
const updateDataAssemblyConf = params => {
  return http.put({
    url: '/conf/dataAssembly',
    data: params
  })
}

/**
 * 添加dataAssembly
 * @param {object} params
 */
const removeDataAssemblyConf = params => {
  return http.del({
    url: '/conf/dataAssembly/' + params.id
  })
}

/**
 * 获取dataSending列表
 * @param {object} params
 */
const getDataSendingConfList = params => {
  return http.fetch({
    url: '/conf/dataSending',
    params
  })
}

/**
 * 添加dataSending
 * @param {object} params
 */
const addDataSendingConf = params => {
  return http.post({
    url: '/conf/dataSending',
    data: params
  })
}

/**
 * 修改dataSending
 * @param {object} params
 */
const updateDataSendingConf = params => {
  return http.put({
    url: '/conf/dataSending',
    data: params
  })
}

/**
 * 添加dataSending
 * @param {object} params
 */
const removeDataSendingConf = params => {
  return http.del({
    url: '/conf/dataSending/' + params.id
  })
}

/**
 * 获取task列表
 * @param {object} params
 */
const getTaskConfList = params => {
  return http.fetch({
    url: '/conf/task',
    params
  })
}

/**
 * 添加task
 * @param {object} params
 */
const addTaskConf = params => {
  return http.post({
    url: '/conf/task',
    data: params
  })
}

/**
 * 修改task
 * @param {object} params
 */
const updateTaskConf = params => {
  return http.put({
    url: '/conf/task',
    data: params
  })
}

/**
 * 添加task
 * @param {object} params
 */
const removeTaskConf = params => {
  return http.del({
    url: '/conf/task/' + params.id
  })
}

export { getTaskConfList, addTaskConf, updateTaskConf, removeTaskConf, getDataSendingConfList, addDataSendingConf, updateDataSendingConf, removeDataSendingConf, getDataAssemblyConfList, addDataAssemblyConf, updateDataAssemblyConf, removeDataAssemblyConf, getRedisConfList, addRedisConf, updateRedisConf, removeRedisConf, getKafkaConfList, addKafkaConf, updateKafkaConf, removeKafkaConf }
