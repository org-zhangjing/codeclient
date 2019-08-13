<template>
  <div class="main">
    <Row>
      <Col span="24">
        <Card>
          <p slot="title">数据发送配置管理</p>
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
      <Form :model="formItem" :label-width="100" :rules="ruleValidate" ref="formValidate">
        <FormItem label="名称" prop="name">
          <Input v-model="formItem.name"></Input>
        </FormItem>
        <FormItem label="发送方式" prop="sendType">
          <Select v-model="formItem.sendType">
            <Option :value="item.id" v-for="item in sendTypeList" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="检索数据标记" prop="searchDataFlag">
          <Input v-model="formItem.searchDataFlag"></Input>
        </FormItem>
        <FormItem label="目标数据标记" prop="targetDataFlag">
          <Input v-model="formItem.targetDataFlag"></Input>
        </FormItem>
        <FormItem label="数据组装方式" prop="dataAssembleType">
          <Select v-model="formItem.dataAssembleType">
            <Option :value="item.id" v-for="item in packTypeList" :key="item.id">{{item.name}}</Option>
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
</style>
<script>
import dayjs from 'dayjs'
import Tables from '_c/tables'
import { mapActions } from 'vuex'
export default {
  name: 'dataSendingConf',
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
        title: '发送方式',
        align: 'center',
        key: 'sendType',
        sortable: false,
        render: function (h, params) {
          return h('span', params.row.sendTypeInfo ? params.row.sendTypeInfo.name : params.row.sendType)
        }
      }, {
        title: '检索数据标记',
        align: 'center',
        key: 'searchDataFlag',
        sortable: false
      }, {
        title: '目标数据标记',
        align: 'center',
        key: 'targetDataFlag',
        sortable: false
      }, {
        title: '数据组装方式',
        align: 'center',
        key: 'dataAssembleType',
        sortable: false,
        render: function (h, params) {
          return h('span', params.row.dataAssembleTypeInfo ? params.row.dataAssembleTypeInfo.name : params.row.dataAssembleType)
        }
      }, {
        title: '备注',
        align: 'center',
        key: 'remark',
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
        name: '',
        remark: '',
        configKafka: '',
        id: '',
        sendType: '',
        searchDataFlag: '',
        targetDataFlag: '',
        dataAssembleType: ''
      },
      ruleValidate: {
        name: [{
          required: true, message: '请输入名称', trigger: 'change', type: 'string'
        }],
        sendType: [{
          required: true, message: '请选择发送方式', trigger: 'change', type: 'number'
        }],
        searchDataFlag: [{
          required: true, message: '请输入检索数据标记', trigger: 'change', type: 'string'
        }],
        targetDataFlag: [{
          required: true, message: '请输入目标数据标记', trigger: 'change', type: 'string'
        }],
        dataAssembleType: [{
          required: true, message: '请选择数据组装方式', trigger: 'change', type: 'number'
        }],
        remark: [{
          required: false, message: '请输入备注', trigger: 'change', type: 'string'
        }]
      },
      selectedRow: null,
      packTypeList: [],
      sendTypeList: []
    }
  },
  methods: {
    ...mapActions([
      'getDataSendingConfList',
      'addDataSendingConf',
      'removeDataSendingConf',
      'updateDataSendingConf',
      'getDictTypesWithCode'
    ]),
    // 获取字典项
    getDictTypeList (dictName) {
      return new Promise((resolve, reject) => {
        this.getDictTypesWithCode(dictName).then(res => {
          if (res.data.code === 'success') {
            resolve(res.data.data)
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
      this.getDataSendingConfList(this.query).then(res => {
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
            that.removeDataSendingConf(rowId).then(res => {
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
            this.updateDataSendingConf(this.formItem).then(res => {
              this.modal.isShow = false
              this.getData()
            })
          } else {
            this.addDataSendingConf(this.formItem).then(res => {
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

    // 获取数据字典下拉
    this.getDictTypeList('send_type').then(list => {
      this.sendTypeList = list
    })
    this.getDictTypeList('data_pack_type').then(list => {
      this.packTypeList = list
    })
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
