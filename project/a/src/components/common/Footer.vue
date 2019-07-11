<template>
  <footer class="site-footer">
    <ul class="flex">
      <router-link v-for="(item,index) in toLink" :key="index" :to="{path:item.path}" tag="li"  :class="{'active':$route.path.includes(item.class)}"><i></i><span>{{item.name}}</span></router-link>
    </ul>
  </footer>
</template>
<script>
export default {
  data () {
    return {
      toLink: [{
        name: '首页',
        path: '/index',
        class: '/index'
      }, {
        name: '我的',
        class: '/mine',
        path: '/mine'
      }]
    }
  },
  components: {
  },
  computed: {
  },
  methods: {}
}
</script>
