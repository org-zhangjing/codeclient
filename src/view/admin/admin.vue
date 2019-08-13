<template>
  <div>
    <Row>
      <Col span="24">
      <Card>
        <p slot="title">
          <Icon type="briefcase"></Icon>
          系统用户
        </p>
        <Row>
          <Form>
            <Col span="6">
            <FormItem label="用户名">
              <Input v-model="searchName" icon="search" @on-enter="handleSearch" placeholder="请输入用户名" style="width: 130px;margin-bottom: 10px;" />
            </FormItem>
            </Col>
          </Form>
          <span @click="handleSearch" style="margin: 0 10px;">
            <Button type="primary" icon="search" style="vertical-align:top">搜索</Button>
          </span>
          <Button type="success" @click="addAdmin" icon="search" style="vertical-align:top;float:right">注册</Button>
        </Row>
        <Row class="edittable-table-height-con">
          <tables ref="tables" editable search-place="top" v-model="datas" @on-detail="onDetail" @on-delete="handleDel" stripe :columns="columns" />
          <!-- <can-edit-table refs="table" @on-detail="onDetail" v-model="datas" :columns-list="editInlineColumns" @on-delete="handleDel"></can-edit-table> -->
        </Row>
      </Card>
      </Col>
    </Row>
    <Row style="margin-top: 10px">
      <Col span="24" style="text-align:right">
      <Page :current="page" :page-size="pageSize" :page-size-opts="[10, 20, 50]" :total="total" show-elevator show-sizer show-total @on-change="pageChanged" @on-page-size-change="pageSizeChanged"></Page>
      </Col>
    </Row>
    <Modal v-model="modal" title="修改" @on-ok="ok" @on-cancel="cancel" ok-text="保存" :mask-closable="false" :loading="loading">
      <Form class="step-form" ref="step" :model="step" :rules="stepRules" :label-width="100">
        <FormItem label="用户名" prop="name">
          <Input :disabled="hasSubmit" v-model="step.name" placeholder="请输入用户名" style="width:200px" />
        </FormItem>
        <!-- <FormItem label="密码" prop="hashed_password">
          <Input :disabled="hasSubmit" v-model="step.hashed_password" placeholder="请输入hash密码" style="width:200px" />
        </FormItem> -->
        </FormItem>
        <FormItem label="是否被禁止" prop="is_block">
          <RadioGroup v-model="step.is_block">
            <Radio :disabled="hasSubmit" label="1">是</Radio>
            <Radio :disabled="hasSubmit" label="0">否</Radio>

          </RadioGroup>
        </FormItem>
        <FormItem label="头像" prop="avatar">
          <img :src="step.avatar" style="width: 58px;height:58px;line-height: 58px;" v-show="visible">
          <Upload ref="upload" name="filename" :show-upload-list="false" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="1024" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" type="drag" :action="uploadAction" style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="md-camera" size="20"></Icon>
            </div>
          </Upload>

        </FormItem>
      </Form>
      <span slot="close">关闭</span>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import dayjs from 'dayjs'
import { mapActions } from 'vuex'
export default {
  name: 'admin_index',
  components: {
    Tables
  },
  data () {
    return {
      hasSubmit: false,
      tableData: [],
      columns: [
        {
          title: '用户名',
          width: 120,
          align: 'center',
          key: 'name',
          sortable: false
        },
        {
          title: '是否被禁止',
          width: 120,
          align: 'center',
          key: 'is_block',
          sortable: false,
          render: function (h, params) {
            return h('span', this.row.userStatus === 1 ? '是' : '否')
          }
        },
        {
          title: '注册时ip',
          width: 180,
          align: 'center',
          key: 'register_ip',
          sortable: false
        },
        {
          title: '上次登录ip',
          width: 180,
          align: 'center',
          key: 'last_signIn_ip',
          sortable: false
        },
        {
          title: '注册时间',
          width: 180,
          align: 'center',
          key: 'register_time',
          editable: false,
          render: function (h, params) {
            return h(
              'span',
              dayjs(this.row.register_time * 1000).format('YYYY-MM-DD HH:mm:ss')
            )
          }
        },
        {
          title: '上次登录时间',
          width: 180,
          align: 'center',
          key: 'last_login_time',
          editable: false,
          render: function (h, params) {
            return h(
              'span',
              dayjs(this.row.last_login_time * 1000).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            )
          }
        },
        {
          title: '最近更新',
          width: 180,
          align: 'center',
          key: 'updated_at',
          editable: false,
          render: function (h, params) {
            return h(
              'span',
              dayjs(this.row.updated_at * 1000).format('YYYY-MM-DD HH:mm:ss')
            )
          }
        },
        {
          title: '操作',
          width: 180,
          fixed: 'right',
          align: 'center',
          key: 'handle',
          sortable: false,
          options: ['delete', 'detail']
        }
      ],
      page: 1,
      pageSize: 10,
      searchName: '',
      modal: false,
      loading: true,
      userList: [],
      visible: false,
      defaultList: [],
      uploadAction: `//upload`,
      step: {
        name: '',
        hashed_password: '',
        register_ip: '',
        avatar: '',
        is_block: ''
      },
      stepRules: {
        naem: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
        // hashed_password: [
        //   { required: true, message: '请输入密码', trigger: 'blur' }
        // ]
      }
    }
  },
  methods: {
    ...mapActions(['getAllAdmin', 'delAdmin', 'updateAdmin']),
    ...mapActions({
      add: 'addAdmin'
    }),
    // 新增
    addAdmin () {
      Object.keys(this.step).forEach(key => {
        this.step[key] = ''
      })
      this.step.is_block = '0'
      this.visible = false
      this.modal = true
    },
    // 修改
    ok () {
      this.loading = false
      this.$refs['step'].validate(valid => {
        if (valid) {
          if (this.step.id) {
            this.updateAdmin(this.step)
              .then(res => {
                this.$Notice.success({
                  title: '提醒',
                  desc: '修改成功'
                })
                this.getData()
                this.modal = false
                this.$nextTick(() => {
                  this.loading = true
                })
              })
              .catch(err => {
                this.$nextTick(() => {
                  this.loading = true
                })
                console.error(err)
              })
          } else {
            this.add(this.step)
              .then(res => {
                this.$Notice.success({
                  title: '提醒',
                  desc: '新增成功'
                })
                this.getData()
                this.modal = false
                this.$nextTick(() => {
                  this.loading = true
                })
              })
              .catch(err => {
                console.error(err)
                this.$nextTick(() => {
                  this.loading = true
                })
              })
          }
        }
      })
    },
    cancel () {
      this.getData()
    },
    changeStatus (index) {
      console.log('index: ', index)
    },
    // 详情
    onDetail (val, index) {
      const admin = val.row
      this.step = admin
      this.step.is_block = !this.step.is_block ? '0' : '1'
      // this.stap.register_time = dayjs(this.stap.register_time * 1000).format(
      //       "YYYY-MM-DD  HH:mm:ss"
      //     );
      this.modal = true
    },
    getData (query) {
      this.getAllAdmin(query)
        .then(res => {
          this.userList = []
          this.userList.push({ id: 0, name: '无' })
          this.userList.push(...res.data.rows)
          this.tableData = res.data.rows || []
        })
        .catch(err => {
          console.error(err)
        })
    },
    pageChanged (page) {
      this.page = page
    },
    pageSizeChanged (pageSize) {
      this.pageSize = pageSize
    },
    handleSearch () {
      if (this.searchName.trim()) {
        this.getData({
          name: this.searchName.trim()
        })
      } else {
        this.getData()
      }
    },
    // 头像上传
    handleSuccess (res, file) {
      if (res.url) {
        this.step.avatar = res.url || ''
        this.visible = true
      }
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

    handleDel (val, index) {
      this.delAdmin(val.row.id)
        .then(res => {
          this.$Notice.success({
            title: '提醒',
            desc: '删除成功'
          })
          this.getData()
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  computed: {
    datas: {
      get () {
        return this.tableData.slice(
          (this.page - 1) * this.pageSize,
          this.page * this.pageSize
        )
      },
      set (val) {}
    },
    total: {
      get () {
        return (this.tableData || []).length
      },
      set (val) {}
    }
  },
  created () {
    this.getData()
  }
}
</script>
