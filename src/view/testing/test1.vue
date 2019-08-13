<template>
  <div>
    <h1>{{helloMsg}}</h1>
    <test type="man"></test>
    <Button v-hasPermission="'test_add2222'">新增</Button>
    <Button v-hasPermission="'test_update'">修改</Button>
    <Button v-hasPermission="'test_delete'">删除</Button>
    <Button v-hasPermission="'doc_add'">文档新增</Button>
  </div>
</template>

<script>
import Test from '_c/test'
export default {
  name: 'test22',
  components: {
    Test
  },
  data () {
    return {
      tp: 'man',
      helloMsg: '测试1'
    }
  },
  methods: {

  }
}
</script>
