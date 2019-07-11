<template>
  <section>
    <section class="listWrap category_wrap wk_wrap">
      <div class="category-tab" id="categoryBody">
        <ul class="ul_cont" id="qualityCategory">
          <li :data-bdindex="i" data-erow="1" data-modname="categoryModel" :class="{cur: item.upCategoroyType == activeCategoryType}" v-for="(item, i) in categories" :key="i" @click="categoryClick(item, $event)">
            {{item.upCategoryName}}
          </li>
        </ul>
      </div>
      <div class="category-content" id="categoryWrap">
        <div class="list_banner" id="listBanner" v-if="!!activeCategory.h5Url">
          <a :href="activeCategory.h5Url+(activeCategory.h5Url.indexOf('?')>0?'&' : '?')+'fromChannel=' + $store.state.config.fromChannel" class="banner_a">
            <img :src="activeCategory.picUrl" :alt="activeCategory.name" width="100%" class="lazy">
          </a>
        </div>
        <ul class="category-style" id="categoryList" v-for="(items, i) in activeCategory.labelList" :key="i">
          <div class="tagName_box" v-if="items.taglistData && items.taglistData.length>0">{{items.tagName}}</div>
          <li class="js_go_list" :class="[items.type == 0 ? 'label_li' : '']" @click="goSpecList(spec, spec.keyWord, $event)" v-for="spec in items.taglistData" :key="spec.keyWord">
            <img :src="spec.image" :alt="spec.name" class="lazy">
            <em>{{spec.name}}</em>
          </li>
        </ul>
      </div>
    </section>
  </section>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      categories: [],
      activeCategory: {
        labelList: [],
        h5Url: '',
        picUrl: '',
        name: ''
      },
      activeCategoryType: '',
      categoryTypeNext: ''
    }
  },
  methods: {
    fetchCategoryData () {
      this.showLoad(true)
      return this.$post({
        url: this.$store.state.api.categoryshowtag,
        data: {
          time: new Date().getTime(),
          upCategoryType: 0
        }
      }).then(({data: res}) => {
        if (!res) {
          this.$router.push('/brokennet')
        }
        this.showLoad(false)
        if (res.status == 1) {
          this.$set(this.$data, 'categories', res.data)
          if (this.activeCategoryType) {
            let actvieCate = _.find(this.categories, (cate, index) => {
              return cate.upCategoroyType === this.activeCategoryType
            })
            this.$set(this.$data, 'activeCategory', actvieCate)
          } else {
            this.$set(this.$data, 'activeCategory', res.data[0])
            this.$set(this.$data, 'activeCategoryType', res.data[0].upCategoroyType)
          }
          // 二级商品无搜索关键字字段
          this.activeCategory.labelList.forEach((i) => {
            if (i.type == 1) {
              i.taglistData.forEach((x) => {
                x.keyWord = x.modelType
              })
            }
          })
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    },
    categoryClick (category, e) {
      this.$set(this.$data, 'activeCategory', category)
      this.$set(this.$data, 'activeCategoryType', category.upCategoroyType)
      // 二级商品无搜索关键字字段
      this.activeCategory.labelList.forEach((i) => {
        if (i.type == 1) {
          i.taglistData.forEach((x) => {
            x.keyWord = x.modelType
          })
        }
      })
    },
    goSpecList (spec, categoryType, e) {
//      this.categoryTypeNext = this.activeCategoryType
      window.sessionStorage.removeItem('productName')
      this.$router.push({
        path: '/search',
        query: {
          categoryType: categoryType,
          categoryTypeNext: this.activeCategoryType
        }
      })
    }
  },
  created () {
    this.fetchCategoryData()
  },
  mounted () {
    let {categoryType} = this.$store.state.route.query
    if (categoryType) {
      this.$set(this.$data, 'activeCategoryType', categoryType)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name == 'Search') {
        vm.$set(vm.$data, 'activeCategoryType', window.sessionStorage.getItem('activeCategoryType'))
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.name == 'Search') {
      window.sessionStorage.setItem('activeCategoryType', this.activeCategoryType)
    }
    next()
  }
}
</script>

<style lang="scss">
  .banner_a [lazy="loading"] {
    background: url("../../assets/icon/banner/lazy_banner.png") no-repeat 50% 50% / 100% 100%;
  }
  .category-style [lazy="loading"] {
    background: url("../../assets/icon/banner/lazy_icon.png") no-repeat 50% 50% / 100% 100%;
  }
</style>
