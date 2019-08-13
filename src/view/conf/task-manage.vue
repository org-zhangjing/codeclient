<template>
  <div class="main">
    <Row>
      <Col span="24">
        <Card>
          <p slot="title">任务管理</p>
          <Row class="condition">
            <Form inline>
              <FormItem label="名称" :label-width="80">
                <Input v-model="query.name" placeholder="请输入名称" />
              </FormItem>
              <FormItem>
                <Button type="info" @click="search" class="btns" >查询</Button>
              </FormItem>
              <FormItem>
                <Button type="success" @click="addConf"  class="btns">新增</Button>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="edit" class="btns">编辑</Button>
              </FormItem>
              <FormItem>
                <Button type="error" @click="onDelete" >删除</Button>
              </FormItem>
            </Form>
          </Row>
          <Row class="tab">
            <Col span="24">
              <tables
                size = 'default'
                ref="tables"
                highlight-row
                @on-current-change = "selectChange"
                @on-enabled-change = "enabledChange"
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
      v-model="modal.isShow"
      title="详情">
      <div slot="footer">
        <Button type="warning" @click="modalCancel('formValidate')">取消</Button>
        <Button type="primary" @click="modalOk('formValidate')">提交</Button>
      </div>
      <Form :model="formItem" :label-width="80" :rules="ruleValidate" ref="formValidate">
        <FormItem label="名称" prop="name">
          <Input v-model="formItem.name"></Input>
        </FormItem>
        <FormItem label="Redis配置" prop="confRedis">
          <Select v-model="formItem.confRedis">
            <Option :value="item.id" v-for="item in confRedisList" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="Kafka配置" prop="confKafka">
          <Select v-model="formItem.confKafka">
            <Option :value="item.id" v-for="item in confKafkaList" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="组装配置" prop="confPack">
          <Select v-model="formItem.confPack">
            <Option :value="item.id" v-for="item in confPackList" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="发送配置" prop="confSend">
          <Select v-model="formItem.confSend">
            <Option :value="item.id" v-for="item in confSendList" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="组装方式" prop="packType">
          <Select v-model="formItem.packType">
            <Option :value="item.id" v-for="item in packTypeList" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="是否启用" prop="hasEnabled">
          <i-switch v-model="formItem.hasEnabledBoolean" @on-change="hasEnabledChange">
            <!-- <span slot="open">启用</span>
            <span slot="close">禁用</span> -->
          </i-switch>
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
  .textarea.ivu-input{
    font-size: 12px;
  }
</style>
<script>
import dayjs from 'dayjs'
import Tables from '_c/tables'
import { mapActions } from 'vuex'
import { Promise } from 'q'
export default {
  name: 'taskManage',
  components: {
    Tables
  },
  data () {
    return {
      user: {},
      columns: [{
        title: '序号',
        type: 'index',
        width: 100,
        align: 'center'
      }, {
        title: '名称',
        align: 'center',
        key: 'name',
        sortable: false
      }, {
        title: 'Redis配置',
        align: 'center',
        key: 'confRedis',
        sortable: false,
        render: function (h, params) {
          return h('span', params.row.confRedisInfo ? params.row.confRedisInfo.name : params.row.confRedis)
        }
      }, {
        title: 'Kafka配置',
        align: 'center',
        key: 'confKafka',
        sortable: false,
        render: function (h, params) {
          return h('span', params.row.confKafkaInfo ? params.row.confKafkaInfo.name : params.row.confKafka)
        }
      }, {
        title: '组装配置',
        align: 'center',
        key: 'confPack',
        sortable: false,
        render: function (h, params) {
          return h('span', params.row.confPackInfo ? params.row.confPackInfo.name : params.row.confPack)
        }
      }, {
        title: '发送配置',
        align: 'center',
        key: 'confSend',
        sortable: false,
        render: function (h, params) {
          return h('span', params.row.confSendInfo ? params.row.confSendInfo.name : params.row.confSend)
        }
      }, {
        title: '组装方式',
        align: 'center',
        key: 'packType',
        sortable: false,
        render: function (h, params) {
          return h('span', params.row.packTypeInfo ? params.row.packTypeInfo.name : params.row.packType)
        }
      }, {
        title: '最后更新',
        align: 'center',
        key: 'updateTime',
        sortable: false,
        render: function (h, params) {
          return h('span', dayjs(params.row.updateTime).format('YYYY-MM-DD HH:mm:ss'))
        }
      }, {
        title: '操作',
        align: 'center',
        key: 'handle',
        sortable: false,
        options: ['enabled']
      }],
      current: 1,
      size: 10,
      count: 0,
      tableData: [],
      query: {
        name: ''
      },
      modal: {
        isShow: false,
        isEdit: false
      },
      formItem: {
        name: '',
        id: '',
        confRedis: '',
        confKafka: '',
        confPack: '',
        confSend: '',
        packType: '',
        hasEnabled: 1,
        hasEnabledBoolean: true
      },
      ruleValidate: {
        name: [{
          required: true, message: '请输入名称', trigger: 'change', type: 'string'
        }],
        confRedis: [{
          required: true, message: '请选择Redis配置', trigger: 'change', type: 'number'
        }],
        confKafka: [{
          required: true, message: '请选择Kafka配置', trigger: 'change', type: 'number'
        }],
        confPack: [{
          required: true, message: '请选择组装配置', trigger: 'change', type: 'number'
        }],
        confSend: [{
          required: true, message: '请选择发送配置', trigger: 'change', type: 'number'
        }],
        packType: [{
          required: true, message: '请选择组装方式', trigger: 'change', type: 'number'
        }]
      },
      selectedRow: null,
      confRedisList: [],
      confKafkaList: [],
      confPackList: [],
      confSendList: [],
      packTypeList: []
    }
  },
  methods: {
    ...mapActions([
      'getTaskConfList',
      'addTaskConf',
      'removeTaskConf',
      'updateTaskConf',
      'getDictTypesWithCode',
      'getRedisConfList',
      'getKafkaConfList',
      'getDataAssemblyConfList',
      'getDataSendingConfList'
    ]),
    getRedisConfs () {
      this.getRedisConfList({
        current: 1,
        size: Number.MAX_SAFE_INTEGER
      }).then(res => {
        if (res.data.code === 'success') {
          this.confRedisList = res.data.data.records
        }
      })
    },
    getKafkaConfs () {
      this.getKafkaConfList({
        current: 1,
        size: Number.MAX_SAFE_INTEGER
      }).then(res => {
        if (res.data.code === 'success') {
          this.confKafkaList = res.data.data.records
        }
      })
    },
    getDataAssemblyConfs () {
      this.getDataAssemblyConfList({
        current: 1,
        size: Number.MAX_SAFE_INTEGER
      }).then(res => {
        if (res.data.code === 'success') {
          this.confPackList = res.data.data.records
        }
      })
    },
    getDataSendingConfs () {
      this.getDataSendingConfList({
        current: 1,
        size: Number.MAX_SAFE_INTEGER
      }).then(res => {
        if (res.data.code === 'success') {
          this.confSendList = res.data.data.records
        }
      })
    },
    hasEnabledChange (hasEnabled) {
      this.formItem.hasEnabled = hasEnabled ? 1 : 0
    },
    // 获取字典项
    getDictTypeList (dictName) {
      return new Promise((resolve, reject) => {
        this.getDictTypesWithCode(dictName).then(res => {
          if (res.data.code === 'success') {
            this.packTypeList = res.data.data
          }
        }).catch(err => {
          console.error(err)
          reject(err)
        })
      })
    },
    // 查询列表
    getData () {
      this.query.current = this.current
      this.query.size = this.size
      this.getTaskConfList(this.query).then(res => {
        const { total, records } = res.data.data
        this.count = total
        this.tableData = records
      }).catch(err => {
        console.error(err)
      })
    },
    // 查询按钮
    search () {
      this.getData()
    },
    pageChanged (page) {
      this.current = page
      this.getData()
    },
    pageSizeChanged (pageSize) {
      this.size = pageSize
      this.getData()
    },
    onDetail (params) {
      this.modal.isShow = true
      this.formItem = this.$lodash.assign({}, params.row)
      this.formItem.hasEnabledBoolean = !!params.row.hasEnabled
    },
    selectChange (val) {
      this.selectedRow = val
    },
    enabledChange (params) {
      // 调用修改接口
      this.updateTaskConf({
        id: params.row.id,
        hasEnabled: params.row.hasEnabled ? 0 : 1
      }).then(res => {
        if (res.data.code === 'success') {
          this.getData()
          this.selectedRow = null
        }
      })
    },
    onDelete (params) {
      const that = this
      if (!that.selectedRow) {
        that.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行操作'
        })
      } else {
        that.$Modal.confirm({
          title: '提示',
          content: '是否确认删除？',
          onOk () {
            const rowId = that.selectedRow.id
            that.removeTaskConf(rowId).then(res => {
              if (res.data.code === 'success') {
                that.$Notice.success({
                  title: '提醒',
                  desc: res.data.msg
                })
                that.selectedRow = null
                that.getData()
              } else {
                that.$Notice.error({
                  title: '提醒',
                  desc: res.data.msg
                })
              }
            })
          }
        })
      }
    },
    addConf () {
      this.$refs['formValidate'].resetFields()
      this.formItem.hasEnabled = 0
      this.formItem.hasEnabledBoolean = false
      this.modal.isShow = true
      this.modal.isEdit = false
    },
    edit () {
      if (!this.selectedRow) {
        this.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行操作'
        })
      } else {
        this.formItem = this.$lodash.assign({}, this.selectedRow)
        this.formItem.hasEnabledBoolean = !!this.selectedRow.hasEnabled
        this.modal.isShow = true
        this.modal.isEdit = true
      }
    },
    modalOk (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.modal.isEdit) {
            this.updateTaskConf(this.formItem).then(res => {
              this.modal.isShow = false
              this.getData()
            })
          } else {
            this.addTaskConf(this.formItem).then(res => {
              this.modal.isShow = false
              this.getData()
            })
          }
        }
      })
    },
    modalCancel (name) {
      this.modal.isShow = false
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
  mounted () {
    this.user = JSON.parse(localStorage.getItem('userInfo'))
    this.getData()

    Promise.all([this.getDictTypeList('data_pack_type'), this.getRedisConfs(), this.getKafkaConfs(), this.getDataAssemblyConfs(), this.getDataSendingConfs()])
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
