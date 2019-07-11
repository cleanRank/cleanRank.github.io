<template>
  <div class="history_search_list_autocomplete">
    <div class="history_search_item_autocomplete" v-for="(item, index) in autoCompleteList" :key="searchInput + index" @click="searchHandler(item, $event)">{{item}}</div>
  </div>
</template>

<script>
export default {
  props: {
    searchInput: {
      required: true,
      type: String,
      default: 'history'
    }
  },
  data () {
    return {
      autoCompleteList: []
    }
  },
  created () {
    this.searchInput && this.fetchAutoList(this.searchInput)
  },
  methods: {
    searchHandler (keyword, e) {
      this.$emit('searchStart', keyword)
    },
    fetchAutoList (searchword) {
      if (!searchword.trim()) {
        this.autoCompleteList = []
        return Promise.resolve()
      }
      this.$post({
        url: this.$store.state.api.AutomaticCompletion,
        data: {
          searchword
        }
      }).then(data => {
        let res = data.data
        if (res.status === "1") {
          this.$set(this.$data, 'autoCompleteList', res.data)
        }
      })
    }
  },
  watch: {
    searchInput: {
      handler (val) {
        this.fetchAutoList(val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/app";
.history_search_list_autocomplete {
  border-top: 1px solid $borderColor;
  background: #fff;
}
.history_search_item_autocomplete {
  @include px2rem(height, 80);
  @include px2rem(line-height, 80);
  border-bottom: 1px solid $borderColor;
  @include px2rem(padding-left, 28);
  @include font-dpr(26);
  color: #666666;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>

