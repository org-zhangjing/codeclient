<template>
  <div class="main">
    <Card>
      <p slot="title">点表配置</p>
      <Tabs value="yc">
        <TabPane label="遥测点表配置" name="yc">
          <Row class="condition">
            <Form inline :label-width="100">
              <FormItem label="电站编号" >
                <Input v-model="queryYc.telemetrydtfStationNumber" placeholder="请输入电站编号" />
              </FormItem>
              <FormItem label="设备编号">
                <Input v-model="queryYc.telemetrydtfDeviceNumber" placeholder="请输入设备编号" />
              </FormItem>
              <FormItem label="点码编号">
                <Input v-model="queryYc.telemetrydtfNumber" placeholder="请输入点码编号" />
              </FormItem>
              <FormItem label="测点名称">
                <Input v-model="queryYc.telemetrydtfName" placeholder="请输入测点名称" />
              </FormItem>
            </Form>
            <Form inline :label-width="100">
              <FormItem label="需求电站编号" >
                <Input v-model="queryYc.telemetrydtfUStationNumber" placeholder="请输入需求电站编号" />
              </FormItem>
              <FormItem label="需求设备编号">
                <Input v-model="queryYc.telemetrydtfUDeviceNumber" placeholder="请输入需求设备编号" />
              </FormItem>
              <FormItem label="需求点号">
                <Input v-model="queryYc.telemetrydtfUNumber" placeholder="请输入需求点号" />
              </FormItem>
              <FormItem label="需求点号名称">
                <Input v-model="queryYc.telemetrydtfUName" placeholder="请输入需求点号名称" />
              </FormItem>
            </Form>
            <Form inline style="text-align: center;">
              <FormItem>
                <Button type="info" @click="searchYc" class="btns" >查询</Button>
              </FormItem>
              <FormItem>
                <Button type="success" @click="addConfYc"  class="btns">新增</Button>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="editYc" class="btns">编辑</Button>
              </FormItem>
              <FormItem>
                <Button type="error" @click="onDeleteYc" >删除</Button>
              </FormItem>
            </Form>
          </Row>
          <Row class="tab">
            <Col span="24">
              <tables
                size = 'default'
                ref="tablesYc"
                highlight-row
                @on-current-change = "selectChangeYc"
                search-place="top"
                v-model="datasYc"
                @on-detail="onDetailYc"
                :columns="columnsYc"
              />
            </Col>
          </Row>
          <Row>
            <Col span="24" class="page">
              <Page
                :current="currentYc"
                :page-size="sizeYc"
                :page-size-opts="[10, 20, 50]"
                :total="totalYc"
                show-elevator
                show-sizer
                show-total
                @on-change="pageChangedYc"
                @on-page-size-change="pageSizeChangedYc"
              ></Page>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="遥信点表配置" name="yx">

        </TabPane>
        <TabPane label="遥脉点表配置" name="ym">

        </TabPane>
      </Tabs>
    </Card>
    <Modal
      width="720"
      v-model="modalYc.isShow"
      title="遥测点表详情">
      <div slot="footer">
        <Button type="warning" @click="modalCancel('formValidateYc')">取消</Button>
        <Button type="primary" @click="modalOk('formValidateYc')">提交</Button>
      </div>
      <Row>
        <Form :model="formItemYc" :label-width="100" :rules="ruleValidateYc" ref="formValidateYc">
          <Col span="12">
            <FormItem label="电站编号" prop="telemetrydtfStationNumber">
              <Select v-model="formItemYc.telemetrydtfStationNumber">
                <Option :value="item.id" v-for="item in []" :key="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="设备编号" prop="telemetrydtfDeviceNumber">
              <Select v-model="formItemYc.telemetrydtfDeviceNumber">
                <Option :value="item.id" v-for="item in []" :key="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="遥测点码编号" prop="telemetrydtfNumber">
              <Input v-model="formItemYc.telemetrydtfNumber" placeholder="请输入遥测点码编号" />
            </FormItem>
            <FormItem label="遥测测点名称" prop="telemetrydtfName">
              <Select v-model="formItemYc.telemetrydtfName">
                <Option :value="item.id" v-for="item in []" :key="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="遥测测点信息" prop="telemetrydtfInfo">
              <Input v-model="formItemYc.telemetrydtfInfo" placeholder="请输入遥测测点信息" />
            </FormItem>
            <FormItem label="顺序" prop="telemetrydtfOrder">
              <Input v-model="formItemYc.telemetrydtfOrder" placeholder="请输入顺序" />
            </FormItem>
            <Input v-model="formItemYc.id" v-show="false"></Input>
          </Col>
          <Col span="12">
            <FormItem label="需求电站编号" prop="telemetrydtfUStationNumber">
                <Select v-model="formItemYc.telemetrydtfUStationNumber">
                  <Option :value="item.id" v-for="item in []" :key="item.id">{{item.name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="需求设备编号" prop="telemetrydtfUDeviceNumber">
                <Select v-model="formItemYc.telemetrydtfUDeviceNumber">
                  <Option :value="item.id" v-for="item in []" :key="item.id">{{item.name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="需求点号" prop="telemetrydtfUNumber">
                <Input v-model="formItemYc.telemetrydtfUNumber" placeholder="请输入需求点号" />
              </FormItem>
              <FormItem label="需求测点名称" prop="telemetrydtfUName">
                <Select v-model="formItemYc.telemetrydtfUName">
                  <Option :value="item.id" v-for="item in []" :key="item.id">{{item.name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="集团标识" prop="telemetrydtfUFlog">
                <Input v-model="formItemYc.telemetrydtfInfo" placeholder="请输入集团标识" />
              </FormItem>
          </Col>
         </Form>
        </Row>
    </Modal>
  </div>
</template>
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
<script>
import Tables from '_c/tables'
export default {
  name: 'pointConf',
  components: {
    Tables
  },
  data () {
    return {
      // 遥测
      currentYc: 1,
      sizeYc: 10,
      countYc: 0,
      tableDataYc: [],
      selectedRowYc: null,
      queryYc: {
        telemetrydtfStationNumber: '',
        telemetrydtfDeviceNumber: '',
        telemetrydtfNumber: '',
        telemetrydtfName: '',
        telemetrydtfUStationNumber: '',
        telemetrydtfUDeviceNumber: '',
        telemetrydtfUNumber: '',
        telemetrydtfUName: ''
      },
      formItemYc: {
        telemetrydtfStationNumber: '',
        telemetrydtfDeviceNumber: '',
        telemetrydtfNumber: '',
        telemetrydtfName: '',
        telemetrydtfInfo: '',
        telemetrydtfOrder: '',
        telemetrydtfUStationNumber: '',
        telemetrydtfUDeviceNumber: '',
        telemetrydtfUNumber: '',
        telemetrydtfUName: '',
        telemetrydtfUFlog: ''
      },
      modalYc: {
        isShow: false,
        isEdit: false
      },
      columnsYc: [{
        title: '序号',
        type: 'index',
        width: 100,
        align: 'center'
      }, {
        title: '电站编号',
        align: 'center',
        width: 100,
        key: 'telemetrydtfStationNumber',
        sortable: false
      }, {
        title: '设备编号',
        align: 'center',
        width: 100,
        key: 'telemetrydtfDeviceNumber',
        sortable: false
      }, {
        title: '遥测点码编号',
        align: 'center',
        width: 120,
        key: 'telemetrydtfNumber',
        sortable: false
      }, {
        title: '遥测测点名称',
        align: 'center',
        width: 120,
        key: 'telemetrydtfName',
        sortable: false
      }, {
        title: '遥测测点信息',
        align: 'center',
        width: 120,
        key: 'telemetrydtfInfo',
        sortable: false
      }, {
        title: '顺序',
        align: 'center',
        width: 100,
        key: 'telemetrydtfOrder',
        sortable: false
      }, {
        title: '需求电站编号',
        align: 'center',
        width: 120,
        key: 'telemetrydtfUStationNumber',
        sortable: false
      }, {
        title: '需求设备编号',
        align: 'center',
        width: 120,
        key: 'telemetrydtfUDeviceNumber'
      }, {
        title: '需求点号',
        align: 'center',
        width: 100,
        key: 'telemetrydtfUNumber'
      }, {
        title: '需求点号名称',
        align: 'center',
        width: 120,
        key: 'telemetrydtfUName'
      }, {
        title: '集团标识',
        align: 'center',
        width: 100,
        key: 'telemetrydtfUFlog'
      }],
      ruleValidateYc: {

      }
    }
  },
  methods: {
    pageChangedYc (page) {
      this.currentYc = page
      this.getData()
    },
    pageSizeChangedYc (pageSize) {
      this.sizeYc = pageSize
      this.getData()
    },
    onDetailYc (params) {
      this.modalYc.isShow = true
      this.formItemYc = this.$lodash.assign({}, params.row)
    },
    selectChangeYc (val) {
      this.selectedRowYc = val
    },
    searchYc () {
      this.getDataYc()
    },
    addConfYc () {
      this.$refs['formValidateYc'].resetFields()
      this.modalYc.isShow = true
      this.modalYc.isEdit = false
    },
    editYc () {
      if (!this.selectedRowYc) {
        this.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行操作'
        })
      } else {
        this.formItemyc = this.$lodash.assign({}, this.selectedRowyc)
        this.modalYc.isShow = true
        this.modalYc.isEdit = true
      }
    },
    onDeleteYc (params) {
      const that = this
      if (!that.selectedRowYc) {
        that.$Notice.error({
          title: '提示',
          desc: '请单击某行数据进行操作'
        })
      } else {
        that.$Modal.confirm({
          title: '提示',
          content: '是否确认删除？',
          onOk () {
            that.$Notice.success({
              title: '提醒',
              desc: res.data.msg
            })
          }
        })
      }
    },
    getDgetDataYcata () {
      this.queryYc.current = this.currentYc
      this.queryYc.size = this.sizeYc
    }
  },
  computed: {
    // 遥测
    datasYc: {
      get () {
        return this.tableDataYc
      },
      set (val) { }
    },
    totalYc: {
      get () {
        return this.countYc
      },
      set (val) { }
    }
  }
}
</script>
