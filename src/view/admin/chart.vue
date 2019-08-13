<template>
  <div>
    <Card>
    <v-chart :options="option"/>
    </Card>
  </div>
</template>
<script>
export default {
  name: 'Chart',
  data () {
    return {
    }
  },
  methods: {

  },
  created () {
    console.log('this.$store.state.app.echartsDatas', this.$store.state.app.echartsDatas)
  },
  computed: {
    option () {
      const date = []
      for (let index = 1; index <= 31; index++) {
        date.push(index + '日')
      }
      return {
        title: {
          text: 'websocket实时动态数据展示'
        },
        xAxis: {
          type: 'category',
          data: date
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          show: true
        },
        series: [{
          data: this.$store.state.app.echartsDatas,
          type: 'line',
          smooth: true
        }]
      }
    }
  }
}
</script>
