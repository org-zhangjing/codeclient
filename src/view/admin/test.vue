<template>
  <div>
    <Row class="condition">
          <Form inline>
            <FormItem label="用户名" :label-width="60">
              <Input placeholder="请输入用户名"/>
            </FormItem>
            <Button class="btns" type="info">查询</Button>
            <Button class="btns" type="info">新增</Button>
            <Button class="btns" type="info">编辑</Button>
            <Button class="btns" type="error">注销</Button>
          </Form>
        </Row>
    <Row class="tab">
      <Col span="24">
        <tables
          ref="table"
          :height="tableHeight"
          size="small"
          search-place="top"
          v-model="datas"
          :columns="columns"
        />
      </Col>
    </Row>
    <Row style="margin-top: 10px">
      <Col span="24" style="text-align:right">
        <Page
          size="small"
          :current="current"
          :page-size="size"
          :page-size-opts="[50, 100, 150]"
          :total="total"
          show-elevator
          show-sizer
          show-total
          @on-change="pageChanged"
          @on-page-size-change="pageSizeChanged"
        ></Page>
      </Col>
    </Row>
  </div>
</template>
<script>
import Tables from '_c/tables'
export default {
  components: {
    Tables
  },
  data () {
    return {
      tableHeight: 450,
      current: 1,
      size: 50,
      tableData: [],
      columns: [
        {
          title: '用户名',
          width: 80,
          height: 10,
          align: 'center',
          key: 'name',
          sortable: false
        },
        {
          title: '年龄',
          width: 80,
          height: 10,
          align: 'center',
          key: 'age',
          sortable: false
        },
        {
          title: '性别',
          width: 80,
          height: 10,
          align: 'center',
          key: 'sex',
          sortable: false
        },
        {
          title: '爱好',
          width: 80,
          height: 10,
          align: 'center',
          key: 'hobby',
          sortable: false
        },
        {
          title: '成绩',
          width: 80,
          height: 10,
          align: 'center',
          key: 'achievement',
          sortable: false
        },
        {
          title: '用户名',
          width: 80,
          height: 10,
          align: 'center',
          key: 'name',
          sortable: false
        },
        {
          title: '年龄',
          width: 80,
          height: 10,
          align: 'center',
          key: 'age',
          sortable: false
        },
        {
          title: '性别',
          width: 80,
          height: 10,
          align: 'center',
          key: 'sex',
          sortable: false
        },
        {
          title: '爱好',
          width: 80,
          height: 10,
          align: 'center',
          key: 'hobby',
          sortable: false
        },
        {
          title: '成绩',
          width: 80,
          height: 10,
          align: 'center',
          key: 'achievement',
          sortable: false
        },
        {
          title: '成绩',
          width: 80,
          height: 10,
          align: 'center',
          key: 'achievement',
          sortable: false
        },
        {
          title: '用户名',
          width: 80,
          height: 10,
          align: 'center',
          key: 'name',
          sortable: false
        },
        {
          title: '年龄',
          width: 80,
          height: 10,
          align: 'center',
          key: 'age',
          sortable: false
        },
        {
          title: '性别',
          width: 80,
          height: 10,
          align: 'center',
          key: 'sex',
          sortable: false
        },
        {
          title: '爱好',
          width: 80,
          height: 10,
          align: 'center',
          key: 'hobby',
          sortable: false
        },
        {
          title: '成绩',
          width: 80,
          height: 10,
          align: 'center',
          key: 'achievement',
          sortable: false
        },
        {
          title: '用户名',
          width: 80,
          height: 10,
          align: 'center',
          key: 'name',
          sortable: false
        },
        {
          title: '年龄',
          width: 80,
          height: 10,
          align: 'center',
          key: 'age',
          sortable: false
        },
        {
          title: '性别',
          width: 80,
          height: 10,
          align: 'center',
          key: 'sex',
          sortable: false
        },
        {
          title: '爱好',
          width: 80,
          height: 10,
          align: 'center',
          key: 'hobby',
          sortable: false
        },
        {
          title: '成绩',
          width: 80,
          height: 10,
          align: 'center',
          key: 'achievement',
          sortable: false
        }
      ]
    }
  },
  methods: {

    getData () {
      const res = [
        { id: 1, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 2, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 3, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 4, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 5, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 1, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 2, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 3, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 4, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 5, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 1, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 2, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 3, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 4, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 5, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 1, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 2, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 3, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 4, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 5, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 1, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 2, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 3, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 4, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 5, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 1, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 2, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 3, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 4, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 5, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 1, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 2, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 3, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 4, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 5, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 1, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 2, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 3, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 4, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 5, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 1, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 2, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 3, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 4, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 5, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 1, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 2, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 3, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 4, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 5, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 1, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 2, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 3, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 4, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' },
        { id: 5, name: '李四', age: '20', sex: '男', hobby: '篮球', achievement: '80' }]
      this.tableData = res
    },
    pageChanged (current) {
      this.current = current
    },
    pageSizeChanged (size) {
      this.size = size
    }
  },
  computed: {
    datas: {
      get () {
        return this.tableData.slice(
          (this.current - 1) * this.size,
          this.current * this.size
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
  mounted () {
    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 200
  },
  created () {
    this.getData()
  }
}

</script>
<style scoped>
.btns {
  margin-right: 5px;
}
.tab {
  margin: -15px;
  border:0;
}
.condition {
  margin: -10px;
}
</style>
