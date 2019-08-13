<template>
  <div>
    <Card>
      <p slot="title">流程管理</p>
    <Tabs type="card">
      <TabPane label="我的待办">
        <Form inline ref="leaveForm">
          <!-- <FormItem label="请假天数" :label-width="80">
            <Input placeholder="请输入请假天数" />
          </FormItem>
          <FormItem>
            <Button type="info" class="btns">查询</Button>
          </FormItem> -->
        </Form>
        <tables
          size = 'default'
          ref="tables"
          highlight-row
          search-place="top"
          @on-row-dblclick="dblclick"
          v-model="datas"
          :columns="columns"
        />
        <Page
          style="margin-top:10px;float:right;"
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
      </TabPane>
      <TabPane label="请假列表">
        <Form inline>
          <!-- <FormItem label="请假天数" :label-width="80">
            <Input placeholder="请输入请假天数" />
          </FormItem>
          <FormItem>
            <Button type="info" class="btns">查询</Button>
          </FormItem> -->
          <FormItem>
            <Button type="success" class="btns" @click="add('formValidate')" style="margin-left:10px;" v-hasPermission="'process_add'">新增</Button>
          </FormItem>
        </Form>
        <tables
          size = 'default'
          ref="tables"
          highlight-row
          search-place="top"
          v-model="datasDetail"
          @on-row-dblclick="dblclickDetail"
          :columns="columns"
        />
        <Page
          style="margin-top:10px;float:right;"
          :current="current"
          :page-size="size"
          :page-size-opts="[10, 20, 50]"
          :total="totalDetail"
          show-elevator
          show-sizer
          show-total
          @on-change="pageChangedDetail"
          @on-page-size-change="pageSizeChangedDetail"
        ></Page>
      </TabPane>
    </Tabs>
    <Modal
      v-model="detailMoal.show"
      title="请假详情"
      >
      <div slot="footer">
        <Button type="warning" @click="cancel('formValidate')">取消</Button>
        <Button type="primary" @click="ok('formValidate')">提交</Button>
      </div>
      <Form :model="formItem" :label-width="80" ref="formValidate" :rules="ruleValidate">
        <FormItem label="请假天数" prop="day">
          <Input v-model="formItem.day" placeholder="请输入请假天数"></Input>
        </FormItem>
        <FormItem label="请假原因" prop="content">
          <Input v-model="formItem.content" placeholder="请输入请假原因"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      :width="1000"
      v-model="detailMoal.showEdit"
      title="请假详情">
      <div slot="footer">
      </div>
      <Tabs type="card">
      <TabPane label="请假明细">
        <Form :model="formItemDetail" :label-width="80" ref="formValidateDetail" style="margin-bottom:-20px">
          <FormItem label="请假天数" prop="day">
            <Input v-model="formItemDetail.day" placeholder="请输入请假天数" style="width:200px;" disabled></Input>
          </FormItem>
          <FormItem label="请假原因" prop="content">
            <Input v-model="formItemDetail.content" placeholder="请输入请假原因" style="width:200px;" disabled></Input>
          </FormItem>
          <FormItem label="批示内容" prop="comment">
            <Input v-model="formItemDetail.comment" type="textarea" :rows="3" style="width:300px;" placeholder="请输入批示" :disabled="!formItemDetail.isShowSubmit"></Input>
          </FormItem>
          <FormItem v-show="formItemDetail.isShowSubmit">
            <Button type="error" @click="reject('formValidateDetail')" style="margin-right: 15px;" v-hasPermission="'process_reject'">拒绝</Button>
            <Button type="info" @click="submit('formValidateDetail')" style="margin-right: 15px;" v-hasPermission="'process_agree'">同意</Button>
            <!-- <Button type="success" @click="ok('formValidateDetail')">同意</Button> -->
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="流程图示">
        <img :src="processImgSrc" alt="流程图显示异常" style="width:900px;"></img>
      </TabPane>
      <TabPane label="历史批示">
        <tables
          size = 'default'
          ref="tablesComment"
          highlight-row
          search-place="top"
          v-model="datasComment"
          :columns="columnsComment"
        />
      </TabPane>
      </Tabs>
    </Modal>
    </Card>
  </div>
</template>
<script>
import Tables from '_c/tables'
import dayjs from 'dayjs'
import { mapActions } from 'vuex'
export default {
  name: 'process',
  components: {
    Tables
  },
  data () {
    return {
      processImgSrc: '',
      current: 1,
      size: 10,
      count: 0,
      countDetail: 0,
      tableData: [],
      tableDataDetail: [],
      detailMoal: {
        show: false,
        showEdit: false
      },
      // 新增的表单
      formItem: {
        day: '1',
        content: ''
      },
      columnsComment: [{
        title: '序号',
        type: 'index',
        width: 100,
        align: 'center'
      }, {
        title: '批示人',
        key: 'userName',
        sortable: false,
        align: 'center'
      }, {
        title: '批示内容',
        key: 'content',
        sortable: false,
        align: 'center'
      }, {
        title: '批示时间',
        sortable: false,
        align: 'center',
        render: function (h, params) {
          return h('span', params.row.approvalTime ? dayjs(params.row.approvalTime.time).format('YYYY-MM-DD HH:mm:ss') : '-')
        }
      }],
      // 编辑&查看详情表单
      formItemDetail: {
        day: '0',
        content: '',
        isShowSubmit: false,
        comment: ''
      },
      columns: [{
        title: '序号',
        type: 'index',
        width: 100,
        align: 'center'
      }, {
        title: '请假天数',
        align: 'center',
        key: 'day',
        sortable: false,
        render: function (h, params) {
          return h('span', params.row.content ? params.row.content.day : '-')
        }
      }, {
        title: '发起人',
        align: 'center',
        key: 'assignee',
        sortable: false,
        render: function (h, params) {
          return h('span', params.row.content ? params.row.content.userName : '-')
        }
      }, {
        title: '发起时间',
        align: 'center',
        key: 'createTime',
        sortable: false,
        render: function (h, params) {
          return h('span', params.row.createTime ? dayjs(params.row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-')
        }
      }, {
        title: '当前节点',
        align: 'center',
        key: 'name',
        sortable: false
      }, {
        title: '请假原因',
        align: 'center',
        key: 'content',
        sortable: false,
        render: function (h, params) {
          return h('span', params.row.content ? params.row.content.content : '-')
        }
      }],
      queryTodo: {},
      page: 1,
      pageSize: 10,
      pageDetail: 1,
      pageSizeDetail: 10,
      ruleValidate: {
        day: [{
          required: true, message: '请输入请假天数', trigger: 'blur', type: 'string'
        }],
        content: [{
          required: true, message: '请输入请假原因', trigger: 'blur', type: 'string'
        }]
      },
      currentSelectedRow: null,
      datasComment: [] // 批示列表
    }
  },
  methods: {
    ...mapActions([
      'getHistoryList',
      'getTodoList',
      'startProcess',
      'endProcess',
      'finishWorkItem',
      'getHistoryComments',
      'getProcessImg'
    ]),
    add (name) {
      this.$refs[name].resetFields()
      this.detailMoal.show = true
    },
    dblclick (row, index) {
      this.$refs['formValidate'].resetFields()
      this.formItemDetail.day = row.content.day
      this.formItemDetail.content = row.content.content
      this.formItemDetail.isShowSubmit = true
      this.detailMoal.showEdit = true
      this.currentSelectedRow = row
      // 查询历史批示
      this.getHisComments({
        taskId: this.currentSelectedRow.id
      })
      this.getProcessImgInfo()
    },
    dblclickDetail (row, index) {
      this.$refs['formValidateDetail'].resetFields()
      this.formItemDetail.day = row.content.day
      this.formItemDetail.content = row.content.content
      this.formItemDetail.isShowSubmit = false
      this.detailMoal.showEdit = true
      this.currentSelectedRow = row
      // 查询历史批示
      this.getHisComments({
        taskId: this.currentSelectedRow.id
      })
      this.getProcessImgInfo()
    },
    // 拒绝
    reject () {
      const that = this
      this.endProcess({
        processInstanceId: this.currentSelectedRow.processInstanceId,
        taskId: this.currentSelectedRow.id,
        userId: this.$store.state.user.userInfo.id,
        content: this.formItemDetail.comment
      }).then(res => {
        this.detailMoal.showEdit = false
        this.currentSelectedRow = null
        this.$refs['formValidateDetail'].resetFields()
        that.$Notice.success({
          title: '提醒',
          desc: '操作成功'
        })
        this.getTodos({
          assignee: this.$store.state.user.userInfo.id
        })
        this.getHistorys({
          taskAssignee: this.$store.state.user.userInfo.id
        })
      }).catch(err => {
        console.error(err)
      })
    },
    // 获取历史批示
    getHisComments (params) {
      this.getHistoryComments(params).then(res => {
        this.datasComment = res.data.data
      }).catch(err => {
        console.error(err)
      })
    },
    cancel (name) {
      this.detailMoal.show = false
      this.$refs[name].resetFields()
    },
    ok (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.fetchProcess({
            userId: this.$store.state.user.userInfo.id,
            processId: 'myProcess_1',
            day: this.formItem.day,
            content: this.formItem.content
          })
        }
      })
    },
    // 发起流程
    fetchProcess (query) {
      const that = this
      this.startProcess(query).then(res => {
        that.$Notice.success({
          title: '提醒',
          desc: '操作成功'
        })
        this.detailMoal.show = false
        this.getTodos({
          assignee: this.$store.state.user.userInfo.id
        })
        this.getHistorys({
          taskAssignee: this.$store.state.user.userInfo.id
        })
      }).catch(err => {
        console.error(err)
      })
    },
    // 获取待办列表
    getTodos (query) {
      this.getTodoList(Object.assign({}, query, this.queryTodo)).then(res => {
        if (res.data.data) {
          this.tableData = res.data.data.taskVOList
          this.count = res.data.data.total
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 获取历史列表
    getHistorys (query) {
      this.getHistoryList(Object.assign({}, query, this.queryTodo)).then(res => {
        if (res.data.data) {
          this.tableDataDetail = res.data.data.taskVOList
          this.countDetail = res.data.data.total
        }
      }).catch(err => {
        console.error(err)
      })
    },
    pageChanged (page) {
      this.page = page
      this.getTodos({
        current: this.page,
        size: this.pageSize,
        assignee: this.$store.state.user.userInfo.id
      })
    },
    pageSizeChanged (pageSize) {
      this.pageSize = pageSize
      this.getTodos({
        current: this.page,
        assignee: this.$store.state.user.userInfo.id,
        size: this.pageSize
      })
    },
    pageChangedDetail (page) {
      this.pageDetail = page
      this.getHistorys({
        current: this.pageDetail,
        size: this.pageSizeDetail,
        taskAssignee: this.$store.state.user.userInfo.id
      })
    },
    pageSizeChangedDetail (pageSize) {
      this.pageSizeDetail = pageSize
      this.getHistorys({
        current: this.pageDetail,
        size: this.pageSizeDetail,
        taskAssignee: this.$store.state.user.userInfo.id
      })
    },
    arrayBufferToBase64: buffer => {
      let binary = ''
      const bytes = new Uint8Array(buffer)
      const len = bytes.byteLength
      for (let i = 0; i < len; i += 1) {
        binary += String.fromCharCode(bytes[i])
      }
      return window.btoa(binary) // base64
    },
    getProcessImgInfo () {
      this.getProcessImg({
        processDefinitionId: this.currentSelectedRow.processDefinitionId,
        resourceName: 'C:\\projects\\system-mangement\\target\\classes\\processes\\leave.myProcess_1.png',
        pProcessInstanceId: this.currentSelectedRow.processInstanceId
      }).then(res => {
        this.processImgSrc = 'data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
      }).catch(err => {
        console.error(err)
      })
    },
    // 完成个人任务
    submit () {
      const that = this
      if (!this.formItemDetail.comment.trim()) {
        this.$Notice.error({
          title: '提示',
          desc: '请输入批示'
        })
        return
      }
      this.finishWorkItem({
        processInstanceId: this.currentSelectedRow.processInstanceId,
        taskId: this.currentSelectedRow.id,
        userId: this.$store.state.user.userInfo.id,
        content: this.formItemDetail.comment
      }).then(res => {
        this.detailMoal.showEdit = false
        this.currentSelectedRow = null
        this.$refs['formValidateDetail'].resetFields()
        that.$Notice.success({
          title: '提醒',
          desc: '操作成功'
        })
        this.getTodos({
          assignee: this.$store.state.user.userInfo.id
        })
        this.getHistorys({
          taskAssignee: this.$store.state.user.userInfo.id
        })
      }).catch(err => {
        console.error(err)
      })
    }
  },
  created () {
    this.getTodos({
      assignee: this.$store.state.user.userInfo.id
    })
    this.getHistorys({
      taskAssignee: this.$store.state.user.userInfo.id
    })
  },
  computed: {
    total: {
      get () {
        return this.count
      },
      set (val) {}
    },
    datas: {
      get () {
        return this.tableData
      },
      set (val) { }
    },
    totalDetail: {
      get () {
        return this.countDetail
      },
      set (val) {}
    },
    datasDetail: {
      get () {
        return this.tableDataDetail
      },
      set (val) { }
    }
  }
}
</script>
