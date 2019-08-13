<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="passWord">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal v-model="passWordModal.isShow" title="修改密码">
      <div slot="footer">
        <Button type="warning" size="small" @click="cancelEditPass('formValidate')">取消</Button>
        <Button type="primary" size="small" @click="saveEditPass('formValidate')">提交</Button>
      </div>
      <Form :model="formItem" :label-width="80" :rules="ruleValidate" ref="formValidate">
        <FormItem label="原始密码" prop="oldPassword">
          <Input v-model="formItem.oldPassword" type="password"></Input>
        </FormItem>
        <FormItem label="新密码" prop="newPassword" >
          <Input v-model="formItem.newPassword" type="password"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="rePass">
          <Input v-model="formItem.rePass" type="password"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  data () {
    const valideRePassword = (rule, value, callback) => {
      if (!value || !value.trim()) {
        callback(new Error('请输入确认密码'))
        return
      }
      if (value !== this.formItem.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      passWordModal: {
        isShow: false
      },
      formItem: {
        oldPassword: '',
        newPassword: '',
        rePass: ''
      },
      ruleValidate: {
        oldPassword: [{
          required: true, message: '请输入原始密码', trigger: 'change', type: 'string'
        }],
        newPassword: [{
          required: true, message: '请输入新密码', trigger: 'change', type: 'string'
        }],
        rePass: [{ validator: valideRePassword, trigger: 'change' }]
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut',
      'updatePassWord'
    ]),
    handleClick (name) {
      const _this = this
      if (name === 'logout') {
        this.handleLogOut().then(() => {
          // window.location = '/pages/exam/admin/login'
          _this.$router.push({
            name: 'login'
          })
        })
      } else if (name === 'message') {
        window.open('/mercurius')
        // console.log('这里需要跳转到消息页面')
      } else {
        this.$refs['formValidate'].resetFields()
        this.passWordModal.isShow = true
      }
    },
    cancelEditPass (name) {
      this.passWordModal.isShow = false
    },
    saveEditPass (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const admin = JSON.parse(localStorage.userInfo)
          this.formItem.userId = admin.id
          this.updatePassWord(this.formItem).then(res => {
            if (res.data.code === 'success') {
              this.$Notice.success({
                title: '提醒',
                desc: res.data.msg
              })
              this.passWordModal.isShow = false
            } else {
              this.$Notice.error({
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
  created () {
    const user = JSON.parse(localStorage.getItem('userInfo'))
    console.log('user.vue中user===', user)
    this.userInfo = user
  }
}
</script>
