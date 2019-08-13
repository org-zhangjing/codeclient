/*
 * @Author: chaozhou
 * @Date: 2018-05-27 10:05:53
 * @Last Modified by: chaozhou
 * @Last Modified time: 2018-05-27 10:12:02
 */
import http from '@/libs/api.request'
/**
 * 获取岗位列表
 * @param {object} params
 */
const getPosi = params => {
  return http.fetch({
    url: '/position',
    params
  })
}
/**
 * 新增岗位
 * @param {object} params
 */
const addPosition = params => {
  return http.post({
    url: '/position',
    data: params
  })
}
/**
 * 查询某岗位下已授权的角色
 * @param {object} params
 */
const getPositionRoles = posiId => {
  return http.fetch({
    url: `/auth/position/${posiId}/roles`
  })
}
/**
 * 通过员工id找已授权的岗位和未授权的岗位
 * @param {object} id
 */
const getposiListAuth = staffIId => {
  return http.fetch({
    url: `/users/position/${staffIId}`
  })
}
/**
 * 通过员工id找已授权的机构和未授权的岗位
 * @param {object} id
 */
const getsetAuthOrgTree = staffIId => {
  return http.fetch({
    url: `/users/organization/${staffIId}`
  })
}
/**
 * 删除岗位
 * @param {object} id
 */
const delPosition = id => {
  return http.del({
    url: `/position/${id}`
  })
}
/**
 * 给员工授权岗位
 * @param {object} params
 */
const addempPositionAuth = params => {
  return http.post({
    url: `/users/position/${params.id}`,
    data: params
  })
}
/**
 * 给员工授权岗位
 * @param {object} params
 */
const addPostOrg = params => {
  return http.post({
    url: `/users/organization/${params.id}`,
    data: params
  })
}
/**
 *
 * @param {object} params
 */
const updatePositionInfo = params => {
  return http.put({
    url: `/position`,
    data: params
  })
}

export { getPosi, addPosition, delPosition, updatePositionInfo, getPositionRoles, getposiListAuth, addPostOrg, getsetAuthOrgTree, addempPositionAuth }
