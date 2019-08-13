<template>
  <div class="main">
    <Card>
      <p slot="title">菜单管理</p>
    <Row>
      <Col span="24">
        <Row>
          <Col span="6" style="height:550px;position:relative">
            <Tree :data="treeData" @on-select-change="select" style="height:550px;overflow-y:scroll;overflow-x:hidden;"></Tree>
            <Button type="success" size="small" v-hasPermission="'menu_add'" style="position:absolute;top:5px;right:75px"  @click="addButton">新增</Button>
            <Button type="error" size="small" v-hasPermission="'menu_del'" style="position:absolute;top:5px;right:30px" @click="delButton">删除</Button>
          </Col>
          <Col span="1">
            <Divider type="vertical" style="height:550px;"/>
          </Col>
          <Col span="17">
            <Tabs value="tabSelectedMenu" type="card">
              <TabPane label="菜单信息" name="tabSelectedMenu">
                <Card>
                <Form
                  :model="formItemMenu"
                  :label-width="90"
                  :rules="ruleValidate"
                  ref="formValidateMenu"
                >
                  <FormItem label="菜单编码" prop="menuCode">
                    <Input v-model="formItemMenu.menuCode" disabled></Input>
                  </FormItem>
                  <FormItem label="菜单名称" prop="name">
                    <Input v-model="formItemMenu.menuLabel"></Input>
                  </FormItem>
                  <FormItem label="菜单Icon">
                    <Input v-model="formItemMenu.menuIcon"></Input>
                  </FormItem>
                  <FormItem label="父级菜单">
                    <treeselect :isDefaultExpanded="true" v-model="formItemMenu.parentId" :clearable="false" placeholder="请选择父级菜单" noChildrenText="无子节点" :multiple="false" noOptionsText="无数据" :options="menuTrees" :allowClearingDisabled="true"/>
                  </FormItem>
                  <!-- <FormItem label="菜单类型" prop="menuOpenMode">
                    <Select v-model="formItemMenu.menuOpenMode">
                      <Option value="0">左侧栏菜单</Option>
                    </Select>
                  </FormItem>-->
                  <FormItem label="菜单url" prop="component">
                    <Input v-model="formItemMenu.component"></Input>
                  </FormItem>
                  <FormItem label="排序号" prop="menuOrder">
                    <Input v-model="formItemMenu.menuOrder"></Input>
                  </FormItem>
                  <FormItem class="btns">
                    <Button
                      type="success"
                      style="margin-right:20px;"
                      v-hasPermission="'menu_update'"
                      @click="saveMenuInfo('formValidateMenu')"
                    >保存</Button>
                    <Button
                      type="warning"
                      @click="resetForm('formValidateMenu')"
                      v-hasPermission="'menu_reset'"
                    >重置</Button>
                  </FormItem>
                </Form>
                </Card>
              </TabPane>
              <TabPane label="按钮信息" name="tabSelectedEmp">
                <Card>
                  <p slot="title">按钮信息</p>
                <Row>
                  <Form inline>
                    <FormItem label="名称" :label-width="80">
                      <Input placeholder="请输入按钮名称" v-model="btnQuery.btnName"/>
                    </FormItem>
                    <FormItem label="编码" :label-width="80">
                      <Input placeholder="请输入按钮编码" v-model="btnQuery.btnCode"/>
                    </FormItem>
                    <FormItem>
                      <Button type="info" @click="searchBtn" v-hasPermission="'menu_btn_search'">查询</Button>
                    </FormItem>
                    <FormItem>
                      <Button
                        type="success"
                        @click="addBtn('formValidateBtn')"
                        v-hasPermission="'menu_btn_add'"
                      >新增</Button>
                    </FormItem>
                    <FormItem>
                      <Button type="error" @click="onDelete" v-hasPermission="'menu_btn_del'">删除</Button>
                    </FormItem>
                  </Form>
                  <Modal v-model="btnModal.isShow" title="按钮详情">
                    <div slot="footer">
                      <Button type="warning" @click="btnModalCancel('formValidateBtn')">取消</Button>
                      <Button type="primary" @click="btnModalOk('formValidateBtn')">提交</Button>
                    </div>
                    <Form
                      :model="formItemBtn"
                      :label-width="90"
                      :rules="ruleValidateBtn"
                      ref="formValidateBtn"
                    >
                      <FormItem label="按钮名称" prop="btnName">
                        <Input v-model="formItemBtn.btnName"></Input>
                      </FormItem>
                      <FormItem label="按钮标签" prop="btnLabel">
                        <Input v-model="formItemBtn.btnLabel"></Input>
                      </FormItem>
                      <FormItem label="按钮编码" prop="btnCode">
                        <Input v-model="formItemBtn.btnCode"></Input>
                      </FormItem>
                    </Form>
                  </Modal>
                </Row>
                <Row>
                  <Col span="24">
                    <tables
                      size="default"
                      highlight-row
                      @on-current-change="delChange"
                      @on-row-dblclick="dbClick"
                      ref="tables"
                      search-place="top"
                      v-model="datas"
                      @on-detail="onDetail"
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
    <Modal v-model="menuModal.isShow" title="菜单详情">
      <div slot="footer">
        <Button type="warning" @click="menuModalCancel('formValidate')">取消</Button>
        <Button type="primary" @click="menuModalOk('formValidate')">提交</Button>
      </div>
      <Form :model="formItem" :label-width="90" :rules="ruleValidate" ref="formValidate">
        <FormItem label="菜单编码" prop="menuCode">
          <Input v-model="formItem.menuCode"></Input>
        </FormItem>
        <FormItem label="菜单名称" prop="menuLabel">
          <Input v-model="formItem.menuLabel"></Input>
        </FormItem>
        <FormItem label="菜单Icon">
          <Input v-model="formItem.menuIcon"></Input>
        </FormItem>
        <!-- <FormItem label="菜单类型" prop="menuOpenMode">
          <Select v-model="formItemMenu.menuOpenMode">
            <Option value="0">左侧栏菜单</Option>
          </Select>
        </FormItem>-->
        <!-- <FormItem label="菜单" prop="menuLabel">
          <Input v-model="formItem.menuLabel"></Input>
        </FormItem>-->
        <FormItem label="父级菜单">
          <Input v-model="formItem.parentName" disabled></Input>
        </FormItem>
        <FormItem label="菜单url" prop="component">
          <Input v-model="formItem.component"></Input>
        </FormItem>
        <FormItem label="排序号" prop="menuOrder">
          <Input v-model="formItem.menuOrder"></Input>
        </FormItem>
      </Form>
    </Modal>
    </Card>
  </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getTree, getInfoById, getMenuTree } from '@/libs/tree'
import Tables from '_c/tables'
import { mapActions } from 'vuex'
export default {
  name: 'authmenu',
  components: {
    Tables, Treeselect
  },
  data () {
    const validateMenuCode = (rule, value, callback) => {
      const regEn = /[`~!@#$%^&*()_+<>?:"{},.\\/;'[\]]/im
      const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
      if (regEn.test(value) || regCn.test(value)) {
        callback(new Error('名称不能包含特殊字符'))
      } else {
        callback()
      }
    }
    return {
      menuTrees: [], // 菜单树
      buttonProps: {
        type: 'default',
        size: 'small'
      },
      btnQuery: {},
      treeDatas: [],
      menuTreeData: {
        title: '菜单管理',
        expand: true,
        render: (h, { root, node, data }) => {
          return h(
            'span',
            {
              style: {
                display: 'inline-block',
                width: '100%'
              }
            },
            [
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
              h(
                'span',
                {
                  style: {
                    display: 'inline-block',
                    float: 'right',
                    marginRight: '32px'
                  }
                },
                [
                  // h(
                  //   'Button',
                  //   {
                  //     props: Object.assign({}, this.buttonProps, {
                  //       // icon: 'ios-add',
                  //       type: 'success'
                  //     }),
                  //     // style: {
                  //     //   width: '64px'
                  //     // },
                  //     style: {
                  //       position: 'absolute',
                  //       right: '100px',
                  //       top: '5px',
                  //       width: '64px'
                  //     },
                  //     directives: [{
                  //       name: 'hasPermission',
                  //       value: 'menu_add'
                  //     }],
                  //     on: {
                  //       click: () => {
                  //         this.$refs['formValidate'].resetFields()
                  //         this.formItem.parentId =
                  //           this.selectedMenu &&
                  //             this.selectedMenu.attr &&
                  //             this.selectedMenu.attr.id
                  //             ? this.selectedMenu.attr.id
                  //             : ''
                  //         this.formItem.parentName =
                  //           this.selectedMenu &&
                  //           this.selectedMenu.attr &&
                  //           this.selectedMenu.attr.menuLabel
                  //             ? this.selectedMenu.attr.menuLabel
                  //             : ''
                  //         this.menuModal.isShow = true
                  //         this.formItemMenu.mode = 'add'
                  //       }
                  //     }
                  //   },
                  //   '新增'
                  // )
                  // h(
                  //   'Button',
                  //   {
                  //     props: Object.assign({}, this.buttonProps, {
                  //       // icon: 'ios-add',
                  //       type: 'error'
                  //     }),
                  //     style: {
                  //       position: 'absolute',
                  //       right: '20px',
                  //       top: '5px',
                  //       width: '64px'
                  //     },
                  //     directives: [{
                  //       name: 'hasPermission',
                  //       value: 'menu_del'
                  //     }],
                  //     on: {
                  //       click: () => {
                  //         const that = this
                  //         if (
                  //           that.selectedMenu.attr &&
                  //           that.selectedMenu.attr.id
                  //         ) {
                  //           that.$Modal.confirm({
                  //             title: '提示',
                  //             content: '是否确认删除？',
                  //             onOk () {
                  //               that
                  //                 .removeMenu(that.selectedMenu.attr.id)
                  //                 .then(res => {
                  //                   if (res.data.error) {
                  //                     that.$Notice.error({
                  //                       title: '提示',
                  //                       desc: res.data.error
                  //                     })
                  //                   } else {
                  //                     that.getData()
                  //                   }
                  //                 })
                  //                 .catch(err => {
                  //                   console.error(err)
                  //                 })
                  //             }
                  //           })
                  //         } else {
                  //           that.$Notice.error({
                  //             title: '提示',
                  //             desc: '请选择要操作的菜单'
                  //           })
                  //         }
                  //       }
                  //     }
                  //   },
                  //   '删除'
                  // )
                ]
              )
            ]
          )
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
          title: '按钮名称',
          align: 'center',
          key: 'btnName',
          sortable: false
        },
        {
          title: '按钮标签',
          align: 'center',
          key: 'btnLabel',
          sortable: false
        },
        {
          title: '按钮编码',
          align: 'center',
          key: 'btnCode',
          sortable: false
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          options: ['detail']
        }
      ],
      current: 1,
      size: 7,
      page: 1,
      pageSize: 7,
      count: 0,
      tableData: [],
      query: {},
      menuModal: {
        isShow: false
      },
      authModal: {
        isShow: false
      },
      btnModal: {
        isShow: false
      },
      formItem: {
        menuCode: '',
        // name: '',
        // menuType: '0',
        parentId: '',
        path: '',
        menuLabel: '',
        parentName: '',
        menuOrder: 0,
        menuIcon: ''
      },
      formItemMenu: {
        menuCode: '',
        path: '',
        // name: '',
        // menuType: '0',
        menuOpenMode: 0,
        parentName: '',
        parentId: 0,
        menuLabel: '',
        menuOrder: 0,
        menuIcon: '',
        mode: 'add'
      },
      formItemBtn: {
        btnName: '',
        btnLabel: '',
        btnCode: '',
        menuCode: '',
        mode: ''
      },
      ruleValidate: {
        menuCode: [
          {
            required: true,
            message: '请输入菜单编码',
            trigger: 'change',
            type: 'string'
          }, {
            validator: validateMenuCode, trigger: 'change'
          }, {
            type: 'string', message: '请输入2-10位字符信息', min: 2, max: 10, trigger: 'change'
          }
        ],
        menuLabel: [
          {
            required: true,
            message: '请输入菜单名称',
            trigger: 'change',
            type: 'string'
          }
        ],
        // menuType: [
        //   {
        //     required: true,
        //     message: '请选择菜单类型',
        //     trigger: 'change',
        //     type: 'string'
        //   }
        // ],
        path: [
          {
            required: true,
            message: '请选择菜单url',
            trigger: 'change',
            type: 'string'
          }
        ]
      },
      ruleValidateBtn: {
        btnName: [
          {
            required: true,
            message: '请输入按钮名称',
            trigger: 'change',
            type: 'string'
          }
        ],
        btnCode: [
          {
            required: true,
            message: '请输入对应编码',
            trigger: 'change',
            type: 'string'
          }
        ]
      },
      selectedMenu: {}, // 当前选中的菜单
      staffId: -1
    }
  },
  methods: {
    ...mapActions([
      'getMenusList',
      'addMenuInfo',
      'removeMenu',
      'updateMenuInfo',
      'addMenuBtnInfo',
      'menuAuth',
      'getAllBtns',
      'delBtn',
      'menuBtnAll',
      'updateBtn'
    ]),
    saveMenuInfo (name) {
      if (this.selectedMenu.attr && this.selectedMenu.attr.menuCode) {
        this.$refs[name].validate(valid => {
          if (valid) {
            this.updateMenuInfo({
              id: this.formItemMenu.id,
              menuCode: this.formItemMenu.menuCode,
              menuLabel: this.formItemMenu.menuLabel,
              parentId: this.formItemMenu.parentId,
              menuOpenMode: this.formItemMenu.menuOpenMode,
              menuOrder: this.formItemMenu.menuOrder,
              path: this.formItemMenu.path,
              menuIcon: this.formItemMenu.menuIcon
            })
              .then(res => {
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
              })
              .catch(err => {
                console.error(err)
              })
          }
        })
      } else {
        this.$Notice.error({
          title: '提示',
          desc: '请选择要操作的菜单'
        })
      }
    },
    resetForm (name) {
      this.$refs[name].resetFields()
      if (this.selectedMenu.attr) {
        this.formItemMenu.menuCode = this.selectedMenu.attr.menuCode
      }
    },
    // 菜单新增
    addButton () {
      this.$refs['formValidate'].resetFields()
      this.formItem.menuIcon = ''
      this.formItem.parentId =
        this.selectedMenu &&
          this.selectedMenu.attr &&
          this.selectedMenu.attr.id
          ? this.selectedMenu.attr.id
          : ''
      this.formItem.parentName =
        this.selectedMenu &&
          this.selectedMenu.attr &&
          this.selectedMenu.attr.menuLabel
          ? this.selectedMenu.attr.menuLabel
          : ''
      this.menuModal.isShow = true
      this.formItemMenu.mode = 'add'
    },
    // 菜单删除
    delButton () {
      const that = this
      if (
        that.selectedMenu.attr &&
        that.selectedMenu.attr.id
      ) {
        that.$Modal.confirm({
          title: '提示',
          content: '是否确认删除？',
          onOk () {
            that
              .removeMenu(that.selectedMenu.attr.id)
              .then(res => {
                if (res.data.error) {
                  that.$Notice.error({
                    title: '提示',
                    desc: res.data.error
                  })
                } else {
                  that.getData()
                }
              })
              .catch(err => {
                console.error(err)
              })
          }
        })
      } else {
        that.$Notice.error({
          title: '提示',
          desc: '请选择要操作的菜单'
        })
      }
    },
    // 新增按钮
    addBtn (name) {
      if (this.selectedMenu.attr && this.selectedMenu.attr.menuCode) {
        this.$refs[name].resetFields()
        this.btnModal.isShow = true
        this.formItemBtn.mode = 'add'
      } else {
        this.$Notice.error({
          title: '提示',
          desc: '请先选择要操作的菜单'
        })
      }
    },
    // 单及某行数据
    delChange (val) {
      this.staffId = val.id
    },
    dbClick (row, index) {

    },
    // 查询列表
    getData () {
      this.getMenusList()
        .then(res => {
          const result = res.data.data.children
          this.treeDatas = getTree(result)
          this.menuTrees = [{
            id: 0,
            label: '请选择父级菜单',
            children: getMenuTree(result)
          }]
          // // 设置默认父级
          // if (this.menuTrees.length) {
          //   this.formItemMenu.parentId = this.menuTrees[0].attr.id
          // }
        })
        .catch(err => {
          console.error(err)
        })
    },
    searchBtn () {
      this.getMenuBtns(this.$lodash.merge({}, this.query, this.btnQuery))
    },
    getMenuBtns (query) {
      if (this.selectedMenu.attr) {
        query.menuCode = this.selectedMenu.attr.menuCode
      }
      this.getAllBtns(query)
        .then(res => {
          const { records, total } = res.data.data
          this.tableData = records || []
          this.count = total
        })
        .catch(err => {
          console.error(err)
        })
    },
    pageChanged (page) {
      this.page = page
      this.query.current = this.page
      this.getMenuBtns(this.query)
    },
    pageSizeChanged (size) {
      this.pageSize = size
      this.query.size = this.pageSize
      this.getMenuBtns(this.query)
    },
    onDetail (params) {
      this.$refs['formValidateBtn'].resetFields()
      this.btnModal.isShow = true
      this.formItemBtn = params.row
      this.formItemBtn.mode = 'edit'
      // this.formItemBtn.id = params.row.btnCode
    },
    onDelete () {
      if (this.staffId === -1) {
        this.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行删除'
        })
      } else {
        this.delBtn(this.staffId)
          .then(res => {
            if (res.data.error) {
              this.$Notice.error({
                title: '提示',
                desc: res.data.error
              })
            } else {
              this.$Notice.success({
                title: '提示',
                desc: '删除成功'
              })
            }
            this.getMenuBtns(this.query)
          })
          .catch(err => {
            console.error(err)
          })
      }
    },
    menuModalOk (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // 新增接口
          if (this.formItemMenu.mode === 'edit') {
            this.formItem.path = this.formItem.menuCode
            this.formItem.name = this.formItem.menuLabel
            // this.formItem.menuIcon = this.formItem.menuIcon
            // delete this.formItem.parentName
            this.updateMenuInfo(this.formItem)
              .then(res => {
                this.menuModal.isShow = false
                this.getData()
              })
              .catch(err => {
                console.error(err)
              })
          } else {
            if (!this.formItem.parentId) {
              this.formItem.parentId = 1
            }
            this.formItem.path = this.formItem.menuCode
            this.formItem.name = this.formItem.menuLabel
            // this.formItem.menuIcon = this.formItem.menuIcon
            // delete this.formItem.parentName
            this.addMenuInfo(this.formItem)
              .then(res => {
                this.menuModal.isShow = false
                this.getData()
              })
              .catch(err => {
                console.error(err)
              })
          }
        }
      })
    },
    // 按钮保存按钮
    btnModalOk (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.formItemBtn.mode === 'edit') {
            this.updateBtn({
              id: this.formItemBtn.id,
              btnCode: this.formItemBtn.btnCode,
              btnLabel: this.formItemBtn.btnLabel,
              btnName: this.formItemBtn.btnName
            })
              .then(res => {
                if (!res.data.error) {
                  this.btnModal.isShow = false
                  this.getMenuBtns(this.query)
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
              })
              .catch(err => {
                console.error(err)
              })
          } else {
            this.formItemBtn.menuCode = this.selectedMenu.attr.menuCode
            this.addMenuBtnInfo(this.formItemBtn)
              .then(res => {
                this.btnModal.isShow = false
                this.getMenuBtns(this.query)
              })
              .catch(err => {
                console.error(err)
              })
          }
        }
      })
    },
    // 按钮取消保存按钮
    btnModalCancel () {
      this.btnModal.isShow = false
    },
    // 菜单取消保存按钮
    menuModalCancel (name) {
      this.menuModal.isShow = false
    },
    // 选择左侧菜单管理
    select (value) {
      if (!value || !value.length) return
      this.selectedMenu = this.$lodash.cloneDeep(value[0])
      // 设置选中信息
      this.$refs['formValidate'].resetFields()
      const parentMenuInfo = getInfoById(this.treeData, this.selectedMenu.attr.parentId)
      this.formItemMenu = this.$lodash.cloneDeep(value[0].attr)
      if (parentMenuInfo) {
        this.formItemMenu.parentName = parentMenuInfo.attr.menuLabel
        this.formItemMenu.parentId = parentMenuInfo.attr.id
      } else {
        this.formItemMenu.parentId = 0
      }
      this.formItemMenu.menuLabel = this.selectedMenu.attr.menuLabel
      // this.formItemMenu.parentName = this.selectedMenu.name
      // 根据选中的菜单查询底下的按钮
      const menuCode = {
        menuCode: this.selectedMenu.attr.menuCode
      }
      this.formItemMenu.mode = 'add'
      this.getMenuBtnAll(menuCode)
    },
    // 根据父菜单id递归查找对应info
    findParentById (pid, list = []) {
      const that = this
      list.forEach(item => {
        if (item && item.attr && item.attr.id === pid) {
          return item
        }
        if (item && item.children) {
          that.findParentById(pid, item.children)
        }
      })
    },
    // 菜单下按钮
    getMenuBtnAll (menuCode) {
      this.getAllBtns(menuCode).then(res => {
        const { records, total } = res.data.data
        this.tableData = records
        this.count = total
      })
    },
    // 确认授权
    confirmAuth () {
      if (this.selectedMenu.attr && this.selectedMenu.attr.id) {
        const that = this
        that.$Modal.confirm({
          title: '提示',
          content: `确认为 ${that.selectedMenu.attr.name} 授权?`,
          onOk () {
            // 调用权限设置接口
            const authedRoles = []
            that.authedRoles.forEach(item => {
              if (item.checked) {
                authedRoles.push(item.id)
              }
            })
            that
              .menuAuth({
                menuId: that.selectedMenu.attr.id,
                authedRoles
              })
              .then(res => {
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
              })
              .catch(err => {
                console.error(err)
              })
          }
        })
      } else {
        this.$Notice.error({
          title: '提示',
          desc: '请先选择要操作的菜单'
        })
      }
    },
    // 确认授权
    confirmAuthEmp () { }
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
        return [
          Object.assign(this.menuTreeData, {
            children: this.treeDatas
          })
        ]
      },
      set (val) { }
    }
  },
  created () {
    this.getData()
    this.query.current = this.page
    this.query.size = this.pageSize
    this.getMenuBtns(this.query)
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
  margin-top: 20px;
}
</style>
