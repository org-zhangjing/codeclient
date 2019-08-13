<template>
  <div class="main">
    <Card>
      <p slot="title">任务管理</p>
    <Row>
      <Col span="24">
          <Row class="condition" style="margin-left:10px;">
            <Form inline>
              <!-- <FormItem label="任务名称" :label-width="80">
                <Input v-model="queryJob.jobName" placeholder="请输入任务名称" />
              </FormItem>
              <FormItem>
                <Button type="info" @click="searchJob" class="btns">查询</Button>
              </FormItem> -->
              <FormItem>
                <Button type="success" @click="addJob" class="btns" v-hasPermission="'job_add'">新增</Button>
              </FormItem>
              <FormItem>
                <Button type="info" @click="refreshJob" class="btns" v-hasPermission="'job_refresh'">刷新</Button>
              </FormItem>
            </Form>
          </Row>
          <Row class="tab">
            <Col span="24">
              <tables
                size = 'default'
                ref="tables"
                highlight-row
                search-place="top"
                v-model="datas"
                @on-delete="onDelete"
                :columns="columns"
                @on-update="onUpdate"
                @on-pause="onPause"
                @on-resume="onResume"
              />
            </Col>
          </Row>
          <!-- <Row>
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
          </Row> -->
      </Col>
    </Row>
    <Modal
      v-model="jobModal.isShow"
      title="任务详情">
      <div slot="footer">
        <Button type="warning" @click="cancel('formValidate')">取消</Button>
        <Button type="primary" @click="ok('formValidate')">提交</Button>
      </div>
      <Form :model="formItem" :label-width="100" :rules="ruleValidate" ref="formValidate">
        <FormItem label="任务名称" prop="jobClassName">
          <Input v-model="formItem.jobClassName" :disabled="jobModal.enable"></Input>
        </FormItem>
        <FormItem label="任务分组" prop="jobGroupName">
          <Input v-model="formItem.jobGroupName" :disabled="jobModal.enable"></Input>
        </FormItem>
        <!-- <FormItem label="任务类型" prop="roleDesc">
          <RadioGroup v-model="formItem.roleName">
            <Radio label="Simple Trigger"></Radio>
            <Radio label="Cron Trigger"></Radio>
          </RadioGroup>
        </FormItem> -->
        <FormItem label="表达式" prop="cronExpression">
          <Input v-model="formItem.cronExpression"></Input>
        </FormItem>
        <FormItem label="任务描述" prop="description">
          <Input v-model="formItem.description"></Input>
        </FormItem>
        <!-- <FormItem label="多久后执行" prop="roleDesc">
          <Input v-model="formItem.roleDesc" style="width:200px;"></Input>
          <Select style="width:200px;margin-top:10px;">
            <Option v-for="item in timerList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem> -->
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
      queryJob: {
        jobName: ''
      },
      timerList: [{
        label: '年',
        value: '年'
      }, {
        label: '月',
        value: '月'
      }, {
        label: '周',
        value: '周'
      }, {
        label: '天',
        value: '天'
      }, {
        label: '时',
        value: '时'
      }, {
        label: '分',
        value: '分'
      }, {
        label: '秒',
        value: '秒'
      }],
      user: {},
      searchName: '',
      searchCode: '',
      columns: [{
        title: '序号',
        type: 'index',
        width: 100,
        align: 'center'
      }, {
        title: '任务名称',
        align: 'center',
        key: 'jobName',
        sortable: false
      }, {
        title: '任务所在组',
        align: 'center',
        key: 'jobGroup',
        sortable: false
      }, {
        title: '任务类名',
        align: 'center',
        key: 'jobClassName',
        sortable: false
      }, {
        title: '任务描述',
        align: 'center',
        key: 'description',
        sortable: false
      }, {
        title: '触发器名称',
        align: 'center',
        key: 'triggerName',
        sortable: false
      }, {
        title: '触发器所在组',
        align: 'center',
        key: 'triggerGroup',
        sortable: false
      }, {
        title: '表达式',
        align: 'center',
        key: 'cronExpression',
        sortable: false
      }, {
        title: '时区',
        align: 'center',
        key: 'timeZoneId',
        sortable: false
      }, {
        title: '当前状态',
        align: 'center',
        key: 'triggerState',
        sortable: false,
        render: function (h, params) {
          let str = ''
          switch (this.row.triggerState) {
            case 'WAITING':
              str = '等待'
              break
            case 'PAUSED':
              str = '暂停'
              break
            case 'ACQUIRED':
              str = '正常执行'
              break
            case 'BLOCKED':
              str = '阻塞'
              break
            case 'ERROR':
              str = '错误'
              break
            default:
              str = '-'
          }
          return h('span', str)
        }
      }, {
        title: '操作',
        align: 'center',
        key: 'handle',
        width: 310,
        options: ['pause', 'resume', 'delete', 'update']
      }],
      operateFlag: 'add',
      current: 1,
      size: 10,
      count: 0,
      tableData: [],
      query: {},
      jobModal: {
        isShow: false
      },
      formItem: {
        jobClassName: '',
        jobGroupName: '',
        cronExpression: '',
        description: ''
      },
      ruleValidate: {
        jobClassName: [{
          required: true, message: '请输入任务名称', trigger: 'blur', type: 'string'
        }],
        jobGroupName: [{
          message: '请输入任务分组', trigger: 'blur', type: 'string'
        }],
        cronExpression: [{
          required: true, message: '请输入任务表达式', trigger: 'blur', type: 'string'
        }],
        description: [{
          required: true, message: '请输入任务描述', trigger: 'blur', type: 'string'
        }]
      }
    }
  },
  methods: {
    ...mapActions([
      'getJobsList',
      'addJobInfo',
      'removeJob',
      'pauseJob',
      'resumeJob',
      'updateJob'
    ]),
    onUpdate (data) {
      // this.formItem = data.row
      this.formItem.id = data.row.id
      this.formItem.jobGroupName = data.row.jobGroup
      this.formItem.cronExpression = data.row.cronExpression
      this.formItem.description = data.row.description
      this.formItem.jobClassName = data.row.jobClassName.substring(data.row.jobClassName.lastIndexOf('.') + 1)
      // this.formItem.jobClassName = data.row.jobClassName
      this.jobModal.isShow = true
      this.operateFlag = 'edit'
      this.jobModal.enable = true
    },
    onPause (data) {
      const { row } = data
      const that = this
      that.pauseJob({
        jobClassName: row.jobClassName.substring(row.jobClassName.lastIndexOf('.') + 1),
        jobGroupName: row.jobGroup
      }).then(res => {
        that.$Notice.success({
          title: '提醒',
          desc: '操作成功'
        })
        that.getData()
      }).catch(err => {
        console.error(err)
      })
    },
    onResume (data) {
      const { row } = data
      const that = this
      that.resumeJob({
        jobClassName: row.jobClassName.substring(row.jobClassName.lastIndexOf('.') + 1),
        jobGroupName: row.jobGroup
      }).then(res => {
        that.$Notice.success({
          title: '提醒',
          desc: '操作成功'
        })
        that.getData()
      }).catch(err => {
        console.error(err)
      })
    },
    // 查询列表
    getData (query) {
      this.query.current = this.page
      this.query.size = this.pageSize
      this.getJobsList(Object.assign({}, this.query, query)).then(res => {
        const { total, records } = res.data.data
        this.count = total
        this.tableData = records
      }).catch(err => {
        console.error(err)
      })
    },
    refreshJob () {
      this.getData()
    },
    // 查询按钮
    searchJob () {
      this.getData(this.queryJob)
    },
    pageChanged (page) {
      this.page = page
      this.getData()
    },
    pageSizeChanged (pageSize) {
      this.pageSize = pageSize
      this.getData()
    },
    onDelete (data) {
      const { row } = data
      const that = this
      that.removeJob({
        jobClassName: row.jobClassName.substring(row.jobClassName.lastIndexOf('.') + 1),
        jobGroupName: row.jobGroup
      }).then(res => {
        that.$Notice.success({
          title: '提醒',
          desc: '操作成功'
        })
        that.getData()
      }).catch(err => {
        console.error(err)
      })
    },
    addJob () {
      this.$refs['formValidate'].resetFields()
      this.jobModal.isShow = true
      this.operateFlag = 'add'
      this.jobModal.enable = false
    },
    ok (name) {
      const that = this
      this.$refs[name].validate(valid => {
        if (valid) {
          // 新增任务接口
          if (this.operateFlag === 'edit') {
            this.updateJob({
              id: this.formItem.id,
              jobClassName: this.formItem.jobClassName,
              jobGroupName: this.formItem.jobGroupName,
              cronExpression: this.formItem.cronExpression,
              description: this.formItem.description
            }).then(res => {
              this.jobModal.isShow = false
              that.$Notice.success({
                title: '提醒',
                desc: '操作成功'
              })
              this.getData()
            }).catch(err => {
              console.error(err)
            })
          } else {
            this.addJobInfo(this.formItem).then(res => {
              this.jobModal.isShow = false
              that.$Notice.success({
                title: '提醒',
                desc: '操作成功'
              })
              this.getData()
            }).catch(err => {
              console.error(err)
            })
          }
        }
      })
    },
    cancel (name) {
      this.jobModal.isShow = false
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
