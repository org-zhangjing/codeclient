<template>
  <div class="main">
    <Card>
      <p slot="title">权限管理</p>
    <Row>
      <Col span="15">
        <Row style="margin-bottom:-10px;margin-left:20px;">
          <Form inline>
            <FormItem label='名称' :label-width="60">
              <Input placeholder="请输入角色名称" v-model="roleQuery.roleName"></Input>
            </FormItem>
            <FormItem label='编码' :label-width="60">
              <Input placeholder="请输入角色编码" v-model="roleQuery.roleCode"></Input>
            </FormItem>
            <FormItem>
              <Button type="info" @click="searchRole" v-hasPermission="'auth_search'">查询</Button>
            </FormItem>
          </Form>
        </Row>
        <Row>
          <Col span="24">
            <tables ref="tables" search-place="top" v-model="datas" :columns="columns" @on-setAuth="setAuth"/>
          </Col>
        </Row>
        <Row>
          <Col span="24" class="page">
            <Page
              :current="page"
              :page-size="pageSize"
              :page-size-opts="[10, 20, 50]"
              :total="total"
              show-elevator
              show-sizer
              show-total
              @on-change="pageChanged"
              @on-page-size-change="pageSizeChanged"
            ></Page>
          </Col>
        </Row>
      </Col>
      <Col span="9">
        <Row style="height:650px;overflow-x:hidden:overflow-y:scroll;">
           <Col span="1" style="padding-left:20px;">
            <Divider type="vertical" style="height:500px;"/>
          </Col>
          <Col span="8" v-if="treeDatas.length > 0" offset="2">
            当前角色：{{selectRole.roleName}}
            <Tree :data="treeData" :render="renderContent" ref="tree" multiple show-checkbox></Tree>
            <Button v-show="treeDatas.length > 0" type="success" style="width:100px;margin:50px;"  @click="saveAuth">提交</Button>
          </Col>
          <Col span="7" offset="4" style="padding-top: 25px;height:500px;" v-if="authBtns.length > 0">
            <Icon type="md-bookmark" style="margin-right:5px;"/>
            <span>
              <span style="font-weight: bold;"></span> - 功能按钮
            </span>
            <Checkbox
              label="item.btnName"
              class="checkbox-line"
              v-bind:key="index"
              v-for="(item, index) in authBtns"
              v-model="item.checked"
              @on-change="checkChange(item, index)"
            >{{item.btnName}}</Checkbox>
          </Col>
        </Row>
      </Col>
    </Row>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { mapActions } from 'vuex'
import { getTree, getTree2 } from '@/libs/tree'
export default {
  name: 'auth',
  components: {
    Tables
  },
  data () {
    return {
      // 授权的按钮数组
      authBtns: [],
      selectMenu: null,
      columns: [{
        title: '序号',
        type: 'index',
        width: 100,
        align: 'center'
      }, {
        title: '角色名称',
        align: 'center',
        key: 'roleName',
        sortable: false
      }, {
        title: '角色编码',
        align: 'center',
        key: 'roleCode',
        sortable: false
      }, {
        title: '操作',
        align: 'center',
        key: 'handle',
        options: ['setAuth']
      }],
      roleQuery: {},
      page: 1,
      pageSize: 10,
      count: 0,
      tableData: [],
      query: {},
      orgTreeData: {
        title: '功能菜单树',
        expand: true,
        attr: { id: 1 },
        children: [],
        render: (h, { root, node, data }) => {
          return h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            }
          }, [
            h('span', [
              h('Icon', {
                props: {
                  type: 'md-settings'
                },
                style: {
                  marginRight: '8px'
                }
              }),
              h('span', {
                style: {
                  cursor: 'pointer'
                }
              }, data.title)
            ])
          ])
        }
      },
      treeDatas: [],
      renderContent: (h, { root, node, data }) => {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          },
          on: {
            click: () => {
              this.selectChange(root, node, data)
            }
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: data.attr.type === 'menu' ? 'ios-paper-outline' : 'md-browsers'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', {
              style: {
                cursor: 'pointer'
              }
            }, data.title)
          ])
        ])
      },
      btnMap: [],
      selectRole: null,
      getAllMenu: [],
      menuBtnMap: {},
      buttonIds: [],
      buttAll: []
    }
  },
  methods: {
    ...mapActions([
      'getRolesList',
      'getFuncTree',
      'setRoleAuth',
      'getMenusList',
      'menuBtnAll',
      'getAuthButns',
      'getAllBtns'
    ]),
    selectChange (root, node, data) {
      // 通过选择的菜单查菜单下所有按钮
      const menuCode = {
        menuCode: data.attr.menuCode
      }
      this.menuBtnAll(menuCode)
        .then(res => {
          this.authBtns = res.data.data.map(item => {
            item.checked = false
            return item
          })
        }).then(() => {
          this.authBtns.forEach((item, index) => {
            if (this.btnMap.indexOf(item.id) !== -1) {
              this.authBtns[index].checked = true
            } else {
              this.authBtns[index].checked = false
            }
          })
        })
    },
    // 将指定的treeData中的node的选中状态取反
    checkedOrUnCheckTree (treeData = [], node) {
    },
    // 一个值跟数组里所有值进行比较，如果找到则把这个值从数组中删除，没有新增到数组
    checkChange (val) {
      if (val.checked === true) {
        this.btnMap.push(val.id)
      } else {
        const butIndex = this.btnMap.indexOf(val.id)
        if (butIndex > -1) {
          this.btnMap.splice(butIndex, 1)
        }
      }
    },
    searchRole () {
      this.query.current = this.page
      this.query.size = this.pageSize
      this.getRolesList(this.$lodash.merge({}, this.query, this.roleQuery)).then(res => {
        const { total, records } = res.data.data
        this.count = total
        this.tableData = records
      }).catch(err => {
        console.error(err)
      })
    },
    // 查询列表
    getData () {
      this.query.current = this.page
      this.query.size = this.pageSize
      this.getRolesList(this.query).then(res => {
        const { total, records } = res.data.data
        this.count = total
        this.tableData = records
      }).catch(err => {
        console.error(err)
      })
    },
    getTreeData (id) {
      // 所有menu
      this.getMenusList().then(res => {
        const getAllMenu = res.data.data.children
        this.treeDatas = getTree(getAllMenu)
        this.getFuncTree(id).then(res => {
          const { menuList, buttonList } = res.data.data
          if (menuList !== null) {
            const menuIds = menuList.map(item => item.id)
            this.treeDatas = getTree2(getAllMenu, menuIds)
          }
          if (buttonList !== null) {
            this.btnMap = buttonList.map(item => item.id)
          }
        })
      }).then(() => {
        this.getAllBtns().then(res => {
          this.buttAll = res.data.data.records.map(item => {
            item.checked = false
            return item
          })
        })
      })
        .catch(err => {
          console.error(err)
        })
    },
    pageChanged (page) {
      this.page = page
      this.getData()
    },
    pageSizeChanged (pageSize) {
      this.pageSize = pageSize
      this.getData()
    },
    setAuth (params) {
      this.selectRole = params.row
      this.authBtns = []
      this.treeDatas = []
      this.btnMap = []
      this.getTreeData(this.selectRole.id)
    },
    // 重置
    resetAuth () {
      // 清除所有菜单下的按钮
      for (const key in this.btnMap) {
        if (this.btnMap.hasOwnProperty(key)) {
          this.btnMap[key].forEach((item, index) => {
            this.btnMap[key][index].checked = false
          })
        }
      }
      // 清除当前选中菜单下的按钮
      this.authBtns = this.authBtns.map(item => {
        item.checked = false
        return item
      })
    },
    // 提交
    saveAuth () {
      const that = this
      const selectedMenus = this.$refs.tree.getCheckedAndIndeterminateNodes()
      // const selectedMenus = getCheckedFromTree(this.treeDatas, [])
      const selectedMenuIds = selectedMenus.map(item => item.attr.id) || []
      const buttonIds = this.btnMap
      if (that.selectRole) {
        that.$Modal.confirm({
          title: '提示',
          content: `是否确认为角色 ${that.selectRole.roleName} 授权？`,
          onOk () {
            // selectedMenuIds.push(1)
            that.setRoleAuth({
              userId: JSON.parse(localStorage.userInfo).id,
              roleId: that.selectRole.id,
              menuIds: selectedMenuIds,
              buttonIds: buttonIds
            }).then(res => {
              if (res.data.error) {
                that.$Notice.error({
                  title: '提示',
                  desc: res.data.error
                })
              } else {
                that.$Notice.success({
                  title: '提示',
                  desc: '操作成功'
                })
              }
            }).catch(err => {
              console.error(err)
            })
          }
        })
      } else {
        that.$Notice.error({
          title: '提示',
          desc: '请选择要授权的角色'
        })
      }
    }
  },
  computed: {
    datas: {
      get () {
        return this.tableData
      },
      set (val) { }
    },
    total: {
      get () {
        return this.count
      },
      set (val) { }
    },
    treeData: {
      get () {
        return [Object.assign({}, this.orgTreeData, {
          children: this.treeDatas
        })]
      },
      set (val) {
      }
    }
  },
  created () {
    this.getData()
  }
}
</script>
<style scoped>
.main {
  padding: 0;
  margin: 0;
}
.page {
  text-align: right;
  margin-top: 10px;
}
.checkbox-line {
  display: block;
  margin: 10px 0 0 10px;
}
</style>
