<template>
  <div class="main">
    <Card>
      <p slot="title">字典管理</p>
    <Row>
      <Col span="24">
          <Row class="condition">
            <Form inline>
              <FormItem label="字典名称" :label-width="80">
                <Input v-model="searchName" placeholder="请输入字典名称" />
              </FormItem>
              <FormItem label="字典编码" :label-width="80">
                <Input v-model="searchCode" placeholder="请输入字典编码" />
              </FormItem>
              <FormItem>
                <Button type="info" @click="searchDict" class="btns" v-hasPermission="'dict_search'">查询</Button>
              </FormItem>
              <FormItem>
                <Button type="success" @click="addDict" class="btns" v-hasPermission="'dict_add'">新增</Button>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="edit" class="btns" v-hasPermission="'dict_edit'">编辑</Button>
              </FormItem>
              <FormItem>
                <Button type="error" @click="onDelete" v-hasPermission="'dict_del'">删除</Button>
              </FormItem>
            </Form>
          </Row>
          <Row class="tab">
            <Col span="24">
              <tables
                size = 'default'
                ref="tables"
                highlight-row
                @on-current-change ="delChange"
                search-place="top"
                v-model="datas"
                :columns="columns"
                @on-dict-type="openDictTypeDetail"
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
      </Col>
    </Row>
    <Modal
      v-model="dictModal.isShow"
      title="字典详情">
      <div slot="footer">
        <Button type="warning" @click="dictModalCancel('formValidate')">取消</Button>
        <Button type="primary" @click="dictModalOk('formValidate')">提交</Button>
      </div>
      <Form :model="formItem" :label-width="80" :rules="ruleValidate" ref="formValidate">
        <FormItem label="字典名称" prop="name">
          <Input v-model="formItem.name"></Input>
        </FormItem>
        <FormItem label="字典编码" prop="code">
          <Input :disabled="disabled"  v-model="formItem.code"></Input>
        </FormItem>
        <FormItem label="排序号" prop="sort">
          <Input v-model="formItem.sort"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="dictModal.isShowType"
      title="字典项详情">
      <div slot="footer">
        <Button type="warning" @click="dictTypeModalCancel('formValidateType')">取消</Button>
        <Button type="primary" @click="dictTypeModalOk('formValidateType')">提交</Button>
      </div>
      <Form :model="formItemType" :label-width="100" :rules="ruleValidate" ref="formValidateType">
        <FormItem label="字典项名称" prop="name">
          <Input v-model="formItemType.name"></Input>
        </FormItem>
        <FormItem label="排序号">
          <Input v-model="formItemType.sort"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      :width="650"
      v-model="dictTypeModal.isShow"
      title="字典项列表">
      <div slot="footer"></div>
      <Row>
        <Col span="24">
          <Form inline>
            <FormItem>
              <Button type="success" @click="addDictType" class="btns" v-hasPermission="'dict_type_add'">新增</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="editDictType" class="btns" v-hasPermission="'dict_type_edit'">编辑</Button>
            </FormItem>
            <FormItem>
              <Button type="error" @click="onDeleteDictType" v-hasPermission="'dict_type_del'">删除</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <tables
            size = 'default'
            ref="tablesDictType"
            highlight-row
            @on-current-change ="selectChange"
            search-place="top"
            v-model="datasDictType"
            :columns="columnsDictType"
            style="height:300px;overflow-x:hidden;overflow-y:scroll;"
          />
        </Col>
      </Row>
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
  name: 'dict',
  components: {
    Tables
  },
  data () {
    return {
      dictTypeModal: {
        isShow: false
      },
      disabled: false,
      user: {},
      operateFlag: 'add', // 标识当前操作：add、edit
      searchName: '',
      searchCode: '',
      datasDictType: [],
      columnsDictType: [{
        title: '编号',
        type: 'index',
        width: 100,
        align: 'center'
      }, {
        title: '字典项名称',
        align: 'center',
        key: 'name',
        sortable: false
      }, {
        title: '排序号',
        align: 'center',
        key: 'sort',
        sortable: false
      }],
      columns: [{
        title: '编号',
        type: 'index',
        width: 100,
        align: 'center'
      }, {
        title: '字典名称',
        align: 'center',
        key: 'name',
        sortable: false
      }, {
        title: '字典编码',
        align: 'center',
        key: 'code',
        sortable: false
      }, {
        title: '排序号',
        align: 'center',
        key: 'sort',
        sortable: false
      }, {
        title: '操作',
        align: 'center',
        key: 'handle',
        options: ['dictTypeDetail']
      }],
      current: 1,
      size: 10,
      page: 1,
      pageSize: 10,
      count: 0,
      tableData: [],
      query: {},
      dictModal: {
        isShow: false,
        isShowType: false
      },
      formItem: {
        code: '',
        name: '',
        // dictDesc: ''
        sort: '0'
        // createdEmp: this.user.id
      },
      formItemType: {
        name: '',
        parentId: 0,
        sort: '0',
        code: ''
      },
      ruleValidate: {
        code: [{
          required: true, message: '请输入字典编码', trigger: 'blur', type: 'string'
        }],
        name: [{
          required: true, message: '请输入字典名称', trigger: 'blur', type: 'string'
        }],
        sort: [{
          required: true, message: '请输入排序号', trigger: 'blur', type: 'string'
        }]
      },
      dictId: -1,
      dictTypeSelected: null,
      currentSelectedDict: {}
    }
  },
  methods: {
    ...mapActions([
      'getDictsList',
      'getDictTypesList',
      'addDictInfo',
      'addDictTypeInfo',
      'removeDict',
      'removeDictType',
      'updateDictInfo',
      'updateDictTypeInfo'
    ]),
    openDictTypeDetail (record) {
      const { row } = record
      this.currentSelectedDict = row
      this.formItemType.parentId = row.id
      this.formItemType.code = row.code
      this.getDictTypeList()
    },
    // 获取字典项
    getDictTypeList () {
      this.getDictTypesList(this.currentSelectedDict.id).then(res => {
        this.datasDictType = res.data.data
        this.dictTypeModal.isShow = true
      }).catch(err => {
        console.error(err)
      })
    },
    // 查询列表
    getData () {
      this.query.current = this.page
      this.query.size = this.pageSize
      this.getDictsList(this.query).then(res => {
        const { total, records } = res.data.data
        this.count = total
        this.tableData = records
      }).catch(err => {
        console.error(err)
      })
    },
    // 查询按钮
    searchDict () {
      if (!this.searchName && !this.searchCode) {
        delete this.query.optionCode
        delete this.query.name
        this.getData()
      } else if (!this.searchName && this.searchCode) {
        delete this.query.name
        this.query.optionCode = this.searchCode
        this.getData()
      } else if (this.searchName && !this.searchCode) {
        delete this.query.optionCode
        this.query.name = this.searchName
        this.getData()
      } else if (this.searchName && this.searchCode) {
        this.query.optionCode = this.searchCode
        this.query.name = this.searchName
        this.getData()
      } else {
        this.getData()
      }
    },
    pageChanged (page) {
      this.page = page
      this.getData()
    },
    pageSizeChanged (pageSize) {
      this.pageSize = pageSize
      this.getData()
    },
    onDetail (params) {
      this.dictModal.isShow = true
      this.formItem = this.$lodash.assign({}, params.row)
    },
    delChange (val) {
      this.dictId = val
    },
    selectChange (val) {
      this.dictTypeSelected = val
    },
    onDeleteDictType (params) {
      const that = this
      if (!that.dictTypeSelected) {
        that.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行操作'
        })
      } else {
        that.$Modal.confirm({
          title: '提示',
          content: '是否确认删除？',
          onOk () {
            that.removeDictType(that.dictTypeSelected.id).then(res => {
              that.$Notice.success({
                title: '提醒',
                desc: res.data.msg
              })
              that.dictTypeSelected = null
              that.getDictTypeList()
            }).catch(err => {
              that.dictTypeSelected = null
              console.error(err)
            })
          }
        })
      }
    },
    onDelete (params) {
      const that = this
      if (that.dictId.id === -1) {
        that.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行操作'
        })
      } else {
        that.$Modal.confirm({
          title: '提示',
          content: '是否确认删除？',
          onOk () {
            const rowId = that.dictId.id
            that.removeDict(rowId).then(res => {
              if (res.data.code === 'success') {
                that.$Notice.success({
                  title: '提醒',
                  desc: res.data.msg
                })
                that.dictId.id = -1
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
    addDict () {
      this.$refs['formValidate'].resetFields()
      this.dictModal.isShow = true
      this.disabled = false
      this.operateFlag = 'add'
    },
    addDictType () {
      this.$refs['formValidateType'].resetFields()
      this.dictModal.isShowType = true
      this.operateFlag = 'add'
    },
    edit () {
      if (this.dictId === -1) {
        this.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行操作'
        })
      } else {
        this.disabled = true
        this.formItem = this.$lodash.assign({}, this.dictId)
        this.dictModal.isShow = true
        this.operateFlag = 'edit'
      }
    },
    editDictType () {
      if (!this.dictTypeSelected) {
        this.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行操作'
        })
      } else {
        this.formItemType = this.$lodash.assign({}, this.dictTypeSelected)
        this.dictModal.isShowType = true
        this.operateFlag = 'edit'
      }
    },

    dictTypeModalOk (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // 新增字典接口
          if (this.operateFlag === 'edit') {
            this.updateDictTypeInfo({
              id: this.formItemType.id,
              name: this.formItemType.name,
              sort: this.formItemType.sort,
              code: this.formItemType.code
            }).then(res => {
              this.dictModal.isShowType = false
              this.getDictTypeList()
            }).catch(err => {
              console.error(err)
            })
          } else {
            delete this.formItemType.id
            this.addDictTypeInfo(this.formItemType).then(res => {
              this.dictModal.isShowType = false
              this.getDictTypeList()
            }).catch(err => {
              console.error(err)
            })
          }
        }
      })
    },
    dictModalOk (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // 新增字典接口
          if (this.operateFlag === 'edit') {
            this.updateDictInfo({
              id: this.formItem.id,
              code: this.formItem.code,
              name: this.formItem.name,
              sort: this.formItem.sort
              // dictDesc: this.formItem.dictDesc
            }).then(res => {
              this.dictModal.isShow = false
              this.getData()
            }).catch(err => {
              console.error(err)
            })
          } else {
            this.formItem.createdEmp = this.user.id
            delete this.formItem.id
            this.formItem.parentId = 0
            this.addDictInfo(this.formItem).then(res => {
              this.dictModal.isShow = false
              this.getData()
            }).catch(err => {
              console.error(err)
            })
          }
        }
      })
    },
    dictModalCancel (name) {
      this.dictModal.isShow = false
    },
    dictTypeModalCancel (name) {
      this.dictModal.isShowType = false
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
