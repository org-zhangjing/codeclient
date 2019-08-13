<template>
  <div class="main">
    <Card>
      <p slot="title">日志管理</p>
    <Row>
      <Col span="24">
        <Form inline style="margin-bottom:-10px;">
          <FormItem label="模块名称" :label-width="80">
            <Input type="text" v-model="formInline.module" placeholder="请输入模块名称"></Input>
          </FormItem>
          <FormItem>
            <Button type="info" @click="searchLog" class="btns" v-hasPermission="'log_search'">查询</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
    <Row class="tab">
      <Col>
        <tables height="530" size="default" ref="tables" search-place="top" v-model="datas" :columns="columns" @on-row-dblclick="dbClick"/>
      </Col>
    </Row>
    <Row style="margin-top: 10px">
      <Col span="24" style="text-align:right">
        <Page
          :current="current"
          :page-size="size"
          :page-size-opts="[50, 150, 200]"
          :total="total"
          show-sizer
          show-total
          @on-change="pageChanged"
          @on-page-size-change="pageSizeChanged"
        ></Page>
      </Col>
    </Row>
    <Modal
        v-model="detailModal.isShow"
        title="详情"
        >
        <div slot="footer">
          <Button type="info" @click="ok" class="btns">确定</Button>
        </div>
        <span style="white-space: normal;word-break:break-all;">
          <h3>Url参数：</h3>
          {{detailModal.remark}}</span>
        <span style="white-space: normal;word-break:break-all;">
          <h3>Body参数：</h3>
          {{detailModal.requestBody}}</span>
    </Modal>
    </Card>
  </div>
</template>
<style scoped>
.btns {
  margin-right: 5px;
}
</style>

<script>
import Tables from '_c/tables'
import dayjs from 'dayjs'
import { mapActions } from 'vuex'
export default {
  name: 'role',
  components: {
    Tables
  },
  data () {
    return {
      formInline: {
        module: ''
      },
      detailModal: {
        isShow: false,
        content: ''
      },
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 100,
          align: 'center'
        },
        {
          title: '操作用户',
          align: 'center',
          key: 'userName',
          sortable: false
        },
        {
          title: '操作时间',
          align: 'center',
          key: 'createTime',
          sortable: false,
          render: function (h, params) {
            return h('span', params.row.createTime ? dayjs(params.row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-')
          }
        },
        {
          title: '模块',
          align: 'center',
          key: 'module',
          sortable: false
        },
        {
          title: '请求Url',
          align: 'center',
          key: 'url',
          sortable: false
        },
        {
          title: '备注',
          align: 'center',
          key: 'remark',
          sortable: false,
          render: function (h, params) {
            if (params.row.remark && params.row.remark.length > 40) {
              return h('span', params.row.remark.substring(0, 40) || '暂无')
            } else {
              return h('span', params.row.remark || '-')
            }
          }
        },
        {
          title: '请求结果',
          align: 'center',
          key: 'flag',
          sortable: false,
          render: function (h, params) {
            return h('span', this.row.flag ? '是' : '否')
          }
        }
      ],
      size: 10,
      current: 1,
      query: {},
      count: 0,
      tableData: []
    }
  },
  methods: {
    ...mapActions([
      'getAllJournal'
    ]),
    getData () {
      this.query.size = this.size
      this.query.current = this.current
      // this.query.id = 1
      this.partype = 'org'
      this.getAllJournal(this.query).then(res => {
        const { records, total } = res.data.data
        this.tableData = records || []
        this.count = total
      }).catch(err => {
        console.error(err)
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
    viewDetails () {},
    searchLog () {
      this.getAllJournal(Object.assign({}, this.query, this.formInline)).then(res => {
        const { records, total } = res.data.data
        this.tableData = records || []
        this.count = total
      }).catch(err => {
        console.error(err)
      })
    },
    dbClick (row, index) {
      this.detailModal.isShow = true
      this.detailModal.remark = row.remark
      this.detailModal.requestBody = row.requestBody
    },
    cancel () {
      this.detailModal.isShow = false
      this.detailModal.remark = ''
      this.detailModal.requestBody = ''
    },
    ok () {
      this.detailModal.isShow = false
      this.detailModal.remark = ''
      this.detailModal.requestBody = ''
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
    this.query.module = ''
    this.getData()
  }
}
</script>
