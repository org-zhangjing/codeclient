const btns = {
  delete: (h, params, vm) => {
    return h('Poptip', {
      props: {
        confirm: true,
        title: '你确定要删除吗?'
      },
      directives: [{
        name: 'hasPermission',
        value: 'job_del'
      }],
      on: {
        'on-ok': () => {
          vm.$emit('on-delete', params)
          vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
        }
      }
    }, [
      h('Button', {
        props: {
          type: 'error'
        },
        style: {
          margin: '0 5px'
        }
      }, [
        h('p', '删除')
      ])
    ])
  },
  // 按钮编辑
  detail: (h, params, vm) => {
    return h('Button', {
      props: {
        type: 'primary'
      },
      style: {
        margin: '0 5px'
      },
      directives: [{
        name: 'hasPermission',
        value: 'menu_btn_edit'
      }],
      on: {
        'click': () => {
          vm.$emit('on-detail', {
            row: params.row,
            index: params.index
          })
        }
      }
    }, [
      h('p', '编辑')
    ])
  },
  // 查看全部商品
  setAuth: (h, params, vm) => {
    return h('Button', {
      props: {
        type: 'primary'
      },
      style: {
        margin: '0 5px'
      },
      directives: [{
        name: 'hasPermission',
        value: 'auth_actionAuth'
      }],
      on: {
        'click': () => {
          vm.$emit('on-setAuth', {
            row: params.row,
            index: params.index
          })
        }
      }
    }, [
      h('p', '设置权限')
    ])
  },
  // 查看字典项
  dictTypeDetail: (h, params, vm) => {
    return h('Button', {
      props: {
        type: 'primary'
      },
      style: {
        margin: '0 5px'
      },
      directives: [{
        name: 'hasPermission',
        value: 'dict_detail'
      }],
      on: {
        'click': () => {
          vm.$emit('on-dict-type', {
            row: params.row,
            index: params.index
          })
        }
      }
    }, [
      h('p', '查看字典项')
    ])
  },
  // 暂停
  pause: (h, params, vm) => {
    if (params.row.triggerState === 'ACQUIRED' || params.row.triggerState === 'WAITING') {
      return h('Button', {
        props: {
          type: 'warning'
        },
        style: {
          margin: '0 5px'
        },
        directives: [{
          name: 'hasPermission',
          value: 'job_pause'
        }],
        on: {
          'click': () => {
            vm.$emit('on-pause', {
              row: params.row,
              index: params.index
            })
          }
        }
      }, [
        h('p', '暂停')
      ])
    } else {
      return ''
    }
  },
  // 恢复
  resume: (h, params, vm) => {
    if (params.row.triggerState === 'PAUSED') {
      return h('Button', {
        props: {
          type: 'info'
        },
        style: {
          margin: '0 5px'
        },
        directives: [{
          name: 'hasPermission',
          value: 'job_resume'
        }],
        on: {
          'click': () => {
            vm.$emit('on-resume', {
              row: params.row,
              index: params.index
            })
          }
        }
      }, [
        h('p', '恢复')
      ])
    } else {
      return ''
    }
  },
  // 修改
  update: (h, params, vm) => {
    return h('Button', {
      props: {
        type: 'success'
      },
      style: {
        margin: '0 5px'
      },
      directives: [{
        name: 'hasPermission',
        value: 'job_edit'
      }],
      on: {
        'click': () => {
          vm.$emit('on-update', {
            row: params.row,
            index: params.index
          })
        }
      }
    }, [
      h('p', '修改')
    ])
  },
  // 启用
  enabled: (h, params, vm) => {
    return h('Button', {
      props: {
        type: params.row.hasEnabled ? 'error' : 'success'
      },
      style: {
        margin: '0 5px'
      },
      directives: [{
      }],
      on: {
        'click': () => {
          vm.$emit('on-enabled-change', {
            row: params.row,
            index: params.index
          })
        }
      }
    }, [
      h('p', params.row.hasEnabled ? '停用' : '启用')
    ])
  }
}

export default btns
