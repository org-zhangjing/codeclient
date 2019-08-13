<template>
  <div class="main">
    <Card>
      <p slot="title">机构管理</p>
    <Row>
      <Col span="6" style="height:600px;overflow-y:scroll;overflow-x:hidden;">
        <Tree :data="treeData" @on-select-change="select"></Tree>
      </Col>
      <Col span="1">
        <Divider type="vertical" style="height:500px;"/>
      </Col>
      <Col span="17">
        <Row>
          <Col span="24">
            <Tabs value="tabSelectedOrg" type="card">
              <TabPane label="机构信息" name="tabSelectedOrg">
                <Card>
                <Form
                  :model="formItemOrg"
                  :label-width="90"
                  ref="formValidateOrg"
                >
                  <FormItem label="机构编码" prop="orgCode">
                    <Input v-model="formItemOrg.orgCode" disabled></Input>
                  </FormItem>
                  <FormItem label="机构名称" prop="orgName">
                    <Input v-model="formItemOrg.orgName"></Input>
                  </FormItem>
                  <FormItem label="机构备注" prop="remark">
                    <Input v-model="formItemOrg.remark"></Input>
                  </FormItem>
                  <FormItem label="父级机构" prop="parent_orgname">
                    <Input v-model="formItemOrg.parent_orgname" disabled></Input>
                  </FormItem>
                  <FormItem label="机构类型" prop="orgType">
                    <Select v-model="formItemOrg.orgType">
                      <Option value="0">普通机构</Option>
                      <!-- <Option value="1">关联门店</Option> -->
                    </Select>
                  </FormItem>
                  <FormItem label="排序号" prop="sortNo">
                    <Input v-model="formItemOrg.sortNo"></Input>
                  </FormItem>
                  <Input v-model="formItemOrg.id" v-show="false"></Input>
                  <Input v-model="formItemOrg.parentId " v-show="false"></Input>
                  <FormItem class="btns">
                    <Button
                      type="success"
                      style="margin-right:20px;"
                      @click="saveOrgInfo('formValidateOrg')"
                      v-hasPermission="'org_update'"
                    >保存</Button>
                    <Button type="warning" @click="resetForm('formValidateOrg')" v-hasPermission="'org_reset'">重置</Button>
                  </FormItem>
                </Form>
                </Card>
              </TabPane>
              <TabPane label="员工信息" name="tabOrgEmps">
                <Card>
                  <p slot="title">员工信息</p>
                <Row>
                  <Col span="24">
                    <Form inline @submit.native.prevent>
                    <FormItem label="员工名" :label-width="80">
                      <Input placeholder="请输入员工名" v-model="empQuery.name" @keyup.native.enter="search"/>
                    </FormItem>
                    <FormItem>
                      <Button type="info" @click="search" v-hasPermission="'org_emp_search'">查询</Button>
                    </FormItem>
                    </Form>
                  </Col>
                </Row>
                <Row>
                  <Col span="24">
                    <tables
                      size = 'default'
                      ref="tables"
                      highlight-row
                      v-model="datas"
                      :columns="columns"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span="24" class="page">
                    <Page
                      :current="current"
                      :page-size="size"
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
                </Card>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </Col>
    </Row>
    <Modal v-model="orgModal.isShow" title="机构详情" draggable>
      <div slot="footer">
        <Button type="warning" @click="orgModalCancel('formValidate')">取消</Button>
        <Button type="primary" @click="orgModalOk('formValidate')">提交</Button>
      </div>
      <Form :model="formItem" :label-width="90" :rules="ruleValidate" ref="formValidate">
        <FormItem label="机构编码" prop="orgCode">
          <Input v-model="formItem.orgCode"></Input>
        </FormItem>
        <FormItem label="机构名称" prop="orgName">
          <Input v-model="formItem.orgName"></Input>
        </FormItem>
        <FormItem label="机构描述" prop="remark">
          <Input v-model="formItem.remark"></Input>
        </FormItem>
        <FormItem label="父级机构" prop="parent_orgname ">
          <Input v-model="formItem.parent_orgname " disabled></Input>
        </FormItem>
        <FormItem label="排序号" prop="sortNo">
          <Input v-model="formItem.sortNo"></Input>
        </FormItem>
        <Input v-model="formItem.id" v-show="false"></Input>
      </Form>
    </Modal>
    </Card>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { getTree } from '@/libs/tree'
import Tables from '_c/tables'
import { mapActions } from 'vuex'
export default {
  name: 'org',
  components: {
    Tables
  },
  data () {
    const validateOrgName = (rule, value, callback) => {
      const regEn = /[`~!@#$%^&*()_+<>?:"{},.\\/;'[\]]/im
      const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
      if (regEn.test(value) || regCn.test(value)) {
        callback(new Error('名称不能包含特殊字符'))
      } else {
        callback()
      }
    }
    return {
      uploadAction: '/upload',
      buttonProps: {
        type: 'default',
        size: 'small'
      },
      empQuery: {},
      current: 1,
      size: 10,
      count: 0,
      treeDatas: [],
      orgTreeData: {
        title: '机构员工树',
        expand: true,
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
                  // type: 'ios-folder-outline'
                  type: 'ios-paper-outline'
                },
                style: {
                  marginRight: '8px'
                }
              }),
              h('span', data.title)
            ]),
            h('span', {
              style: {
                display: 'inline-block',
                float: 'right',
                marginRight: '32px'
              }
            }, [
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  // icon: 'ios-add',
                  type: 'success',
                  size: 'small'
                }),
                style: {
                  // width: '64px'
                },
                directives: [{
                  name: 'hasPermission',
                  value: 'org_add'
                }],
                on: {
                  click: () => {
                    // this.append(data)
                    if (this.selectedOrg.attr && this.selectedOrg.attr.id) {
                      this.$refs['formValidate'].resetFields()
                      this.formItem.parentId = this.selectedOrg.attr.id
                      this.formItem.parent_orgname = this.selectedOrg.attr.orgName
                      this.formItem.orgType += ''
                      this.orgModal.isShow = true
                    } else {
                      this.formItem.parentId = 1
                      this.formItem.parent_orgname = ''
                      this.formItem.orgType += ''
                      this.orgModal.isShow = true
                      // this.$Notice.error({
                      //   title: '提示',
                      //   desc: '请选择要操作的机构'
                      // })
                    }
                  }
                }
              }, '新增'),
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  // icon: 'ios-add',
                  type: 'error',
                  size: 'small'
                }),
                style: {
                  // width: '64px',
                  marginLeft: '5px'
                },
                directives: [{
                  name: 'hasPermission',
                  value: 'org_del'
                }],
                on: {
                  click: () => {
                    const that = this
                    if (that.selectedOrg.attr && that.selectedOrg.attr.id) {
                      that.$Modal.confirm({
                        title: '提示',
                        content: '是否确认删除？',
                        onOk () {
                          that.removeOrg(that.selectedOrg.attr.id).then(res => {
                            if (res.data.error) {
                              that.$Notice.error({
                                title: '提示',
                                desc: res.data.error
                              })
                            } else {
                              that.formItemOrg.orgCode = ''
                              that.formItemOrg.parent_orgname = ''
                              that.formItemOrg.orgName = ''
                              that.formItemOrg.remark = ''
                              that.formItemOrg.orgType = ''
                              that.formItemOrg.parentId = ''
                              that.formItemOrg.sortNo = ''
                              that.getData()
                            }
                          }).catch(err => {
                            console.error(err)
                          })
                        }
                      })
                    } else {
                      that.$Notice.error({
                        title: '提示',
                        desc: '请选择要操作的机构'
                      })
                    }
                  }
                }
              }, '删除')
            ])
          ])
        },
        children: []
      },
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 100,
          align: 'center'
        },
        {
          title: '员工名',
          align: 'center',
          key: 'name',
          sortable: false
        },
        {
          title: '用户状态',
          align: 'center',
          key: 'userStatus',
          sortable: false,
          render: function (h, params) {
            return h('span', this.row.userStatus ? '停用' : '启用')
          }
        },
        {
          title: '注册时间',
          width: 180,
          align: 'center',
          key: 'registerTime',
          editable: false,
          render: function (h, params) {
            return h(
              'span',
              this.row.registerTime ? dayjs(this.row.registerTime).format('YYYY-MM-DD HH:mm:ss') : '-'
            )
          }
        },
        {
          title: '上次登录时间',
          width: 180,
          align: 'center',
          key: 'lastLoginTime',
          editable: false,
          render: function (h, params) {
            return h(
              'span',
              this.row.lastLoginTime ? dayjs(this.row.lastLoginTime).format('YYYY-MM-DD HH:mm:ss') : '-'
            )
          }
        },
        {
          title: '上次登录IP',
          width: 180,
          align: 'center',
          key: 'lastLoginIp',
          editable: false,
          render: function (h, params) {
            return h(
              'span',
              this.row.lastLoginIp || '-'
            )
          }
        }
      ],
      page: 1,
      pageSize: 10,
      tableData: [],
      query: {},
      orgModal: {
        isShow: false
      },
      authModal: {
        isShow: false
      },
      empModal: {
        isShow: false
      },
      formItem: {
        orgCode: '',
        orgName: '',
        remark: '',
        orgType: '0',
        parentId: 1,
        sortNo: ''
      },
      formItemOrg: {
        orgCode: '',
        orgName: '',
        remark: '',
        orgType: '0',
        parentId: 1,
        sortNo: ''
      },
      formItemEmp: {
        username: '',
        hashed_password: '',
        is_block: '0',
        avatar: '',
        visible: false
      },
      ruleValidate: {
        orgCode: [{
          required: true, message: '请输入机构编码', trigger: 'change', type: 'string'
        }, {
          validator: validateOrgName, trigger: 'change'
        }, {
          type: 'string', message: '请输入2-10位字符信息', min: 2, max: 10, trigger: 'change'
        }],
        orgName: [{
          required: true, message: '请输入机构名称', trigger: 'change', type: 'string'
        }, {
          validator: validateOrgName, trigger: 'change'
        }],
        orgType: [{
          required: true, message: '请选择机构类型', trigger: 'change', type: 'string'
        }]
      },
      ruleValidateEmp: {
        username: [{
          required: true, message: '请输入员工名', trigger: 'change', type: 'string'
        }],
        hashed_password: [{
          required: true, message: '请输入初始密码', trigger: 'change', type: 'string'
        }]
      },
      selectedOrg: {}, // 当前选中的机构
      // 已授权的角色
      authedRoles: [],
      authedRolesEmp: [],
      // 所有角色
      allRoles: [],
      allRolesEmp: [],
      authedEmpId: null // 正在授权的员工id
    }
  },
  methods: {
    ...mapActions([
      'getOrgsList',
      'addOrgInfo',
      'removeOrg',
      'updateOrgInfo',
      'addOrgEmpInfo',
      'orgAuth',
      'orgRoles',
      'empRoles',
      'empAuth'
    ]),
    ...mapActions(['getAllAdmin', 'delAdmin', 'updateAdmin']),
    ...mapActions({
      add: 'addAdmin'
    }),
    ...mapActions(['getRolesList']),
    // 头像上传
    handleSuccess (res, file) {
      if (res.url) {
        this.formItemEmp.avatar = res.url || ''
        this.formItemEmp.visible = true
      }
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc:
          '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 太大，不能超过 1M。'
      })
    },
    search () {
      this.query.current = this.page
      this.query.size = this.pageSize
      this.getEmpData(this.$lodash.merge({}, this.empQuery, this.query))
    },
    saveOrgInfo (name) {
      if (this.selectedOrg.attr && this.selectedOrg.attr.id) {
        this.$refs[name].validate(valid => {
          if (valid) {
            this.updateOrgInfo({
              id: this.formItemOrg.id,
              orgCode: this.formItemOrg.orgCode,
              orgName: this.formItemOrg.orgName,
              remark: this.formItemOrg.remark,
              orgType: this.formItemOrg.orgType,
              sortNo: this.formItemOrg.sortNo
            }).then(res => {
              if (res.data.eror) {
                this.$Notice.error({
                  title: '提示',
                  desc: res.data.eror
                })
              } else {
                this.$Notice.success({
                  title: '提示',
                  desc: '操作成功'
                })
                this.getData()
              }
            }).catch(err => {
              console.error(err)
            })
          }
        })
      } else {
        this.$Notice.error({
          title: '提示',
          desc: '请选择要操作的机构'
        })
      }
    },
    resetForm (name) {
      this.$refs[name].resetFields()
      if (this.selectedOrg.attr) {
        this.formItemOrg.id = this.selectedOrg.attr.id
        this.formItemOrg.parentId = this.selectedOrg.attr.parentId
        this.formItemOrg.parent_orgname = this.selectedOrg.attr.orgName
        this.formItemOrg.orgCode = this.selectedOrg.attr.orgCode
        this.formItemOrg.orgType = this.selectedOrg.attr.orgType
      }
    },
    // 新增员工
    addEmp (name) {
      if (this.selectedOrg.attr && this.selectedOrg.attr.id) {
        this.$refs[name].resetFields()
        this.empModal.isShow = true
        this.formItemEmp.visible = false
      } else {
        this.$Notice.error({
          title: '提示',
          desc: '请先选择要操作的机构'
        })
      }
    },
    // 查询列表
    getData () {
      // this.query.current = this.page
      // this.query.size = this.pageSize
      this.getOrgsList().then(res => {
        const records = res.data.data.children
        this.treeDatas = getTree(records)
      }).catch(err => {
        console.error(err)
      })
    },
    getEmpData (query) {
      this.getAllAdmin(query).then(res => {
        const { records, total } = res.data.data
        this.tableData = records || []
        this.count = total
      }).catch(err => {
        console.error(err)
      })
    },
    pageChanged (page) {
      this.page = page
      this.query.current = this.page
      this.getEmpData(this.query)
    },
    pageSizeChanged (pageSize) {
      this.pageSize = pageSize
      this.query.size = this.pageSize
      this.getEmpData(this.query)
    },
    onDetail (params) {
      this.$refs['formValidateEmp'].resetFields()
      this.empModal.isShow = true
      this.formItemEmp.visible = false
      this.formItemEmp = params.row
      this.formItemEmp.is_block = !!this.formItemEmp.is_block === true ? '1' : '0'
      if (this.formItemEmp.avatar) {
        this.formItemEmp.visible = true
      } else {
        this.formItemEmp.visible = false
      }
    },
    onDelete (params) {
      const rowId = params.row.id
      this.delAdmin(rowId).then(res => {
        this.getEmpData(this.query)
      }).catch(err => {
        console.error(err)
      })
    },
    addOrg () {

    },
    orgModalOk (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // 新增角色接口
          if (this.formItem.id) {
            this.updateOrgInfo({
              orgCode: this.formItem.orgCode,
              orgName: this.formItem.orgName,
              remark: this.formItem.remark,
              id: this.formItem.id
            }).then(res => {
              this.orgModal.isShow = false
              this.getData()
            }).catch(err => {
              console.error(err)
            })
          } else {
            this.addOrgInfo(this.formItem).then(res => {
              this.orgModal.isShow = false
              this.getData()
            }).catch(err => {
              console.error(err)
            })
          }
        }
      })
    },
    // 员工保存按钮
    empModalOk (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.formItemEmp.id) {
            this.updateAdmin(this.formItemEmp).then(res => {
              if (!res.data.error) {
                this.empModal.isShow = false
                this.getEmpData(this.query)
                this.$Notice.success({
                  title: '提示',
                  desc: '操作成功'
                })
              } else {
                this.$Notice.error({
                  title: '提示',
                  desc: res.data.error
                })
              }
            }).catch(err => {
              console.error(err)
            })
          } else {
            this.addOrgEmpInfo({
              orgid: this.selectedOrg.attr.id,
              emp: this.formItemEmp
            }).then(res => {
              this.empModal.isShow = false
              this.getEmpData(this.query)
            }).catch(err => {
              console.error(err)
            })
          }
        }
      })
    },
    // 员工取消保存按钮
    empModalCancel () {
      this.empModal.isShow = false
    },
    // 机构取消保存按钮
    orgModalCancel (name) {
      this.orgModal.isShow = false
    },
    select (value) {
      if (value.length > 0) {
        this.selectedOrg = this.$lodash.cloneDeep(value[0])
        // 设置选中信息
        this.$refs['formValidate'].resetFields()
        this.formItemOrg = this.$lodash.cloneDeep(value[0].attr)
        this.formItemOrg.parentId = this.selectedOrg.attr.id
        this.formItemOrg.parent_orgname = this.selectedOrg.attr.orgName
        this.formItemOrg.orgType += ''
        // 根据选中的机构查询底下的员工
        this.query.orgId = this.selectedOrg.attr.id
        this.getEmpData(this.query)
      } else {
        this.selectedOrg = {}
        this.formItemOrg.orgCode = ''
        this.formItemOrg.orgName = ''
        this.formItemOrg.remark = ''
        this.formItemOrg.orgType = ''
        this.formItemOrg.parentId = ''
        this.formItemOrg.sortNo = ''
        this.formItemOrg.parent_orgname = ''
        delete this.query.orgId
        this.getEmpData(this.query)
      }
      // 查询当前机构已授权的角色
      // this.getOrgRoles(this.selectedOrg.attr.id)
    },
    getOrgRoles (orgid) {
      this.orgRoles(orgid).then(res => {
        this.authedRoles = res.data.map(item => {
          item.checked = true
          return item
        })
        const authedRolesIds = this.$lodash.map(this.authedRoles, 'id') || []
        // 修改全部角色选中
        this.allRoles.forEach((item, index) => {
          if (authedRolesIds.indexOf(item.id) !== -1) {
            this.allRoles[index].checked = true
          } else {
            this.allRoles[index].checked = false
          }
        })
      }).catch(err => {
        console.error(err)
      })
    },
    getEmpRoles (empid) {
      this.empRoles(empid).then(res => {
        this.authModal.isShow = true
        this.authedRolesEmp = res.data.map(item => {
          item.checked = true
          return item
        })
        const authedRolesIds = this.$lodash.map(this.authedRolesEmp, 'id') || []
        // 修改全部角色选中
        this.allRolesEmp.forEach((item, index) => {
          if (authedRolesIds.indexOf(item.id) !== -1) {
            this.allRolesEmp[index].checked = true
          } else {
            this.allRolesEmp[index].checked = false
          }
        })
      }).catch(err => {
        console.error(err)
      })
    },
    append (data) {
      const children = data.children || []
      children.push({
        title: '机构',
        expand: true
      })
      this.$set(data, 'children', children)
    },
    remove (root, node, data) {
      const parentKey = root.find(el => el === node).parent
      const parent = root.find(el => el.nodeKey === parentKey).node
      const index = parent.children.indexOf(data)
      parent.children.splice(index, 1)
    },
    getRoles () {
      // 获取角色列表
      this.getRolesList().then(res => {
        this.allRoles = res.data.data.map(item => {
          item.checked = false
          return item
        })
        this.allRolesEmp = this.$lodash.cloneDeep(this.allRoles)
      }).catch(err => {
        console.error(err)
      })
    },
    // 角色选择change时触发
    roleChange (val, index) {
      // 先清空已选择的角色
      this.authedRoles = []
      this.allRoles.forEach(item => {
        item.checked && (this.authedRoles.push(item))
      })
    },
    // 角色选择change时触发
    roleChangeEmp (val, index) {
      // 先清空已选择的角色
      this.authedRolesEmp = []
      this.allRolesEmp.forEach(item => {
        item.checked && (this.authedRolesEmp.push(item))
      })
    },
    // 确认授权
    confirmAuth () {
      if (this.selectedOrg.attr && this.selectedOrg.attr.id) {
        const that = this
        that.$Modal.confirm({
          title: '提示',
          content: `确认为 ${that.selectedOrg.attr.orgName} 授权?`,
          onOk () {
            // 调用权限设置接口
            const authedRoles = []
            that.authedRoles.forEach(item => {
              if (item.checked) {
                authedRoles.push(item.id)
              }
            })
            that.orgAuth({
              orgId: that.selectedOrg.attr.id,
              authedRoles
            }).then(res => {
              if (!res.data.error) {
                this.$Notice.success({
                  title: '提示',
                  desc: '授权成功'
                })
              } else {
                this.$Notice.error({
                  title: '提示',
                  desc: res.data.error
                })
              }
            }).catch(err => {
              console.error(err)
            })
          }
        })
      } else {
        this.$Notice.error({
          title: '提示',
          desc: '请先选择要操作的机构'
        })
      }
    },
    // 确认授权
    confirmAuthEmp () {
      // TODO:员工授权
      if (this.authedEmpId) {
        const that = this
        const selectEmp = this.datas.find(item => item.id === this.authedEmpId)
        that.$Modal.confirm({
          title: '提示',
          content: `确认为 ${selectEmp.username} 授权?`,
          onOk () {
            // 调用权限设置接口
            const authedRoles = []
            that.authedRolesEmp.forEach(item => {
              if (item.checked) {
                authedRoles.push(item.id)
              }
            })
            that.empAuth({
              empId: that.authedEmpId,
              authedRoles
            }).then(res => {
              if (!res.data.error) {
                that.$Notice.success({
                  title: '提示',
                  desc: '授权成功'
                })
                that.authModal.isShow = false
                that.authedEmpId = null
              } else {
                that.$Notice.error({
                  title: '提示',
                  desc: res.data.error
                })
              }
            }).catch(err => {
              console.error(err)
            })
          }
        })
      } else {
        this.$Notice.error({
          title: '提示',
          desc: '请先选择要授权的员工'
        })
      }
    },
    // 全选
    allAuth () {
      this.authedRoles.forEach((item, index) => {
        this.authedRoles[index].checked = true
      })
    },
    // 全选
    allAuthEmp () {
      this.authedRolesEmp.forEach((item, index) => {
        this.authedRolesEmp[index].checked = true
      })
    },
    // 取消选中
    cancelAuth () {
      this.authedRoles.forEach((item, index) => {
        this.authedRoles[index].checked = false
      })
    },
    // 取消选中
    cancelAuthEmp () {
      this.authedRolesEmp.forEach((item, index) => {
        this.authedRolesEmp[index].checked = false
      })
    },
    // 员工权限设置按钮
    onAuth (params) {
      // 查询该员工的已授权的角色列表
      this.authedRolesEmp = []
      this.authedEmpId = params.row.id
      this.getEmpRoles(params.row.id)
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
        return [Object.assign(this.orgTreeData, {
          children: this.treeDatas
        })]
      },
      set (val) {
        // this.orgTreeData.children = this.treeDatas
        // this.treeData = [this.orgTreeData]
      }
    }
  },
  created () {
    this.getData()
    this.query.current = this.page
    this.query.size = this.pageSize
    this.getEmpData(this.query)
    // this.getRoles()
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
  margin-top: 5px;
}
/* .ivu-card {
  height: 650px;
} */
.btns {
  text-align: center;
}
.authedArea {
  text-align: left;
  padding-left: 37.86px;
}
.authBtns {
  text-align: center;
  margin-top: 30%;
}
.authsArea {
  text-align: left;
}
.checkbox-line {
  display: block;
  margin-top: 15px;
}
</style>
