import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import role from './module/role'// 角色
import org from './module/org'// 机构
import auth from './module/auth'// 权限
import menu from './module/menu'// 菜单
import position from './module/position'// 岗位
import admin from './module/admin'// 管理员工
import dict from './module/dict'// 数据字典
import job from './module/job'// 定时任务
import workflow from './module/workflow'// 工作流
import workbench from './module/workbench'// 工作台
import data_auth from './module/data_auth'// 数据权限
import conf from './module/conf'// 配置模块

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    role,
    org,
    auth,
    menu,
    admin,
    position,
    dict,
    job,
    workflow,
    workbench,
    data_auth,
    conf
  }
})
