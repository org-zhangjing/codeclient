<template>
  <div class="main">
    <Row>
      <Col span="24">
        <Card>
          <p slot="title">员工管理</p>
        <Row class="condition">
          <Form inline @submit.native.prevent>
            <FormItem label="员工名" :label-width="80">
              <Input v-model="searchName" placeholder="请输入员工名" @keyup.native.enter="searchStaff"/>
            </FormItem>
            <FormItem>
              <Button type="info" @click="searchStaff" v-hasPermission="'staff_all'" class="btns">查询</Button>
            </FormItem>
            <FormItem>
              <Button type="success" @click="addRole" v-hasPermission="'staff_add'" class="btns">新增</Button>
            </FormItem>
            <FormItem>
              <Button type="warning" @click="edit"  v-hasPermission="'staff_update'" class="btns">编辑</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="positionSetAuth" v-hasPermission="'staff_postion_auth'" class="btns">岗位划分</Button>
            </FormItem>
            <FormItem>
              <Button type="info" @click="orgSetAuth" v-hasPermission="'staff_org_auth'" class="btns">机构划分</Button>
            </FormItem>
            <FormItem>
              <Button type="error" @click="onDelete" v-hasPermission="'staff_del'">员工注销</Button>
            </FormItem>
            <!-- v-hasPermission="'staff_postion_auth'" -->
          </Form>
        </Row>
        <Row class="tab">
          <Col span="24">
            <tables
              size="default"
              ref="tables"
              highlight-row
              @on-current-change="delChange"
              search-place="top"
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
      </Col>
    </Row>
    <Modal v-model="staffModal.isShow" title="员工详情">
      <div slot="footer">
        <Button type="warning" @click="staffModalCancel('formValidate')">取消</Button>
        <Button type="primary" @click="staffModalOk('formValidate')">提交</Button>
      </div>
      <Form :model="formItem" :label-width="80" :rules="ruleValidate" ref="formValidate">
        <FormItem label="员工名" prop="name">
          <Input v-model="formItem.name"></Input>
        </FormItem>
        <FormItem label="员工编号" prop="userNo">
          <Input v-model="formItem.userNo"></Input>
        </FormItem>
        <!--<FormItem label="密码" prop="pwd">
          <Input v-model="formItem.pwd" type="password" @input="inputChange"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="password2">
          <Input v-model="formItem.password2" type="password" @input="inputChange"></Input>
        </FormItem>-->
        <FormItem label="员工状态" prop="userStatus">
          <Select v-model="formItem.userStatus">
            <Option :value="0">正常</Option>
            <Option :value="1">禁止</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="orgMmodal.isShow" title="机构授权" ok-text="确认授权" @on-ok="asyncOK">
      <Row>
        <Col span="6">
          <Tree :data="treeData" multiple @on-check-change="changeTree" show-checkbox></Tree>
        </Col>
      </Row>
    </Modal>
    <Modal v-model="positionModal.isShow" title="岗位授权" ok-text="确认授权" @on-ok="ok">
      <!-- <Row>
        <Transfer :titles="transferTitle" :data="postionAll" :target-keys="selectionPostion" @on-change="handleChange1"></Transfer>
      </Row> -->
            <Row>
              <Col span="11">
                <h3>已授权岗位</h3>
                <Checkbox
                :disabled="true"
                label="item.posiName"
                class="checkbox-line"
                v-bind:key="item.id"
                v-for="item in authedRolesStaff"
                v-model="item.checked"
                v-if="authedRolesStaff.length > 0">
                {{item.posiName}}</Checkbox>
               </Col>
               <Col span="1">
                 <Divider type="vertical" style="height:300px;"/>
               </Col>
               <Col span="5">
               <h3>未授权岗位</h3>
               <Checkbox
                  label="item.posiName"
                  class="checkbox-line"
                  v-bind:key="item.id"
                  v-model="item.checked"
                  v-for="(item, index) in allRolesEmpStaff"
                  v-if="allRolesEmpStaff.length > 0"
                  @on-change="roleChangeEmpStaff(item, index)"
               >{{item.posiName}}</Checkbox>
               </Col>
            </Row>
    </Modal>
  </div>
</template>
<style scoped>
.btns {
  margin-right: 5px;
}
.tab {
  margin: -10px;
}
.condition {
  margin: -10px;
}
</style>
<script>
import { transformTime, md5 } from '@/libs/util.js'
import { getTree, getTree1 } from '@/libs/tree'
// import dayjs from 'dayjs'
import Tables from '_c/tables'
import { mapActions } from 'vuex'
export default {
  name: 'role',
  components: {
    Tables
  },
  data () {
    const validatePassword2 = (rule, value, callback) => {
      if (value !== this.formItem.pwd) {
        callback(new Error('两次密码不匹配'))
      } else {
        callback()
      }
    }
    return {
      pwdChanged: false,
      checkAllGroup: [],
      transferTitle: ['未授权岗位', '已授权岗位'],
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
          height: 10,
          sortable: false
        },
        {
          title: '是否被禁止',
          align: 'center',
          key: 'userStatus',
          height: 10,
          sortable: false,
          render: function (h, params) {
            return h('span', this.row.userStatus ? '是' : '否')
          }
        },
        {
          title: '上次登录时间',
          // width: 180,
          height: 10,
          align: 'center',
          key: 'lastLoginTime',
          editable: false,
          render: function (h, params) {
            if (this.row.lastLoginTime) {
              return h('span', transformTime(this.row.lastLoginTime))
            } else {
              return h('span', '-')
            }
          }
        },
        {
          title: '上次登录IP',
          // width: 180,
          align: 'center',
          key: 'lastLoginIp',
          height: 10,
          editable: false,
          render: function (h, params) {
            if (this.row.lastLoginIp) {
              return h('span', this.row.lastLoginIp)
            } else {
              return h('span', '-')
            }
          }
        },
        {
          title: '操作时间',
          // width: 180,
          height: 10,
          align: 'center',
          key: 'registerTime',
          editable: false,
          render: function (h, params) {
            return h(
              'span',
              transformTime(this.row.registerTime)
            )
          }
        }
      ],
      positionColumns: [
        {
          type: 'selection',
          align: 'center'
        },
        {
          title: '员工名',
          align: 'center',
          key: 'name',
          height: 10,
          sortable: false
        }
      ],
      uploadAction: '//upload',
      current: 1,
      staffId: -1, // 当前选中行
      allRolesEmpStaff: [],
      authedRolesStaff: [],
      lastStaffId: -1, // 上次选中行
      size: 10,
      searchName: '',
      count: 0,
      tableData: [],
      authorizedTaba: [],
      unauthorizedTable: [],
      treeDatas: [],
      orgTreeData: {
        title: '机构员工树',
        expand: true,
        selected: false,
        checked: false,
        children: []
      },
      query: {},
      staff: {},
      staffModal: {
        isShow: false
      },
      orgMmodal: {
        isShow: false
      },
      positionModal: {
        isShow: false
      },
      formItem: {
        name: '',
        pwd: '',
        userStatus: 0,
        userNo: '',
        password2: ''
        // visible: false
      },
      ruleValidate: {
        name: [{
          required: true, message: '请输入员工名', trigger: 'change', type: 'string'
        }],
        userNo: [{
          required: true, message: '请输入员工编号', trigger: 'change', type: 'string'
        }],
        pwd: [{
          required: true, message: '请输入密码', trigger: 'change', type: 'string'
        }],
        password2: [{
          required: true, message: '请输入确认密码', trigger: 'change', type: 'string'
        }, {
          validator: validatePassword2, trigger: 'change'
        }]
      },
      positionChangeId: [], // 已授权的ids集合
      positionId: [],
      postionAll: [],
      selectionPostion: []
    }
  },
  methods: {
    ...mapActions([
      'getAllAdmin',
      'addAdmin',
      'delAdmin',
      'updateStaff',
      'setAuthOrgTree',
      'getOrgsList',
      'posiListAuth',
      'getPosiList',
      'empPositionAuth',
      'postOrg'
    ]),
    // 代表当前密码被修改过，则提交时md5处理
    inputChange () {
      this.pwdChanged = true
    },
    // 查询列表
    getData () {
      this.query.size = this.size
      this.query.current = this.current
      this.getAllAdmin(this.query).then(res => {
        const { records, total } = res.data.data
        this.tableData = records || []
        this.count = total
      }).catch(err => {
        console.error(err)
      })
    },
    changeTree (val) {
      this.positionId = []
      val.forEach(res => {
        if (res.attr) {
          this.positionId.push(res.attr.id)
        }
      })
    },
    // 机构确认授权
    asyncOK () {
      const postionOrg = {
        id: this.staffId,
        organizationIds: this.positionId
      }
      this.postOrg(postionOrg).then(res => {
        if (res.data.code === 'success') {
          this.$Notice.success({
            title: '提醒',
            desc: res.data.msg
          })
          this.orgMmodal.isShow = false
        } else {
          this.$Notice.error({
            title: '提醒',
            desc: res.data.msg
          })
        }
      })
    },
    // 头像上传
    handleSuccess (res, file) {
      if (res.url) {
        this.formItem.avatar = res.url || ''
        this.formItem.visible = true
      }
    },
    // 单及某行数据
    delChange (val) {
      this.staffId = val.id
      this.staff = val
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
    pageChanged (current) {
      this.current = current
      this.getData()
    },
    pageSizeChanged (size) {
      this.size = size
      this.getData()
    },
    onDetail (params) {
      this.$refs['formValidate'].resetFields()
      this.staffModal.isShow = true
      this.formItem = this.$lodash.assign({}, params.row, {
        password2: params.row.pwd
      })
    },
    edit () {
      if (this.staffId === -1) {
        this.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行操作'
        })
      } else {
        this.staffModal.isShow = true
        this.formItem = this.$lodash.assign({}, this.staff, {
          password2: this.staff.pwd
        })
      }
    },
    // 删除
    onDelete () {
      const that = this
      if (that.staffId === -1) {
        that.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行注销'
        })
      } else {
        that.$Modal.confirm({
          title: '提示',
          content: '是否确认删除？',
          onOk () {
            const rowId = that.staffId
            that.delAdmin(rowId).then(res => {
              if (res.data.code === 'success') {
                that.$Notice.success({
                  title: '提醒',
                  desc: res.data.msg
                })
                that.staffId = -1
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
    // 岗位授权
    positionSetAuth () {
      this.getPos() // 所有授权岗位
      if (this.staffId === -1) {
        this.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行授权'
        })
      } else {
        // 通过员工id找已授权的岗位
        this.posiListAuth(this.staffId).then(res => {
          this.authedRolesStaff = res.data.data.map(item => {
            item.checked = true
            return item
          })
          const authedRolesIds = this.authedRolesStaff.map(item => item.id) || []
          // 修改全部角色选中
          this.allRolesEmpStaff.forEach((item, index) => {
            if (authedRolesIds.indexOf(item.id) !== -1) {
              this.allRolesEmpStaff[index].checked = true
            } else {
              this.allRolesEmpStaff[index].checked = false
            }
          })
          // this.selectionPostion = this.postionAll.map(item => item.key)
        })
        this.positionModal.isShow = true
      }
    },
    roleChangeEmpStaff (val, index) {
      // 先清空已选择的角色
      this.authedRolesStaff = []
      this.allRolesEmpStaff.forEach(item => {
        item.checked && (this.authedRolesStaff.push(item))
      })
    },
    handleChange1 (val, direction, moveKeys) {
      this.selectionPostion = []
      this.selectionPostion = val
    },
    // 所有授权岗位
    getPos () {
      this.getPosiList().then(res => {
        this.allRolesEmpStaff = res.data.data.records.map(item => {
          item.checked = false
          return item
        })
      })
    },
    postionsChange (val, index) {
      this.selectionPostion = []
      this.postionAll.forEach(item => {
        item.checked && (this.selectionPostion.push(item))
      })
    },
    // 岗位点确认授权
    ok () {
      const positionIds = []
      this.authedRolesStaff.forEach(item => {
        if (item.checked) { positionIds.push(item.id) }
      })
      const postion = {
        id: this.staffId,
        positionIds: positionIds
      }
      this.empPositionAuth(postion).then(res => {
        if (res.data.code === 'success') {
          this.$Notice.success({
            title: '提醒',
            desc: res.data.msg
          })
          this.positionModal.isShow = false
        } else {
          this.$Notice.error({
            title: '提醒',
            desc: res.data.msg
          })
        }
      })
    },
    // 机构授权
    orgSetAuth () {
      if (this.staffId === -1) {
        this.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行授权'
        })
      } else {
        // 通过员工id找已授权的机构树
        this.getOrgsList().then(res => {
          const records = res.data.data.children
          this.treeDatas = getTree(records)
          // 通过员工id找已授权的机构树
          this.orgMmodal.isShow = true
          this.setAuthOrgTree(this.staffId).then(res => {
            this.treeDatas = getTree1(records, res.data.data)
            this.orgMmodal.isShow = true
          })
        })
      }
    },
    // 新增按钮
    addRole () {
      this.$refs['formValidate'].resetFields()
      this.staffModal.isShow = true
    },
    searchStaff () {
      if (!this.searchName) {
        delete this.query.name
        this.getData()
      } else {
        this.query.name = this.searchName
        this.getData()
      }
    },
    staffModalOk (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // 编辑员工接口
          if (this.formItem.id) {
            if (this.pwdChanged) {
              this.formItem.pwd = md5(this.formItem.pwd)
              this.formItem.password2 = this.formItem.pwd
            }
            this.updateStaff(this.formItem).then(res => {
              if (res.data.code === 'success') {
                this.staffModal.isShow = false
                this.getData()
                this.$Notice.success({
                  title: '提示',
                  desc: res.data.msg
                })
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
            this.formItem.pwd = md5(this.formItem.pwd)
            this.formItem.password2 = this.formItem.pwd
            this.addAdmin(this.formItem)
              .then(res => {
                if (res.data.code === 'success') {
                  this.$Notice.success({
                    title: '提示',
                    desc: res.data.msg
                  })
                  this.staffModal.isShow = false
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
    staffModalCancel (name) {
      this.staffModal.isShow = false
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
    positionDatas: {
      get () {
        return this.authorizedTaba
      },
      set (val) { }
    },
    treeData: {
      get () {
        return this.treeDatas
      },
      set (val) {
        // this.orgTreeData.children = this.treeDatas
        // this.treeData = [this.orgTreeData]
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
  margin-top: 20px;
}
</style>
