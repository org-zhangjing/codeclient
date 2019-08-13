<template>
  <div class="main">
    <Card>
      <p slot="title">岗位管理</p>
    <Row>
      <Col span="24">
          <Row class="condition">
          <Form inline>
            <FormItem label="岗位名称" :label-width="80">
              <Input v-model="searchName" placeholder="请输入岗位名称" />
            </FormItem>
            <FormItem label="岗位编码" :label-width="80">
              <Input v-model="searchCode" placeholder="请输入岗位名称" />
            </FormItem>
            <FormItem>
              <Button type="info" @click="searchPosition" v-hasPermission="'postion_all'" class="btns">查询</Button>
            </FormItem>
            <FormItem>
              <Button type="success" @click="addRole" v-hasPermission="'postion_add'" class="btns">新增</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="edit" v-hasPermission="'postion_update'" class="btns">编辑</Button>
            </FormItem>
            <FormItem>
              <Button type="error" @click="onDelete" v-hasPermission="'postion_del'">删除</Button>
            </FormItem>
          </Form>
        </Row>
          <Row class="tab">
            <Col span="24">
              <tables
                size="default"
                highlight-row
                @on-current-change ="delChange"
                ref="tables"
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
        <!-- </Card> -->
      </Col>
    </Row>
    <Modal v-model="positionModal.isShow" title="员工详情">
      <div slot="footer">
        <Button type="warning" @click="positionModalCancel('formValidate')">取消</Button>
        <Button type="primary" @click="positionModalOk('formValidate')">提交</Button>
      </div>
      <Form :model="formItem" :label-width="80" :rules="ruleValidate" ref="formValidate">
        <FormItem label="岗位名称" prop="posiName">
          <Input v-model="formItem.posiName"></Input>
        </FormItem>
        <FormItem label="岗位编码" prop="posiCode">
          <Input v-model="formItem.posiCode"></Input>
        </FormItem>
        <FormItem label="岗位等级" prop="posiLevel">
          <Input v-model="formItem.posiLevel"></Input>
        </FormItem>
      </Form>
    </Modal>
    </Card>
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
import { transformTime } from '@/libs/util.js'
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
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 100,
          align: 'center'
        },
        {
          title: '岗位名',
          align: 'center',
          key: 'posiName',
          height: 10,
          sortable: false
        },
        {
          title: '岗位编码',
          align: 'center',
          key: 'posiCode',
          height: 10,
          sortable: false
        },
        {
          title: '岗位等级',
          align: 'center',
          key: 'posiLevel',
          height: 10,
          sortable: false
        },
        // {
        //   title: '岗位类型',
        //   align: 'center',
        //   key: 'type',
        //   height: 10,
        //   sortable: false
        // },
        {
          title: '操作时间',
          // width: 180,
          height: 10,
          align: 'center',
          key: 'startTime',
          editable: false,
          render: function (h, params) {
            return h(
              'span',
              transformTime(this.row.startTime)
            )
          }
        }
        // {
        //   title: '操作',
        //   align: 'center',
        //   // width: 260,
        //   key: 'handle',
        //   // fixed: 'right',
        //   sortable: false,
        //   options: ['delete', 'detail']
        // }
      ],
      current: 1,
      size: 10,
      page: 1,
      pageSize: 10,
      searchName: '',
      searchCode: '',
      count: 0,
      tableData: [],
      query: {},
      positionModal: {
        isShow: false
      },
      formItem: {
        posiName: '',
        posiCode: '',
        userStatus: 0
        // visible: false
      },
      ruleValidate: {
        posiName: [{
          required: true, message: '请输入岗位名称', trigger: 'change', type: 'string'
        }],
        posiCode: [{
          required: true, message: '请输入岗位编码', trigger: 'change', type: 'string'
        }]
      },
      positionsId: -1
    }
  },
  methods: {
    ...mapActions([
      'getPosiList',
      'addPositionInfo',
      'delPosition',
      'updatePositionInfo'
    ]),
    // 查询列表
    getData () {
      this.query.size = this.pageSize
      this.query.current = this.page
      this.getPosiList(this.query).then(res => {
        const { records, total } = res.data.data
        this.tableData = records || []
        this.count = total
      }).catch(err => {
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
    edit () {
      if (this.positionsId === -1) {
        that.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行操作'
        })
      } else {
        this.positionModal.isShow = true
        this.formItem = this.$lodash.assign({}, this.positionsId)
      }
    },
    delChange (val) {
      this.positionsId = val
    },

    // 删除
    onDelete () {
      const that = this
      if (that.positionsId.id === -1) {
        that.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行操作'
        })
      } else {
        that.$Modal.confirm({
          title: '提示',
          content: '是否确认删除？',
          onOk () {
            const rowId = that.positionsId.id
            that.delPosition(rowId).then(res => {
              if (res.data.code === 'success') {
                that.$Notice.success({
                  title: '提醒',
                  desc: res.data.msg
                })
                that.positionsId.id = -1
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
    // 新增按钮
    addRole () {
      this.$refs['formValidate'].resetFields()
      this.positionModal.isShow = true
    },
    searchPosition () {
      if (!this.searchName && !this.searchCode) {
        delete this.query.posiCode
        delete this.query.posiName
        this.getData()
      } else if (!this.searchName && this.searchCode) {
        delete this.query.posiName
        this.query.posiCode = this.searchCode
        this.getData()
      } else if (this.searchName && !this.searchCode) {
        delete this.query.posiCode
        this.query.posiName = this.searchName
        this.getData()
      } else {
        this.getData()
      }
    },
    positionModalOk (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // 新增岗位接口
          if (this.formItem.id) {
            this.updatePositionInfo(this.formItem).then(res => {
              this.positionModal.isShow = false
              this.getData()
              this.$Notice.success({
                title: '提示',
                desc: '修改成功'
              })
            }).catch(err => {
              console.error(err)
            })
          } else {
            this.addPositionInfo(this.formItem).then(res => {
              this.positionModal.isShow = false
              this.getData()
              this.$Notice.success({
                title: '提示',
                desc: '新增成功'
              })
            }).catch(err => {
              console.error(err)
            })
          }
        }
      })
    },
    positionModalCancel (name) {
      this.positionModal.isShow = false
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
