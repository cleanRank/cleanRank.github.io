<template>
<section>
  <div v-for="(item, i) in dataList" :key="i">
    <h6 class="help_title" :class="{'mt12':i==1}" v-if="item[0].title">{{item[0].title}}</h6>
    <ul class="help_list">
      <li v-for="(_item, index) in item" :key="_item.id" @click="bindClick(_item)" class="help_item">
        <span v-if="!_item.searchhelpPage && _item.status == 4">{{index+1}}.</span>
        <span v-html="_item.classifyName || _item.question"></span>
      </li>
    </ul>
  </div>
</section>
</template>
<script>
export default {
  data () {
    return {}
  },
  props: {
    dataList: {
      type: Object,
      required: true,
      default: {}
    }
  },
  methods: {
    bindClick (item) {
      this.$emit('isClick')
      // status [1表示没有二级分类，2表示有，3表示问题列表页，4表示跳转详情页]
      // 热门问题
      if (item.status == 4) {
        this.$router.push({
          path: 'helpDetail',
          query: {
            id: item.id
          }
        })
      } else {
        // 相关问题
        let titles = item.classifyName || item.question
        this.$router.push({
          path: 'helpLists',
          query: {
            status: item.status,
            classifyNo: item.classifyNo,
            titles: encodeURI(titles)
          }
        })
      }
    }
  }
}
</script>
