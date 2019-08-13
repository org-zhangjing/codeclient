export default [
  {
    path: '/config',
    menuCode: 'config',
    menuIcon: 'md-funnel',
    menuLabel: '配置管理',
    notCache: false,
    component: 'components/main',
    children: [
      {
        path: 'redisConf',
        menuCode: 'redisConf',
        menuIcon: 'md-funnel',
        menuLabel: 'Redis配置',
        notCache: false,
        component: 'view/conf/redis-conf.vue'
      },
      {
        path: 'kafkaConf',
        menuCode: 'kafkaConf',
        menuIcon: 'md-funnel',
        menuLabel: 'Kafka配置',
        notCache: false,
        component: 'view/conf/kafka-conf.vue'
      },
      {
        path: 'dataAssemblyConf',
        menuCode: 'dataAssemblyConf',
        menuIcon: 'md-funnel',
        menuLabel: '数据组装配置',
        notCache: false,
        component: 'view/conf/data-assembly-conf.vue'
      },
      {
        path: 'dataSendingConf',
        menuCode: 'dataSendingConf',
        menuIcon: 'md-funnel',
        menuLabel: '数据发送配置',
        notCache: false,
        component: 'view/conf/data-sending-conf.vue'
      },
      {
        path: 'taskManage',
        menuCode: 'taskManage',
        menuIcon: 'md-funnel',
        menuLabel: '任务管理',
        notCache: false,
        component: 'view/conf/task-manage.vue'
      }
    ]
  },
  {
    path: '/point',
    menuCode: 'point',
    menuIcon: 'md-funnel',
    menuLabel: '点表配置',
    notCache: false,
    component: 'components/main',
    children: [{
      path: 'pointConf',
      menuCode: 'pointConf',
      menuIcon: 'md-funnel',
      menuLabel: '点表配置',
      notCache: false,
      component: 'view/conf/point-conf.vue'
    }]
  }
]
