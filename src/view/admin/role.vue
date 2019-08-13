<template>
  <div class="main">
    <Row>
      <Col span="24">
        <Card>
          <p slot="title">角色管理</p>
          <Row class="condition">
            <!-- <Col span="24">
              <Form ref="formInline" inline>
                <FormItem>
                  <Button type="primary" @click="addRole">新增</Button>
                </FormItem>
              </Form>
            </Col> -->
            <Form inline>
              <FormItem label="角色名称" :label-width="80">
                <Input v-model="searchName" placeholder="请输入角色名称" />
              </FormItem>
              <FormItem label="角色编码" :label-width="80">
                <Input v-model="searchCode" placeholder="请输入角色编码" />
              </FormItem>
              <FormItem>
                <Button type="info" @click="searchRole" class="btns" v-hasPermission="'role_search'">查询</Button>
              </FormItem>
              <FormItem>
                <Button type="success" @click="addRole" v-hasPermission="'role_add'" class="btns">新增</Button>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="edit" v-hasPermission="'role_update'" class="btns">编辑</Button>
              </FormItem>
              <FormItem>
                <Button type="error" @click="onDelete" v-hasPermission="'role_del'">删除</Button>
              </FormItem>
            </Form>
          </Row>
          <Row class="tab">
            <Col span="24">
              <tables
                size = 'default'
                ref="tables"
                highlight-row
                @on-current-change ="delChange"
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
      </Col>
    </Row>
    <Modal
      v-model="roleModal.isShow"
      title="角色详情">
      <div slot="footer">
        <Button type="warning" @click="roleModalCancel('formValidate')">取消</Button>
        <Button type="primary" @click="roleModalOk('formValidate')">提交</Button>
      </div>
      <Form :model="formItem" :label-width="80" :rules="ruleValidate" ref="formValidate">
        <FormItem label="角色编码" prop="roleCode">
          <Input v-model="formItem.roleCode"></Input>
        </FormItem>
        <FormItem label="角色名称" prop="roleName">
          <Input v-model="formItem.roleName"></Input>
        </FormItem>
        <FormItem label="角色描述" prop="roleDesc">
          <Input v-model="formItem.roleDesc"></Input>
        </FormItem>
        <Input v-model="formItem.id" v-show="false"></Input>
      </Form>
    </Modal>
  </div>
</template>
<style scoped>
  .btns{
    margin-right: 5px;
  }
  .tab{
    margin: -10px;
  }
  .condition{
     margin: -10px;
  }
</style>
<script>
// import dayjs from 'dayjs'
import Tables from '_c/tables'
import { mapActions } from 'vuex'
export default {
  name: 'role',
  components: {
    Tables
  },
  data () {
    return {
      user: {},
      searchName: '',
      searchCode: '',
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
        title: '角色描述',
        align: 'center',
        key: 'roleDesc',
        sortable: false
      }],
      current: 1,
      size: 10,
      count: 0,
      tableData: [],
      query: {},
      roleModal: {
        isShow: false
      },
      formItem: {
        roleCode: '',
        roleName: '',
        roleDesc: ''
        // createdEmp: this.user.id
      },
      ruleValidate: {
        roleCode: [{
          required: true, message: '请输入角色编码', trigger: 'blur', type: 'string'
        }],
        roleName: [{
          required: true, message: '请输入角色名称', trigger: 'blur', type: 'string'
        }],
        roleDesc: [{
          required: true, message: '请输入角色描述', trigger: 'blur', type: 'string'
        }]
      },
      roleId: -1
    }
  },
  methods: {
    ...mapActions([
      'getRolesList',
      'addRoleInfo',
      'removeRole',
      'updateRoleInfo'
    ]),
    // 查询列表
    getData () {
      this.query.current = this.current
      this.query.size = this.size
      this.getRolesList(this.query).then(res => {
        const { total, records } = res.data.data
        this.count = total
        this.tableData = records
      }).catch(err => {
        console.error(err)
      })
    },
    // 查询按钮
    searchRole () {
      if (!this.searchName && !this.searchCode) {
        delete this.query.roleCode
        delete this.query.roleName
        this.getData()
      } else if (!this.searchName && this.searchCode) {
        delete this.query.roleName
        this.query.roleCode = this.searchCode
        this.getData()
      } else if (this.searchName && !this.searchCode) {
        delete this.query.roleCode
        this.query.roleName = this.searchName
        this.getData()
      } else if (this.searchName && this.searchCode) {
        this.query.roleCode = this.searchCode
        this.query.roleName = this.searchName
        this.getData()
      } else {
        this.getData()
      }
    },
    pageChanged (page) {
      this.page = page
      this.getData()
    },
    pageSizeChanged (pageSize) {
      this.pageSize = pageSize
      this.getData()
    },
    onDetail (params) {
      this.roleModal.isShow = true
      this.formItem = this.$lodash.assign({}, params.row)
    },
    delChange (val) {
      this.roleId = val
    },
    onDelete (params) {
      const that = this
      if (that.roleId.id === -1) {
        that.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行操作'
        })
      } else {
        that.$Modal.confirm({
          title: '提示',
          content: '是否确认删除？',
          onOk () {
            const rowId = that.roleId.id
            that.removeRole(rowId).then(res => {
              if (res.data.code === 'success') {
                that.$Notice.success({
                  title: '提醒',
                  desc: res.data.msg
                })
                that.roleId.id = -1
                that.getData()
              } else {
                that.$Notice.error({
                  title: '提醒',
                  desc: res.data.msg
                })
              }
            }).catch(err => {
              console.error(err)
            })
          }
        })
      }
    },
    addRole () {
      this.$refs['formValidate'].resetFields()
      this.roleModal.isShow = true
    },
    edit () {
      if (this.roleId === -1) {
        this.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行操作'
        })
      } else {
        this.formItem = this.$lodash.assign({}, this.roleId)
        this.roleModal.isShow = true
      }
    },
    roleModalOk (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // 新增角色接口
          if (this.formItem.id) {
            this.updateRoleInfo({
              id: this.formItem.id,
              roleCode: this.formItem.roleCode,
              roleName: this.formItem.roleName,
              roleDesc: this.formItem.roleDesc
            }).then(res => {
              this.roleModal.isShow = false
              this.roleId.id = -1
              this.getData()
            }).catch(err => {
              console.error(err)
            })
          } else {
            this.formItem.createdEmp = this.user.id
            this.addRoleInfo(this.formItem).then(res => {
              this.roleModal.isShow = false
              this.getData()
            }).catch(err => {
              console.error(err)
            })
          }
        }
      })
    },
    roleModalCancel (name) {
      this.roleModal.isShow = false
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
    }
  },
  created () {
    this.user = JSON.parse(localStorage.getItem('userInfo'))
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
</style>
