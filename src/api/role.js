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
const getRoles = params => {
  return http.fetch({
    url: '/role',
    params
  })
}

/**
 * 新增角色
 * @param {object} params
 */
const addRole = params => {
  return http.post({
    url: '/role',
    data: params
  })
}

/**
 * 删除角色
 * @param {object} id
 */
const delRole = id => {
  return http.del({
    url: `/role/${id}`
  })
}

/**
 * 编辑角色
 * @param {object} params
 */
const updateRole = params => {
  return http.put({
    url: '/role',
    data: params
  })
}

export { getRoles, addRole, delRole, updateRole }
