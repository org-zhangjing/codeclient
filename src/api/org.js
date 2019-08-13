/*
 * @Author: chaozhou
 * @Date: 2018-05-27 10:05:53
 * @Last Modified by: chaozhou
 * @Last Modified time: 2018-05-27 10:12:02
 */
import http from '@/libs/api.request'
/**
 * 获取机构列表
 * @param {object} params
 */
const getOrgs = params => {
  return http.fetch({
    url: '/organization/tree',
    params
  })
}

/**
 * 新增机构
 * @param {object} params
 */
const addOrg = params => {
  return http.post({
    url: '/organization ',
    data: params
  })
}

/**
 * 删除机构
 * @param {object} id
 */
const delOrg = id => {
  return http.del({
    url: `/organization/${id}`
  })
}

/**
 * 编辑机构
 * @param {object} params
 */
const updateOrg = params => {
  return http.put({
    url: `/organization`,
    data: params
  })
}

/**
 * 新增机构下的员工
 * @param {object} params
 */
const addOrgEmp = params => {
  return http.post({
    url: `/organization/${params.orgid}/emp`,
    data: params.emp
  })
}

export { getOrgs, addOrg, delOrg, updateOrg, addOrgEmp }
