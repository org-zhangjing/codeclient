/*
 * @Author: chaozhou
 * @Date: 2018-05-27 10:05:53
 * @Last Modified by: chaozhou
 * @Last Modified time: 2018-05-27 10:12:02
 */
import http from '@/libs/api.request'
/**
 * 获取数据权限
 * @param {object} params
 */
const getAllDataAuth = params => {
  return http.fetch({
    url: '/dataAuth/all',
    params
  })
}

/**
 * 添加任务
 * @param {object} params
 */
const addDataAuth = params => {
  return http.post({
    url: '/dataAuth',
    data: params
  })
}

/**
 * 删除任务
 * @param {object} params
 */
const delDataAth = id => {
  return http.del({
    url: `/dataAuth/${id}`
  })
}

/**
 * 更新任务
 * @param {object} params
 */
const updateDataAuth = params => {
  return http.put({
    url: '/dataAuth',
    data: params
  })
}
/**
 * 获取所有菜单
 * @param {object} params
 */
const getMenuListAll = params => {
  return http.fetch({
    url: '/menu/all',
    params
  })
}
/**
 * 获取所有角色
 * @param {object} params
 */
const getRoleListAll = params => {
  return http.fetch({
    url: '/role/all',
    params
  })
}

export { getAllDataAuth, addDataAuth, delDataAth, updateDataAuth, getMenuListAll, getRoleListAll }
