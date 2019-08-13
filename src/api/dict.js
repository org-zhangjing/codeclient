/*
 * @Author: chaozhou
 * @Date: 2018-05-27 10:05:53
 * @Last Modified by: chaozhou
 * @Last Modified time: 2018-05-27 10:12:02
 */
import http from '@/libs/api.request'
/**
 * 获取角色列表
 * @param {object} params
 */
const getDicts = params => {
  return http.fetch({
    url: '/base/option/all',
    params
  })
}

/**
 * 获取字典项列表
 * @param {object} params
 */
const getDictTypes = id => {
  return http.fetch({
    url: `/base/option/${id}`
  })
}

/**
 * 获取字典项列表
 * @param {object} params
 */
const getDictTypesWithCode = code => {
  return http.fetch({
    url: `/base/option/code/${code}`
  })
}

/**
 * 新增角色
 * @param {object} params
 */
const addDict = params => {
  return http.post({
    url: '/base/option',
    data: params
  })
}

/**
 * 新增字典项
 * @param {object} params
 */
const addDictType = params => {
  return http.post({
    url: '/base/option',
    data: params
  })
}

/**
 * 删除角色
 * @param {object} id
 */
const delDict = id => {
  return http.del({
    url: `/base/option/${id}`
  })
}

/**
 * 删除字典项
 * @param {object} id
 */
const delDictType = id => {
  return http.del({
    url: `/base/option/${id}`
  })
}

/**
 * 编辑角色
 * @param {object} params
 */
const updateDict = params => {
  return http.put({
    url: '/base/option',
    data: params
  })
}

/**
 * 编辑字典项
 * @param {object} params
 */
const updateDictType = params => {
  return http.put({
    url: '/base/option',
    data: params
  })
}

export { getDicts, addDict, delDict, updateDict, getDictTypes, addDictType, updateDictType, delDictType, getDictTypesWithCode }
