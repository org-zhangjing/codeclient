<template>
  <div>
    <Card>
    <p slot="title">授权管理</p>
    <Row>
      <Col span="24">
       <Tabs value="name1" type="card">
        <TabPane label="机构授权" name="name1">
          <Card>
            <p slot="title">机构授权</p>
          <Row>
            <Col span="10" style="height:600px;overflow-y:scroll;overflow-x:hidden;">
             <Tree :data="treeData" @on-select-change="select"></Tree>
            </Col>
            <Col span="1">
              <Divider type="vertical" style="height:300px;"/>
            </Col>
            <Col span="13">
             <Row>
               <Col span="6">
                <h3>已授权角色</h3>
                <Checkbox
                label="item.roleName"
                class="checkbox-line"
                v-bind:key="item.rolrId"
                v-for="item in authedRolesOrg"
                v-model="item.checked"
                v-if="authedRolesOrg.length > 0">
                {{item.roleName}}</Checkbox>
               </Col>
               <Col span="1">
                 <Divider type="vertical" style="height:300px;"/>
               </Col>
               <Col span="3">
               <!-- <Row>
                 <Button type="warning"  style="width: 80px;">全 选</Button>
               </Row>
               <Row>
                 <Button type="info"  style="width: 80px;">取消选中</Button>
               </Row> -->
               <Row>
                 <Button type="info" @click="confirmOrgAuth" v-hasPermission="'condition_save_org'" style="width: 90px; margin-top: 200px">确认授权</Button>
               </Row>
               </Col>
               <Col span="1">
                 <Divider type="vertical" style="height:300px;"/>
               </Col>
               <Col span="5">
               <h3>全部角色</h3>
               <Checkbox
                  label="item.roleName"
                  class="checkbox-line"
                  v-bind:key="item.id"
                  v-model="item.checked"
                  v-for="(item, index) in allRolesEmp"
                  v-if="allRolesEmp.length > 0"
                  @on-change="roleChangeEmp(item, index)"
               >{{item.roleName}}</Checkbox>
               </Col>
             </Row>
            </COl>
          </Row>
          </Card>
        </TabPane>
        <TabPane label="岗位授权" name="name2">
          <Card>
            <p slot="title">岗位授权</p>
          <Row class="tab">
            <Col span="10">
              <Form inline style="margin-bottom:-10px;">
                <FormItem label="岗位名称" :label-width="80">
                  <Input v-model="positionQuery.posiName" placeholder="请输入岗位名称" />
                </FormItem>
                <FormItem>
                  <Button type="info" @click="searchPosition" class="btns">查询</Button>
                </FormItem>
              </Form>
              <tables
                highlight-row
                @on-current-change="onChangeTable"
                ref="tables"
                search-place="top"
                v-model="datas"
                :columns="columns"
              />
              <Page
                class="mgT10 fright"
                size="small"
                :current="page"
                :page-size="pageSize"
                :page-size-opts="[10, 20, 50]"
                :total="total"
                show-sizer
                show-total
                @on-change="pageChanged"
                @on-page-size-change="pageSizeChanged"
              ></Page>
            </Col>
            <Col span="1">
              <Divider type="vertical" style="height:300px;"/>
            </Col>
            <Col span="13">
             <Row>
               <Col span="6">
                <h3>已授权角色</h3>
                <Checkbox
                label="item.roleName"
                class="checkbox-line"
                v-bind:key="item.id"
                v-for="item in authedRolesPostion"
                v-model="item.checked"
                v-if="authedRolesPostion.length > 0">
                {{item.roleName}}</Checkbox>
               </Col>
               <Col span="1">
                 <Divider type="vertical" style="height:300px;"/>
               </Col>
               <Col span="3">
               <!-- <Row>
                 <Button type="warning"  style="width: 80px;">全 选</Button>
               </Row>
               <Row>
                 <Button type="info"  style="width: 80px;">取消选中</Button>
               </Row> -->
               <Row>
                 <Button type="info" @click="confirmPositionAuth" v-hasPermission="'condition_save_position'" style="width: 90px; margin-top: 200px">确认授权</Button>
               </Row>
               </Col>
               <Col span="1">
                 <Divider type="vertical" style="height:300px;"/>
               </Col>
               <Col span="5">
               <h3>全部角色</h3>
               <Checkbox
                  label="item.roleName"
                  class="checkbox-line"
                  v-bind:key="item.id"
                  v-model="item.checked"
                  v-for="(item, index) in allRolesEmpPostion"
                  v-if="allRolesEmpPostion.length > 0"
                  @on-change="roleChangeEmpPostion(item, index)"
               >{{item.roleName}}</Checkbox>
               </Col>
             </Row>
            </Col>
          </Row>
          </Card>
        </TabPane>
        <TabPane label="员工授权" name="name3">
          <Card>
            <p slot="title">员工授权</p>
           <Row class="tab">
             <Col span="10">
              <Form inline style="margin-bottom:-10px;">
                <FormItem label="员工名" :label-width="80">
                  <Input v-model="empQuery.name" placeholder="请输入员工名称" />
                </FormItem>
                <FormItem>
                  <Button type="info" @click="searchEmp" class="btns">查询</Button>
                </FormItem>
              </Form>
              <tables
                highlight-row
                @on-current-change="onChangeStaffTable"
                ref="tables"
                search-place="top"
                v-model="datasStaff"
                :columns="columnsStaff"
              />
              <Page
                class="mgT10 fright"
                size="small"
                :current="pageStaff"
                :page-size="pageSizeStaff"
                :page-size-opts="[10, 20, 50]"
                :total="totalStaff"
                show-sizer
                show-total
                @on-change="pageChangedStaff"
                @on-page-size-change="pageSizeChangedStaff"
              ></Page>
            </Col>
            <Col span="1">
              <Divider type="vertical" style="height:300px;"/>
            </Col>
            <Col span="13">
            <Row>
              <Col span="6">
                <h3>已授权角色</h3>
                <Checkbox
                label="item.roleName"
                class="checkbox-line"
                v-bind:key="item.id"
                v-for="item in authedRolesStaff"
                v-model="item.checked"
                v-if="authedRolesStaff.length > 0">
                {{item.roleName}}</Checkbox>
               </Col>
               <Col span="1">
                 <Divider type="vertical" style="height:300px;"/>
               </Col>
               <Col span="3">
               <!-- <Row>
                 <Button type="warning"  style="width: 80px;">全 选</Button>
               </Row>
               <Row>
                 <Button type="info"  style="width: 80px;">取消选中</Button>
               </Row> -->
               <Row>
                 <Button type="info" @click="confirmStaffAuth" v-hasPermission="'condition_save_emp'" style="width: 90px; margin-top: 200px">确认授权</Button>
               </Row>
               </Col>
               <Col span="1">
                 <Divider type="vertical" style="height:300px;"/>
               </Col>
               <Col span="5">
               <h3>全部角色</h3>
               <Checkbox
                  label="item.roleName"
                  class="checkbox-line"
                  v-bind:key="item.id"
                  v-model="item.checked"
                  v-for="(item, index) in allRolesEmpStaff"
                  v-if="allRolesEmpStaff.length > 0"
                  @on-change="roleChangeEmpStaff(item, index)"
               >{{item.roleName}}</Checkbox>
               </Col>
            </Row>
            </Col>
           </Row>
           </Card>
        </TabPane>
       </Tabs>
      </Col>
    </Row>
    </Card>
  </div>
</template>

<script>
import { getTree } from '@/libs/tree'
import Tables from '_c/tables'
import { mapActions } from 'vuex'
export default {
  name: 'org',
  components: {
    Tables
  },
  data () {
    return {
      treeDatas: [],
      allRoles: [],
      positionQuery: {
        posiName: ''
      },
      empQuery: {
        name: ''
      },
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 100,
          align: 'center'
        },
        {
          title: '岗位名称',
          align: 'center',
          key: 'posiName',
          height: 10,
          sortable: false
        }
      ],
      columnsStaff: [{
        title: '序号',
        align: 'center',
        width: 100,
        type: 'index'
      },
      {
        title: '员工名',
        align: 'center',
        key: 'name',
        sortable: false
      }],
      allRolesEmp: [],
      authedRolesStaff: [],
      allRolesEmpPostion: [],
      allRolesEmpStaff: [],
      authedRolesOrg: [],
      authedRolesPostion: [],
      selectedOrg: {}, // 当前选中的机构
      selectPosition: {}, // 当前选择的岗位
      tableData: [], // 所有岗位
      tableDataStaff: [], // 所有员工
      query: {},
      queryStaff: {},
      current: 1,
      page: 1,
      pageSize: 10,
      pageStaff: 1,
      pageSizeStaff: 10,
      count: 0,
      countStaff: 0,
      orgTreeData: {
        // title: '机构',
        // expand: true,
        children: []
      },
      staff: {}
    }
  },
  methods: {
    ...mapActions([
      'getOrgsList', // 所有机构树
      'getRolesList', // 所有角色
      'orgRoles', // 根据机构id找以授权角色
      'orgAuth', // 机构确认授权
      'getPosiList', // 所有岗位
      'getAllAdmin' // 所有员工
    ]),
    // 所有机构
    getData () {
      this.getOrgsList().then(res => {
        const records = res.data.data.children
        this.treeDatas = getTree(records)
      }).catch(err => {
        console.error(err)
      })
    },
    searchPosition () {
      this.getPosition(this.positionQuery)
    },
    searchEmp () {
      this.getAllStaff(this.empQuery)
    },
    // 所有岗位
    getPosition (query) {
      this.getPosiList(Object.assign({}, this.query, query)).then(res => {
        const { records, total } = res.data.data
        this.tableData = records || []
        this.count = total
      }).catch(err => {
        console.error(err)
      })
    },
    // 所有员工
    getAllStaff (query) {
      this.getAllAdmin(Object.assign({}, query, this.queryStaff)).then(res => {
        const { records, total } = res.data.data
        this.tableDataStaff = records || []
        this.countStaff = total
      }).catch(err => {
        console.error(err)
      })
    },
    // 选择机构树
    select (value) {
      this.selectedOrg = this.$lodash.cloneDeep(value[0])
      // 查询当前机构已授权的角色
      this.getOrgRoles(this.selectedOrg.attr.id)
    },
    getPostionRoles (positionId) {
      const postion = {
        id: positionId,
        partyType: 'position'
      }
      this.orgRoles(postion).then(res => {
        if (res.data.data !== null) {
          this.authedRolesPostion = res.data.data.map(item => {
            item.checked = true
            return item
          })
          const authedPositionIds = this.authedRolesPostion.map(item => item.roleId) || []
          // 修改全部角色选中
          this.allRolesEmpPostion.forEach((item, index) => {
            if (authedPositionIds.indexOf(item.id) !== -1) {
              this.allRolesEmpPostion[index].checked = true
            } else {
              this.allRolesEmpPostion[index].checked = false
            }
          })
        }
      })
    },
    // 查询当前机构授权的角色
    getOrgRoles (orgId) {
      const org = {
        id: orgId,
        partyType: 'org'
      }
      this.orgRoles(org).then(res => {
        if (res.data.data !== null) {
          this.authedRolesOrg = res.data.data.map(item => {
            item.checked = true
            return item
          })
          const authedRolesIds = this.$lodash.map(this.authedRolesOrg, 'roleId') || []
          // 修改全部角色选中
          this.allRolesEmp.forEach((item, index) => {
            if (authedRolesIds.indexOf(item.id) !== -1) {
              this.allRolesEmp[index].checked = true
            } else {
              this.allRolesEmp[index].checked = false
            }
          })
        }
      })
    },
    // 所有角色
    getRoles () {
      this.getRolesList().then(res => {
        this.allRoles = res.data.data.records.map(item => {
          item.checked = false
          return item
        })
        this.allRolesEmp = this.$lodash.cloneDeep(this.allRoles)
        this.allRolesEmpStaff = this.$lodash.cloneDeep(this.allRoles)
        this.allRolesEmpPostion = this.$lodash.cloneDeep(this.allRoles)
      }).catch(err => {
        console.error(err)
      })
    },
    // 机构角色选择change时触发
    roleChangeEmp (val, index) {
      // 先清空已选择的角色
      this.authedRolesOrg = []
      this.allRolesEmp.forEach(item => {
        item.checked && (this.authedRolesOrg.push(item))
      })
    },
    // 岗位角色选择change时触发
    roleChangeEmpPostion (val, index) {
      // 先清空已选择的角色
      this.authedRolesPostion = []
      this.allRolesEmpPostion.forEach(item => {
        item.checked && (this.authedRolesPostion.push(item))
      })
    },
    roleChangeEmpStaff (val, index) {
      // 先清空已选择的角色
      this.authedRolesStaff = []
      this.allRolesEmpStaff.forEach(item => {
        item.checked && (this.authedRolesStaff.push(item))
      })
    },
    // 机构确认授权
    confirmOrgAuth () {
      if (this.selectedOrg.attr && this.selectedOrg.attr.id) {
        const that = this
        that.$Modal.confirm({
          title: '提示',
          content: `确认为 ${that.selectedOrg.attr.orgName} 授权?`,
          onOk () {
            // 调用权限设置接口
            const authedRolesOrg = []
            that.authedRolesOrg.forEach(item => {
              if (item.checked) {
                authedRolesOrg.push(item.id)
              }
            })
            that.orgAuth({
              id: that.selectedOrg.attr.id,
              roleIds: authedRolesOrg,
              partyType: 'org'
            }).then(res => {
              if (!res.data.error) {
                this.$Notice.success({
                  title: '提示',
                  desc: '授权成功'
                })
              } else {
                this.$Notice.error({
                  title: '提示',
                  desc: res.data.error
                })
              }
            }).catch(err => {
              console.error(err)
            })
          }
        })
      } else {
        this.$Notice.error({
          title: '提示',
          desc: '请先选择要操作的机构'
        })
      }
    },
    // 选择岗位
    onChangeTable (val) {
      this.selectPosition = val
      // 根据岗位查已授权角色
      this.getPostionRoles(this.selectPosition.id)
    },
    // 岗位授权
    confirmPositionAuth () {
      if (this.selectPosition && this.selectPosition.id) {
        const that = this
        that.$Modal.confirm({
          title: '提示',
          content: `确认为 ${that.selectPosition.posiName} 授权?`,
          onOk () {
            // 调用权限设置接口
            const authedRolesPostion = []
            that.authedRolesPostion.forEach(item => {
              if (item.checked) {
                authedRolesPostion.push(item.id)
              }
            })
            that.orgAuth({
              id: that.selectPosition.id,
              roleIds: authedRolesPostion,
              partyType: 'position'
            }).then(res => {
              if (!res.data.error) {
                this.$Notice.success({
                  title: '提示',
                  desc: '授权成功'
                })
              } else {
                this.$Notice.error({
                  title: '提示',
                  desc: res.data.error
                })
              }
            }).catch(err => {
              console.error(err)
            })
          }
        })
      } else {
        this.$Notice.error({
          title: '提示',
          desc: '请先选择要操作岗位'
        })
      }
    },
    pageChanged (page) {
      this.page = page
      this.query.current = this.page
      this.getPosition()
    },
    pageSizeChanged (pageSize) {
      this.pageSize = pageSize
      this.query.size = this.pageSize
      this.getPosition()
    },
    pageChangedStaff (page) {
      this.pageStaff = page
      this.queryStaff.current = this.pageStaff
      this.getAllStaff(this.queryStaff)
    },
    pageSizeChangedStaff (pageSize) {
      this.pageSizeStaff = pageSize
      this.queryStaff.size = this.pageSizeStaff
      this.getAllStaff(this.queryStaff)
    },
    // 选择员工
    onChangeStaffTable (val) {
      this.staff = val
      this.getStaff(this.staff.id)
    },
    getStaff (staff) {
      const emp = {
        id: staff,
        partyType: 'emp'
      }
      this.orgRoles(emp).then(res => {
        if (res.data.data !== null) {
          this.authedRolesStaff = res.data.data.map(item => {
            item.checked = true
            return item
          })
          // roleId
          const authedRolesIds = this.authedRolesStaff.map(item => item.roleId) || []
          // 修改全部角色选中
          this.allRolesEmpStaff.forEach((item, index) => {
            if (authedRolesIds.indexOf(item.id) !== -1) {
              this.allRolesEmpStaff[index].checked = true
            } else {
              this.allRolesEmpStaff[index].checked = false
            }
          })
        }
      })
    },
    // 员工授权
    confirmStaffAuth () {
      if (this.staff && this.staff.id) {
        const that = this
        that.$Modal.confirm({
          title: '提示',
          content: `确认为 ${that.staff.name} 授权?`,
          onOk () {
            // 调用权限设置接口
            const authedRolesStaff = []
            that.authedRolesStaff.forEach(item => {
              if (item.checked) {
                authedRolesStaff.push(item.id)
              }
            })
            that.orgAuth({
              id: that.staff.id,
              roleIds: authedRolesStaff,
              partyType: 'emp'
            }).then(res => {
              if (!res.data.error) {
                this.$Notice.success({
                  title: '提示',
                  desc: '授权成功'
                })
              } else {
                this.$Notice.error({
                  title: '提示',
                  desc: res.data.error
                })
              }
            }).catch(err => {
              console.error(err)
            })
          }
        })
      } else {
        this.$Notice.error({
          title: '提示',
          desc: '请先选择要操作员工'
        })
      }
    }
  },
  computed: {
    datas: {
      get () {
        return this.tableData
      },
      set (val) {}
    },
    total: {
      get () {
        return this.count
      },
      set (val) { }
    },
    treeData: {
      get () {
        return [Object.assign(this.orgTreeData, {
          children: this.treeDatas
        })]
      },
      set () {}
    },
    datasStaff: {
      get () {
        return this.tableDataStaff
      },
      set (val) {}
    },
    totalStaff: {
      get () {
        return this.countStaff
      },
      set (val) { }
    }
  },
  created () {
    this.getData() // 机构
    this.getPosition() // 所有岗位
    this.getAllStaff() // 所有员工
    this.getRoles() // 所有角色
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
.checkbox-line {
  display: block;
  margin: 10px 0 0 10px;
}
.fright{
  float: right;
}
.mgT10{
  margin-top: 10px;
}
</style>
