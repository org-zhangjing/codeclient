<template>
  <div>
    <Row>
      <Col span="24">
      <Row class="condition">
          <Form inline>
            <FormItem label="权限描述" :label-width="80">
              <Input v-model="description" placeholder="请输入权限描述" />
            </FormItem>
            <FormItem>
              <Button type="info" @click="searchPosition" v-hasPermission="'data_auth_all'" class="btns">查询</Button>
            </FormItem>
            <FormItem>
              <Button type="success" @click="addDataAyth" v-hasPermission="'data_auth_add'" class="btns">新增</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="editDataAyth" v-hasPermission="'data_auth_update'" class="btns">编辑</Button>
            </FormItem>
            <FormItem>
              <Button type="error" @click="onDelete" v-hasPermission="'data_auth_del'">删除</Button>
            </FormItem>
          </Form>
        </Row>
        <Row class="edittable-table-height-con">
          <tables ref="tables" editable search-place="top" v-model="datas"  highlight-row
              @on-current-change="delChange" ellipsis stripe :columns="columns" />
          <!-- <can-edit-table refs="table" @on-detail="onDetail" v-model="datas" :columns-list="editInlineColumns" @on-delete="handleDel"></can-edit-table> -->
        </Row>
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
   <Modal
      v-model="dataModal.isShow"
      title="角色详情">
      <div slot="footer">
        <Button type="warning" @click="dataModalCancel('formValidate')">取消</Button>
        <Button type="primary" @click="dataModalOk('formValidate')">提交</Button>
      </div>
      <Form :model="formItem" :label-width="80" :rules="ruleValidate" ref="formValidate">
        <FormItem label="权限描述" prop="description">
          <Input v-model="formItem.description"></Input>
        </FormItem>
        <FormItem label="菜单" prop="menuId">
          <!-- <Input v-model="formItem.menuId"></Input> -->
          <Select v-model="formItem.menuId">
            <Option v-for="item in menuList" :value="item.id" :key="item.id">{{item.menuLabel}}</Option>
          </Select>
        </FormItem>
        <FormItem label="角色" prop="roleId">
          <!-- <Input v-model="formItem.roleId"></Input> -->
          <Select v-model="formItem.roleId">
            <Option v-for="item in roleList" :value="item.id" :key="item.id">{{item.roleName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="权限内容" prop="content">
          <Input type="textarea" :rows="4" v-model="formItem.content"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
// import dayjs from 'dayjs'
import { mapActions } from 'vuex'
export default {
  name: 'admin_index',
  components: {
    Tables
  },
  data () {
    return {
      dataModal: {
        isShow: false
      },
      menuList: [],
      roleList: [],
      tableData: [],
      columns: [
        {
          title: '权限描述',
          // width: 180,
          align: 'center',
          key: 'description',
          sortable: false
        },
        {
          title: '菜单',
          align: 'center',
          key: 'menuId',
          sortable: false,
          render: function (h, params) {
            if (this.row.menuName) {
              return h('span', this.row.menuName)
            } else {
              return h('span', '--')
            }
          }
        },
        {
          title: '角色',
          align: 'center',
          key: 'roleId',
          sortable: false,
          render: function (h, params) {
            if (this.row.roleName) {
              return h('span', this.row.roleName)
            } else {
              return h('span', '--')
            }
          }
        },
        {
          title: '权限内容',
          align: 'center',
          key: 'content',
          sortable: false,
          render: function (h, params) {
            if (params.row.content && params.row.content.length > 50) {
              return h('span', params.row.content.substring(0, 50) || '---')
            } else {
              return h('span', params.row.content || '---')
            }
          }
        }
      ],
      size: 10,
      current: 1,
      count: 0,
      description: '',
      query: {},
      modal: false,
      loading: true,
      dataAuth: {},
      dataAuthId: -1,
      visible: false,
      defaultList: [],
      uploadAction: `//upload`,
      formItem: {
        roleId: '',
        description: '',
        content: '',
        menuId: ''
      },
      ruleValidate: {
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change', type: 'number' }
        ],
        menuId: [
          { required: true, message: '请选择菜单', trigger: 'change', type: 'number' }
        ],
        description: [
          { required: true, message: '请输入权限描述', trigger: 'blur', type: 'string' }
        ],
        content: [
          { required: true, message: '请输入权限内容', trigger: 'blur', type: 'string' }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['getDataAuth', 'addDataAuth', 'updateDataAuth', 'delDataAth', 'getMenuListAll', 'getRoleListAll']),
    // 新增
    addDataAyth () {
      this.dataAuthId = -1
      if (this.dataAuthId === -1) {
        this.formItem = {}
        this.$refs['formValidate'].resetFields()
        this.dataModal.isShow = true
      }
    },
    // 提交
    dataModalOk (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // 新增员工接口
          if (this.dataAuthId !== -1) {
            delete this.formItem.menuName
            delete this.formItem.roleName
            console.log('xiugai', this.formItem)
            this.updateDataAuth(this.formItem).then(res => {
              if (res.data.code === 'success') {
                this.dataModal.isShow = false
                this.getData()
                this.$Notice.success({
                  title: '提示',
                  desc: res.data.msg
                })
                this.dataAuthId = -1
              } else {
                this.$Notice.error({
                  title: '提醒',
                  desc: res.data.msg
                })
              }
            }).catch(err => {
              console.error(err)
            })
          } else {
            console.log('this.formItem', this.formItem)
            this.addDataAuth(this.formItem)
              .then(res => {
                if (res.data.code === 'success') {
                  this.$Notice.success({
                    title: '提示',
                    desc: res.data.msg
                  })
                  this.dataAuthId = -1
                  this.dataModal.isShow = false
                  this.getData()
                } else {
                  this.$Notice.error({
                    title: '提醒',
                    desc: res.data.msg
                  })
                }
              })
          }
        }
      })
    },
    editDataAyth () {
      console.log('this.dataAuth', this.dataAuth)
      if (this.dataAuthId === -1) {
        this.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行操作'
        })
      } else {
        this.formItem = this.dataAuth
        this.dataModal.isShow = true
      }
    },
    onDelete () {
      const that = this
      if (that.dataAuthId === -1) {
        that.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行操作'
        })
      } else {
        that.$Modal.confirm({
          title: '提示',
          content: '是否确认删除？',
          onOk () {
            that.delDataAth(that.dataAuthId).then(res => {
              if (res.data.code === 'success') {
                that.$Notice.success({
                  title: '提醒',
                  desc: res.data.msg
                })
                that.dataAuthId = -1
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
    dataModalCancel () {
      this.dataModal.isShow = false
    },
    // 单及某行数据
    delChange (val) {
      console.log('val', val)
      this.dataAuthId = val.id
      this.dataAuth = val
    },
    getData () {
      this.query.size = this.size
      this.query.current = this.current
      this.getDataAuth(this.query)
        .then(res => {
          console.log('res', res)
          this.count = res.data.data.total
          this.tableData = res.data.data.records
        })
        .catch(err => {
          console.error(err)
        })
    },
    roleListAll () {
      this.getRoleListAll().then(res => {
        console.log('resresresres', res)
        this.roleList = res.data.data
      })
    },
    menuListAll () {
      this.getMenuListAll().then(res => {
        console.log('resresresres', res)
        this.menuList = res.data.data
      })
    },
    pageChanged (current) {
      this.current = current
      this.getData()
    },
    pageSizeChanged (size) {
      this.size = size
      this.getData()
    },
    searchPosition () {
      if (this.description.trim()) {
        this.query.description = this.description.trim()
        this.getData()
      } else {
        delete this.query.description
        this.query.description = ''
        this.getData()
      }
    }
  },
  computed: {
    datas: {
      get () {
        return this.tableData
      },
      set (val) {}
    },
    total: {
      get () {
        return this.count
      },
      set (val) {}
    }
  },
  created () {
    this.query.description = ''
    this.roleListAll()
    this.menuListAll()
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
