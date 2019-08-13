<template>
  <div class="main">
    <Row>
      <Col span="24">
        <Card>
          <p slot="title">Kafka配置管理</p>
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
                @on-current-change ="selectChange"
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
      <Form :model="formItem" :label-width="90" :rules="ruleValidate" ref="formValidate">
        <FormItem label="名称" prop="name">
          <Input v-model="formItem.name"></Input>
        </FormItem>
        <FormItem label="地址" prop="serverHost">
          <Input v-model="formItem.serverHost"></Input>
        </FormItem>
        <FormItem label="组编号" prop="partitionNo">
          <Input v-model="formItem.partitionNo"></Input>
        </FormItem>
        <FormItem label="主题" prop="topic">
          <Input v-model="formItem.topic" placeholder="多个使用,（英文逗号）隔开"></Input>
        </FormItem>
        <FormItem label="过滤器" prop="filter">
          <Select v-model="formItem.filter">
            <Option :value="item.id" v-for="item in filterList" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="检索值" prop="searchDataFlags">
          <Input v-model="formItem.searchDataFlags" placeholder="多个使用,（英文逗号）隔开" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
        </FormItem>
        <FormItem label="数据缓存" prop="configRedis">
          <Select v-model="formItem.configRedis">
            <Option :value="item.id" v-for="item in configRedisList" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="数据标记" prop="dataFlag">
          <Input v-model="formItem.dataFlag"></Input>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formItem.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
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
export default {
  name: 'kafkaConf',
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
        title: '地址',
        align: 'center',
        key: 'serverHost',
        sortable: false
      }, {
        title: '组编号',
        align: 'center',
        key: 'partitionNo',
        sortable: false
      }, {
        title: '主题',
        align: 'center',
        key: 'topic',
        sortable: false
      }, {
        title: '过滤器',
        align: 'center',
        key: 'filter',
        sortable: false,
        tooltip: true,
        render: function (h, params) {
          return h('span', params.row.filterInfo ? params.row.filterInfo.name : params.row.filter)
        }
      }, {
        title: '检索值',
        align: 'center',
        key: 'searchDataFlags',
        sortable: false
      }, {
        title: '数据缓存',
        align: 'center',
        key: 'configRedis',
        sortable: false,
        tooltip: true,
        render: function (h, params) {
          return h('span', params.row.configRedisInfo ? params.row.configRedisInfo.name : params.row.configRedis)
        }
      }, {
        title: '数据标记',
        align: 'center',
        key: 'dataFlag',
        sortable: false
      }, {
        title: '备注',
        align: 'center',
        key: 'remark',
        sortable: false
      }, {
        title: '最后更新',
        align: 'center',
        key: 'updateTime',
        width: 160,
        sortable: false,
        render: function (h, params) {
          return h('span', dayjs(params.row.updateTime).format('YYYY-MM-DD HH:mm:ss'))
        }
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
      filterList: [],
      configRedisList: [],
      formItem: {
        serverHost: '',
        serverPort: '',
        name: '',
        id: '',
        remark: '',
        partitionNo: '',
        topic: '',
        filter: '',
        searchDataFlags: '',
        configRedis: '',
        dataFlag: ''
      },
      ruleValidate: {
        name: [{
          required: true, message: '请输入名称', trigger: 'change', type: 'string'
        }],
        serverHost: [{
          required: true, message: '请输入地址', trigger: 'change', type: 'string'
        }],
        serverPort: [{
          required: true, message: '请输入端口号', trigger: 'change', type: 'string'
        }],
        partitionNo: [{
          required: true, message: '请输入组编号', trigger: 'change', type: 'string'
        }],
        topic: [{
          required: true, message: '请输入主题', trigger: 'change', type: 'string'
        }],
        filter: [{
          required: true, message: '请选择过滤器', trigger: 'change', type: 'number'
        }],
        searchDataFlags: [{
          required: true, message: '请输入检索值', trigger: 'change', type: 'string'
        }],
        configRedis: [{
          required: true, message: '请选择数据缓存', trigger: 'change', type: 'number'
        }],
        dataFlag: [{
          required: true, message: '请输入数据标记', trigger: 'change', type: 'string'
        }]
      },
      selectedRow: null
    }
  },
  methods: {
    ...mapActions([
      'getKafkaConfList',
      'addKafkaConf',
      'removeKafkaConf',
      'updateKafkaConf',
      'getDictTypesWithCode',
      'getRedisConfList'
    ]),
    // 查询列表
    getData () {
      this.query.current = this.current
      this.query.size = this.size
      this.getKafkaConfList(this.query).then(res => {
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
    },
    selectChange (val) {
      this.selectedRow = val
    },
    // 获取字典项
    getDictTypeList () {
      this.getDictTypesWithCode('filter').then(res => {
        if (res.data.code === 'success') {
          this.filterList = res.data.data
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 获取数据缓存
    getRedisConfigList () {
      this.getRedisConfList({
        size: Number.MAX_SAFE_INTEGER
      }).then(res => {
        if (res.data.code === 'success') {
          this.configRedisList = res.data.data.records
        }
      }).catch(err => {
        console.error(err)
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
            that.removeKafkaConf({
              id: rowId
            }).then(res => {
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
        this.modal.isShow = true
        this.modal.isEdit = true
      }
    },
    modalOk (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.modal.isEdit) {
            this.updateKafkaConf(this.formItem).then(res => {
              this.modal.isShow = false
              this.getData()
            })
          } else {
            this.addKafkaConf(this.formItem).then(res => {
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
    this.getDictTypeList()
    this.getRedisConfigList()
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
