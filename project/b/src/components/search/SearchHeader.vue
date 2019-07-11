<template>
  <div :class="{fullHeight: isFocused}">
    <form class="search-form-box flex search-page" @submit.prevent="searchHandler">
      <a class="return cell_0" id="searchBackBtn" href="javascript:void(0)" @click="backUrl"></a>
      <div class="search-form-input cell_1">
        <span class="search-form-icon"></span>
        <input ref="searchInputEl" type="text" @click="onFocusHandler" autofocus="autofocus" v-model="searchInputVal" id="jsSearch" :placeholder="placeholder" class="index_newkeyword" autocomplete="off" >
        <i class="clearinput-btn" v-show="isFocused && searchInputVal" @click="clearInput"></i>
      </div>
      <a class="btn_sousuo cell_0" id="searchBtn" href="javascript:;" @click="searchHandler($event)">搜索</a>
    </form>
    <SearchAutoComplete class="without-search-box" @searchStart="startSearch" :searchInput="searchInputVal" v-if="isFocused && searchInputVal" />
    <div v-if="!searchInputVal && isFocused" class="without-search-box">
      <HistorySearch @searchStart="startSearch" class="history-search-wrap" />
      <HotSearch @setDefaultSearch="dw => searchPlaceholder = dw" @searchStart="startSearch" />
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  data () {
    return {
      isFocused: false,
      searchInputVal: '',
      autoCompleteList: [],
      showWordList: false,
      hasContent: false,
      defaultPlaceholder: '请输入关键字搜索',
      searchPlaceholder: ''
    }
  },
  activated () {
    if (this.$store.state.route.from.name == 'Index') {
      this.isFocused = true
      this.searchInputVal = ''
    }
  },
  computed: {
    placeholder () {
      return this.isFocused && this.searchPlaceholder ? this.searchPlaceholder : this.defaultPlaceholder
    }
  },
  created () {
    const from = this.$store.state.route.from.name
    if (from == 'Detail') {
      this.searchInputVal = window.sessionStorage.getItem('searchInputVal')
    }
  },
  mounted () {
    if (!this.$store.state.route.query.categoryType && !this.searchInputVal) {
      let searchInputEl = this.$refs.searchInputEl
      searchInputEl && searchInputEl.focus()
      this.isFocused = true
    } else {
      this.hasContent = true
    }
  },
  // beforeDestroy () {
  //   if (this.searchInputVal) {
  //     window.sessionStorage.setItem('searchInputVal', this.searchInputVal)
  //   }
  // },
  methods: {
    clearInput () {
      this.searchInputVal = ''
      this.$refs.searchInputEl.focus()
    },
    onFocusHandler: function (e) {
      // this.$router.push('/search')
      e.target.focus()
      this.isFocused = true
      if (!this.searchInputVal) {
        this.$parent.$emit('goBlankSearch')
      }
    },
    backUrl () {
      if (this.isFocused && this.hasContent) {
        this.isFocused = false
      } else {
        window.history.go(-1)
      }
    },
    searchHandler (e) {
      let keyword = this.searchInputVal || (this.searchPlaceholder == '请输入关键字搜索' ? '' : this.searchPlaceholder)
      keyword = keyword.trim()
      if (keyword) {
        this.$refs.searchInputEl.blur()
        this.startSearch(keyword)
      } else {
        this.showToast({ msg: '请输入搜索内容' })
      }
    },
    startSearch (keyword, deleteIndex) {
      this.isFocused = false
      this.hasContent = true
      this.searchInputVal = keyword
      this.$emit('searchInputVal', keyword)
      this.$parent.$emit('searchStart', keyword, deleteIndex)
    }
  },
  watch: {
    isFocused: {
      handler (val) {
        this.$emit('toggleInputFocus', val)
      }
    }
  },
  components: {
    'HotSearch': resolve => { require(['./HotSearch'], resolve) },
    'HistorySearch': resolve => { require(['./HistorySearch'], resolve) },
    'SearchAutoComplete': resolve => { require(['./SearchAutoComplete'], resolve) }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/app";
@import "../../assets/scss/flex";
// .fullHeight {
//   height: 100%;
// }
.search-form-box.search-page {
  @include px2rem(height, 98);
}
.without-search-box {
  // flex: 1;
  height: calc(100vh - 1.36rem);
  overflow-y: auto;
  &.flexWrap {
    @include display-flex;
    @include flex-direction-column;
  }
}
.scolly-view {
  -webkit-overflow-scrolling : touch;
}
.history-search-wrap {
  //@include flex(1);
}
::-webkit-input-placeholder { /* WebKit browsers */
  color:#DADADA;
}
.btn_sousuo {
  @include font-dpr(28);
  color: $color333;
}
.search-form-input {
  @include px2rem(margin-top,10);
  .clearinput-btn {
    @include px2rem(right, 0);
    @include px2rem(width, 66);
    background: url(../../assets/icon/icon/guanbi.png) no-repeat 50% 50%/.32rem;
  }
}
// @import '../../assets/icon/icon/guanbi.png';
</style>
