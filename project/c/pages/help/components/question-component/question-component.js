Component({
  properties: {
    // 定义分享数据，接收传递过来的参数
    questionDetail: {
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型)
      value: {
        title: 'haha'
      }, // 属性初始值（可选），如果未指定则会根据类型选择一个
    }
  },
  attach: {

  },
  data: {
    // 这里是一些组件内部数据
  },
  methods: {
    // 这里是一个自定义方法
  }
})