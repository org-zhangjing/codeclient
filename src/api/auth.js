/*
 * @Author: chaozhou
 * @Date: 2018-05-27 10:05:53
 * @Last Modified by: chaozhou
 * @Last Modified time: 2018-05-27 10:12:02
 */
import http from '@/libs/api.request'

/**
 * 直接为机构授权
 * @param {object} params
 */
const authOrgRole = params => {
  return http.post({
    url: `/users/role/${params.id}`,
    data: params
  })
}
/**
 * 直接为员工授权
 * @param {object} params
 */
const authEmpRole = params => {
  return http.post({
    url: `/auth/emps/auth`,
    data: params
  })
}

/**
 * 给某角色设置某些菜单&按钮权限
 * @param {object} params
 */
const setRoleAuth = params => {
  return http.post({
    url: `/auth/resource`,
    data: params
  })
}
const getAuthButns = menuAuth => {
  return http.fetch({
    url: '/users/role',
    params: {
      roleId: menuAuth.id,
      menuCode: menuAuth.menuCode
    }
  })
}
/**
 * 查询某机构已授权的角色
 * @param {object} params
 */
const getOrgRoles = orgId => {
  return http.fetch({
    url: '/users/role',
    params: {
      id: orgId.id,
      partyType: orgId.partyType
    }
  })
}

/**
 * 查询员工已授权的角色
 * @param {object} params
 */
const getEmpRoles = empId => {
  return http.fetch({
    url: `/auth/emps/${empId}/roles`
  })
}

/**
 * 查询员工已授权的角色
 * @param {object} params
 */
const getFuncTree = params => {
  return http.fetch({
    url: `/auth/resource/${params}`
  })
}

export { authOrgRole, getOrgRoles, getEmpRoles, authEmpRole, getFuncTree, setRoleAuth, getAuthButns }
