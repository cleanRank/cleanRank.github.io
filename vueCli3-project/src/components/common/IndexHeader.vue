<template>
  <header class="mainHeader flex">
    <span class="left_btn" @click="backUrl" v-if="!$store.state.route.meta.noLeft"></span>
    <div class="common-search">
      <input type="text" name="search" v-bind:placeholder="search" v-model.trim="searchContent" >
    </div>
    <div class="head-r-btn"  @click="triggerCallBack(searchContent)">搜索</div>
  </header>
</template>
<script>
import Searcher from 'components/common/Search'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      searchContent: '',
      search: '请输入ID进行搜索'
    }
  },
  components: {
    Searcher
  },
  computed: {
    ...mapGetters({
      headerBtn: "getheaderBtn"
    }),
    useLocation () {
      let name = this.$store.state.route.name
      return name == 'Index' || name == 'Home' || name == 'doctorlist'
    }
  },
  methods: {
    backUrl () {
      window.history.go(-1)
    },
    triggerCallBack (item) {
      this.$emit('searchItem', item)
    }
  }
}
</script>
