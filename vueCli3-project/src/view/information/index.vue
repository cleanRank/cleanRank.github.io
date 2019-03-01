<template lang="html">
  <div class="commodityList">
    <span v-if="goaddShow" class="goadd" @click="goAdd">添加商品</span>
    <ul class="commodityTab clearfix">
      <li v-for="(value, index) in tabObj.tablist"
        v-if="index > 0"
        :key="index"
        :class="[value.toggleTrue?'tab-active': '']"
        @click="toggleTab(value, index)">
        {{value.name}}
      </li>
    </ul>
    <commodity-list v-if="showType === 1" @change-list="ChangeList"></commodity-list>
    <Addimg v-if="showType === 2" @change-file="ChangeFile"></Addimg>
    <audit-list v-if="showType === 3"></audit-list>
    <Audit v-if="showType === 2 || showType === 1" :list="listChangeData" :item-type="showType+1"></Audit>
  </div>
</template>

<script>
import Audit from './children/audit.vue'
import Addimg from './children/addimg.vue'
import loadMore from 'components/common/LoadMore'
import AuditList from './children/auditlist.vue'
import CommodityList from './children/commoditylist.vue'
export default {
  data () {
    return {
      tabObj: {
        index: 0,
        tablist: [
          {
            name: '关联商品',
            toggleTrue: true,
            path: '/information?type=0'
          },
          {
            name: '补充商品',
            toggleTrue: false,
            path: '/information?type=1'
          },
          {
            name: '图表上传',
            toggleTrue: false,
            path: '/information?type=2'
          },
          {
            name: '审核',
            toggleTrue: false,
            path: '/applydetail'
          }
        ]
      },
      goaddShow: false,
      showObj: {
        submitShow: true,
        type: 0,
        AuditListShow: false,
        listShow: false
      },
      imgObj: {
        img: require('@/assets/icon/icon/logo@2x.png')
      },
      list: undefined,
      modificationObj: {},
      type: undefined,
      listChangeData: [],
      fileChangePath: '',
      showType: 0
    }
  },
  props: {
    childList: Array
  },
  components: {
    Audit,
    Addimg,
    loadMore,
    'audit-list': AuditList,
    'commodity-list': CommodityList
  },
  mounted () {
    this.showType = +this.$route.query.type
    this.toggleTab(this.tabObj.tablist[this.showType], this.showType)
  },
  watch: {
    $route () {
      if (this.$route.path === "/information") {
        try {
          this.showType = +this.$route.query.type
          this.toggleTab(this.tabObj.tablist[this.showType], this.showType)
        } catch (e) {
          console.warn(e)
        }
      }
    }
  },
  methods: {
    goAdd () {
      this.$router.push({
        path: '/add'
      })
    },
    toggleTab (item, type) {
      if (type === 3) {
        this.$router.replace({
          path: item.path
        })
        return false
      }
      let oldtab = this.tabObj.tablist[this.tabObj.index]
      oldtab.toggleTrue = false
      this.tabObj.tablist.splice(this.tabObj.index, 1, oldtab)
      item.toggleTrue = true
      this.tabObj.index = type
      this.showObj.type = type
      if (type === 0) {
        this.itemType = 1
        this.showObj.submitShow = true
      } else if (type === 1) {
        this.goaddShow = true
        this.showObj.submitShow = true
        this.itemType = 2
      } else if (type === 2) {
        this.goaddShow = false
        this.list = undefined
        this.itemType = 3
        this.showObj.submitShow = true
      } else if (type === 3) {
        this.goaddShow = false
        this.showObj.submitShow = false
      }
      this.$router.replace({
        path: item.path
      })
    },
    ChangeList (list) {
      this.listChangeData = list
    },
    ChangeFile (list) {
      this.listChangeData = list
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/informationIndex.scss";
</style>
