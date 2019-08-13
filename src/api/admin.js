/*
 * @Author: chaozhou
 * @Date: 2018-05-27 10:05:53
 * @Last Modified by: chaozhou
 * @Last Modified time: 2018-06-01 11:33:12
 */
import http from '@/libs/api.request'

/**
 * 获取系统用户列表
 * @param {object} params
 */
const getAdminList = params => {
  return http.fetch({
    url: '/users',
    params
  })
}
/**
 * 获取系统日志列表
 * @param {object} params
 */
const getJournalList = params => {
  return http.fetch({
    url: '/users/sysLogs',
    params
  })
}
/**
 * 编辑员工
 * @param {object} params
 */
const updateStaffInfo = params => {
  return http.put({
    url: '/users',
    data: params
  })
}
/**
 * 删除用户
 * @param  {object} params
 */
const deleteAdminById = id => {
  return http.del({
    url: `/users/${id}`
  })
}
/**
 * 新增用户
 * @param {user对象} user
 */
const addAdminInfo = user => {
  return http.post({
    url: '/users',
    data: user
  })
}
/**
 * 修改用户
 * @param {object} admin
 */
const updateAdminInfo = admin => {
  if (!admin.id) {
    return Promise.reject(new Error('arg id can\'t be null'))
  }
  return http.put({
    url: `/users/${admin.id}`,
    data: admin
  })
}
/**
 * 修改密码
 * @param {object} admin
 */
const updatePassWordInFo = admin => {
  return http.put({
    url: `/users/password`,
    data: admin
  })
}
/**
 * 生成表格
 * @param {excel对象} obj
 */
const buildExcelFile = obj => {
  return http.post({
    url: '/excel/build',
    data: obj
  })
}

export { getAdminList, deleteAdminById, updateStaffInfo, addAdminInfo, updateAdminInfo, updatePassWordInFo, buildExcelFile, getJournalList }
