<template>
  <div class="common-search">
    <input type="text" name="search" v-bind:placeholder="search" v-model.trim="searchContent" @click="searchText">
  </div>
</template>
<script>
export default {
  data () {
    return {
      search: '',
      searchContent: window.sessionStorage.getItem('searchText') || ''
    }
  },
  mounted () {
    this.showLoad(false)
  },
  computed: {
  },
  methods: {
    searchText () {
      this.$router.push({path: '/search'})
    }
  }
}
</script>
