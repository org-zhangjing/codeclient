/*
 * @Author: chaozhou
 * @Date: 2018-05-27 10:05:53
 * @Last Modified by: chaozhou
 * @Last Modified time: 2018-05-27 10:12:02
 */
import http from '@/libs/api.request'
/**
 * 获取菜单列表
 * @param {object} params
 */
const getMenus = params => {
  return http.fetch({
    url: '/menu/tree',
    params
  })
}

/**
 * 获取按钮列表
 * @param {object} params
 */
const getBtns = params => {
  return http.fetch({
    url: '/button',
    params
  })
}
/**
 * 获取菜单按钮列表
 * @param {object} params
 */
const menuBtnAll = menuCode => {
  return http.fetch({
    url: '/button/menu',
    params: {
      menuCode: menuCode.menuCode,
      roleId: menuCode.roleId
    }
  })
}
/**
 * 新增菜单
 * @param {object} params
 */
const addMenu = params => {
  return http.post({
    url: '/menu',
    data: params
  })
}

/**
 * 删除菜单
 * @param {object} id
 */
const delMenu = id => {
  return http.del({
    url: `/menu/${id}`
  })
}

/**
 * 删除按钮
 * @param {object} id
 */
const delBtn = id => {
  return http.del({
    url: `/button/${id}`
  })
}

/**
 * 编辑菜单
 * @param {object} params
 */
const updateMenu = params => {
  return http.put({
    url: `/menu`,
    data: params
  })
}

/**
 * 编辑按钮
 * @param {object} params
 */
const updateBtn = params => {
  return http.put({
    url: `/button`,
    data: params
  })
}

/**
 * 新增菜单下的按钮
 * @param {object} params
 */
const addMenuBtn = params => {
  return http.post({
    url: `/button`,
    data: params
  })
}

export { getMenus, addMenu, delMenu, updateMenu, addMenuBtn, getBtns, delBtn, updateBtn, menuBtnAll }
