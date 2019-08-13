<template>
  <div class="main">
    <Row>
      <Col span="24">
        <Card>
          <p slot="title">Redis配置管理</p>
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
        <FormItem label="端口" prop="serverPort">
          <!-- <Input v-model="formItem.serverPort"></Input> -->
          <InputNumber :max="65535" :min="1" v-model="formItem.serverPort"></InputNumber>
        </FormItem>
        <FormItem label="最大连接数" prop="maxConns">
          <!-- <Input v-model="formItem.maxConns"></Input> -->
          <InputNumber :max="99999" :min="1" v-model="formItem.maxConns"></InputNumber>
        </FormItem>
        <FormItem label="连接方式" prop="connType">
          <Select v-model="formItem.connType">
            <Option value="CLUSTER">集群</Option>
            <Option value="SINGLE">单点</Option>
          </Select>
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
  .ivu-input-number{
    width: 100%;
  }
</style>
<script>
import dayjs from 'dayjs'
import Tables from '_c/tables'
import { mapActions } from 'vuex'
export default {
  name: 'redisConf',
  components: {
    Tables
  },
  data () {
    return {
      user: {},
      searchCode: '',
      columns: [{
        title: '序号',
        type: 'index',
        width: 100,
        align: 'center'
      }, {
        title: '名称',
        align: 'center',
        key: 'name',
        tooltip: true,
        sortable: false
      }, {
        title: '地址',
        align: 'center',
        key: 'serverHost',
        sortable: false
      }, {
        title: '端口',
        align: 'center',
        key: 'serverPort',
        sortable: false
      }, {
        title: '最大连接数',
        align: 'center',
        key: 'maxConns',
        sortable: false
      }, {
        title: '连接方式',
        align: 'center',
        key: 'connType',
        sortable: false,
        render: function (h, params) {
          return h('span', params.row.connType === 'SINGLE' ? '单点' : '集群')
        }
      }, {
        title: '备注',
        align: 'center',
        key: 'remark',
        tooltip: true,
        sortable: false
      }, {
        title: '最后更新',
        align: 'center',
        key: 'updateTime',
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
      formItem: {
        serverHost: '',
        serverPort: 80,
        maxConns: 0,
        name: '',
        id: '',
        connType: '',
        remark: ''
      },
      ruleValidate: {
        name: [{
          required: true, message: '请输入名称', trigger: 'change', type: 'string'
        }],
        serverHost: [{
          required: true, message: '请输入地址', trigger: 'change', type: 'string'
        }],
        serverPort: [{
          required: true, message: '请输入端口号', trigger: 'change', type: 'integer'
        }],
        maxConns: [{
          required: true, message: '请输入最大连接数', trigger: 'change', type: 'integer'
        }],
        connType: [{
          required: true, message: '请选择连接方式', trigger: 'change', type: 'string'
        }]
      },
      selectedRow: null
    }
  },
  methods: {
    ...mapActions([
      'getRedisConfList',
      'addRedisConf',
      'removeRedisConf',
      'updateRedisConf'
    ]),
    // 查询列表
    getData () {
      this.query.current = this.current
      this.query.size = this.size
      this.getRedisConfList(this.query).then(res => {
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
            that.removeRedisConf({
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
          // 编辑
          if (this.modal.isEdit) {
            this.updateRedisConf(this.formItem).then(res => {
              this.modal.isShow = false
              this.getData()
            })
          } else {
            this.addRedisConf(this.formItem).then(res => {
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
