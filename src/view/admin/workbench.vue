<template>
  <div class="main">
    <Card>
    <Row :gutter="20">
      <div @click="showModal" style="cursor:pointer;">
        <i-col :xs="12" :md="8" :lg="4" style="height: 120px;padding-bottom: 10px;" >
          <infor-card shadow :color="'#ff9900'" :icon-size="36" icon="ios-build-outline">
            <p style="font-size:18px">编辑工作台</p>
          </infor-card>
        </i-col>
      </div>
      <div v-for="(infor, i) in inforCardData" style="cursor:pointer;" :key="`infor-${i}`"  @click="$router.push({name: infor.menuCode})">
        <i-col :xs="12" :md="8" :lg="4"  style="height: 120px;padding-bottom: 10px;">
          <infor-card shadow :color="i%2 === 0?'#19be6b':'#2d8cf0'" :icon="infor.menuIcon" :icon-size="36">
            <p style="font-size:18px">{{ infor.menuLabel}}</p>
          </infor-card>
        </i-col>
      </div>
    </Row>
    <Modal
      v-model="workbenchModal.isShow"
      title="编辑工作台">
      <div>
        <Tree :data="treeData" ref="tree" multiple show-checkbox></Tree>
      </div>
      <div slot="footer">
        <Button type="warning" @click="workbenchModalCancel">取消</Button>
        <Button type="primary" @click="workbenchModalOk">提交</Button>
      </div>
    </Modal>
    </Card>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { getTree1 } from '@/libs/tree'
import { mapActions } from 'vuex'
import { ChartPie, ChartBar } from '_c/charts'
import { listUserMenus } from '@/api/user'
// import { constants } from 'fs'
export default {
  name: 'workbench',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar
  },
  data () {
    return {
      inforCardData: [],
      workbenchModal: {
        isShow: false
      },
      treeDatas: [],
      menuTreeData: {
        title: '菜单管理',
        expand: true,
        render: (h, { root, node, data }) => {
          return h(
            'span',
            {
              style: {
                display: 'inline-block',
                width: '100%'
              }
            },
            [
              h('span', [
                h('Icon', {
                  props: {
                    // type: 'ios-folder-outline'
                    type: 'ios-paper-outline'
                  },
                  style: {
                    marginRight: '8px'
                  }
                }),
                h('span', data.title)
              ]),
              h(
                'span',
                {
                  style: {
                    display: 'inline-block',
                    float: 'right',
                    marginRight: '32px'
                  }
                }
              )
            ]
          )
        },
        children: []
      }
      // inforCardData: [
      //   { title: '新增用户', icon: 'md-person-add', count: 803, color: '#2d8cf0' },
      //   { title: '累计点击', icon: 'md-locate', count: 232, color: '#19be6b' },
      //   { title: '新增问答', icon: 'md-help-circle', count: 142, color: '#ff9900' },
      //   { title: '分享统计', icon: 'md-share', count: 657, color: '#ed3f14' },
      //   { title: '新增互动', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
      //   { title: '新增页面', icon: 'md-map', count: 14, color: '#9A66E4' }
      // ]
    }
  },
  methods: {
    ...mapActions([
      'getWorkbenchList',
      'getRouters',
      'editSelfWorkbenchs'
    ]),
    // 查询列表
    getData () {
      this.getWorkbenchList().then(res => {
        // this.inforCardData = res.data.data
        this.inforCardData = []
        res.data.data.forEach(item => {
          if (item.component !== 'components/main' && item.component !== 'components/parent-view/parent-view.vue' && (!item.children || item.children.length === 0)) {
            this.inforCardData.push(item)
          }
        })
      }).then(() => {
        listUserMenus()
          .then(res => {
            let { data } = res
            data = data.data
            const menus = data.menu.children
            console.log('menus', menus)
            // const result = menu.children
            let saveMenuIds = []
            for (let i in this.inforCardData) {
              saveMenuIds.push(this.inforCardData[i].id)
            }
            this.treeDatas = getTree1(menus, saveMenuIds)
          })
          .catch(err => {
            console.error(err)
          })
      })
        .catch(err => {
          console.error(err)
        })
    },
    // getTree () {
    //   console.log('!!!!!!!!!!!!!!')
    //   this.getMenusList()
    //     .then(res => {
    //       const result = res.data.data.children
    //       this.treeDatas = getTree(result)
    //       console.log('this.inforCardData', this.inforCardData)
    //       this.treeDatas = getTree1(result, this.inforCardData)
    //     })
    //     .catch(err => {
    //       console.error(err)
    //     })
    // },
    showModal () {
      this.workbenchModal.isShow = true
    },
    workbenchModalOk () {
      const selectedMenus = this.$refs.tree.getCheckedNodes()
      const selectedMenuIds = selectedMenus.map(item => item.attr.id) || []
      const user = JSON.parse(localStorage.userInfo)
      const id = user.id
      const data = {
        'userId': id,
        'menuIds': selectedMenuIds
      }
      console.log('data', data)
      this.editSelfWorkbenchs(data).then(res => {
        this.workbenchModal.isShow = false
        this.getData()
      }).catch(err => {
        console.error(err)
      })
    },
    workbenchModalCancel () {
      this.workbenchModal.isShow = false
    }
  },
  mounted () {
    this.getData()
  },
  computed: {
    treeData: {
      get () {
        return [
          Object.assign(this.menuTreeData, {
            children: this.treeDatas
          })
        ]
      },
      set (val) { }
    }
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
