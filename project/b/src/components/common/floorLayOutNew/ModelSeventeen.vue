<template>
  <div class="floor-seventeen" :style="{background: floor.listFloorDetail[0].defaultBgColor}">
    <ul class="seventeen-nav-wrap" :class="{'flex': floor.listFloorDetail.length<5}" :style="{background: floor.listFloorDetail[0].defaultBgColor}">
      <li v-for="(nav, idx) in floor.listFloorDetail" :key="idx" class="seventeen-nav" @click="selectNav(nav, idx)" :style="{background:(idx == index?floor.listFloorDetail[0].selectBgColor:floor.listFloorDetail[0].defaultBgColor),color:(idx == index?floor.listFloorDetail[0].selectWordColor:floor.listFloorDetail[0].wordColor)}">
        <img class="seventeen-nav-img" v-if="nav.docpicUrl" :src="nav.docpicUrl" alt="">
        <p class="seventeen-nav-name" :class="{'lh100': !nav.docpicUrl}">{{nav.docName}}</p>
      </li>
    </ul>
    <div class="seventeen-list" v-if="floor.listFloorDetail.length>0">
      <div :id="'transversely'+floor.floorId+'_'+index" class="seventeen-goods" v-for="(item, index) in newFloor" :key="index">
        <ModelThirteen v-if="item.listFloorDetail[0].prudouct.length>0" :floor="item"></ModelThirteen>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import mixin from './mixin'
  import ModelThirteen from './ModelThirteen' // 三列
  export default {
    mixins: [mixin],
    data () {
      return {
        index: 0,
        newFloor: [],
        pageY: 0
      }
    },
    props: {
      floor: {
        required: true,
        type: Object
      }
    },
    components: {
      ModelThirteen
    },
    created () {
      this.floor.listFloorDetail.forEach(item => {
        let floor = {}
        floor.rebateStatus = this.floor.rebateStatus
        floor.listFloorDetail = [
          {
            picUrl: item.picUrl || '',
            defaultBgColor: item.productdefaultBgColor,
            prudouct: item.prudouct
          }
        ]
        this.newFloor.push(floor)
      })
    },
    methods: {
      selectNav (nav, index) {
        let floorNode = document.getElementsByClassName('floor-seventeen')[0] // 横切节点
        let navNode = document.getElementsByClassName('seventeen-nav-wrap')[0] // 导航节点
        let tabNodeAll = document.getElementsByClassName('seventeen-nav') // 获取每个tab
        let mainNodeAll = document.getElementsByClassName('seventeen-goods') // 获取每个内容
        // 如果横切未吸顶，则先吸顶
        if (index == this.index && navNode.style.position == "fixed") {
          return
        }
        this.index = index
        // 让当前选中的tab在屏幕中间显示
        for (let i = 0; i<tabNodeAll.length; i++) {
          let oldX = navNode.scrollLeft
          let newX = tabNodeAll[index].offsetLeft - ((navNode.offsetWidth - tabNodeAll[0].offsetWidth) / 2)
          this.scrollRun(oldX, newX, navNode, "scrollLeft")
        }
        let headerH = 0
        if (this.$store.state.route.name == 'Index') {
          // 首页
          headerH = $('.new-index-header').height() + $('.new-category-list-wrap').height()
        } else {
          headerH = $('.head-cont').height()
        }
        if (navNode.style.position == 'absolute') {
          // 横切未吸顶
          $('.seventeen-nav-wrap').css('position', 'fixed')
          $('.seventeen-nav-wrap').css('top', headerH)
        }
        // 滚动条滚动
        let pageY = floorNode.offsetTop + mainNodeAll[index].offsetTop - navNode.offsetHeight - headerH
        this.pageY = pageY
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop || 0
        window.removeEventListener('scroll', this.onScroll, false)
        window.addEventListener('scroll', this.onScrollOff, false)
        this.scrollRun(scrollTop, pageY)
      },
      scrollRun (oldX, newX, ele, direction) {
        var num = 0
        var frequency = 20
        var length = newX - oldX
        let time = setInterval(() => {
          num++
          if (num == frequency + 1) {
            clearInterval(time)
          } else {
            if (length>0) {
              // 上滑
              oldX += length / frequency
            } else {
              // 下滑
              oldX -= Math.abs(length) / frequency
            }
            if (ele && direction) {
              ele[direction] = Math.ceil(oldX)
            } else {
              document.documentElement.scrollTop = document.body.scrollTop = parseInt(oldX)
            }
          }
        }, 10)
      },
      onScrollOff () {
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop || 0
        let numRange = Math.abs(this.pageY - scrollTop)
        if (numRange<= 5) {
          window.removeEventListener('scroll', this.onScrollOff, false) // 移除滚动
          window.addEventListener('scroll', this.onScroll, false) // 恢复滚动监听
        }
      },
      onScroll () {
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop || 0 // 滚动条滚动距离
        var clientHeight = document.body.clientHeight // 可视区高度
        let floorNode = document.getElementsByClassName('floor-seventeen')[0] // 横切节点
        let navNode = document.getElementsByClassName('seventeen-nav-wrap')[0] // 导航节点
        let tabNodeAll = document.getElementsByClassName('seventeen-nav') // 获取每个tab
        let mainNodeAll = document.getElementsByClassName('seventeen-goods') // 获取每个内容
        let headerH = 0
        let footerH = 0
        if (this.$store.state.route.name == 'Index') {
          // 首页
          headerH = $('.new-index-header').height() + $('.new-category-list-wrap').height()
          footerH = $('.footer_wrap').height()
        } else {
          headerH = $('.head-cont').height()
        }
        // 判断横切是否在可视区范围内
        if (scrollTop > floorNode.offsetTop + floorNode.clientHeight - headerH - navNode.offsetHeight || (scrollTop + clientHeight - footerH) <floorNode.offsetTop) {
          // 不在可视区
          $('.seventeen-nav-wrap').css("position", "absolute")
          $('.seventeen-nav-wrap').css("top", 0)
        } else {
          // 在可视区
          // 判断元素是否碰到顶部
          if (floorNode.offsetTop - scrollTop <= headerH) {
            // 吸顶
            $('.seventeen-nav-wrap').css("position", "fixed")
            $('.seventeen-nav-wrap').css("top", headerH - 1)
          } else {
            $('.seventeen-nav-wrap').css("position", "absolute")
            $('.seventeen-nav-wrap').css("top", 0)
          }
        }
        // 计算滚动位置
        for (let i = 0; i < mainNodeAll.length; i++) {
          if (floorNode.offsetTop + mainNodeAll[i].offsetTop - headerH - navNode.offsetHeight <= scrollTop) {
            this.index = i
            navNode.scrollLeft = tabNodeAll[i].offsetLeft - ((navNode.offsetWidth - tabNodeAll[0].offsetWidth) / 2)
          }
        }
      }
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.onScroll, false)
      window.removeEventListener('scroll', this.onScrollOff, false)
    },
    mounted () {
      this.$nextTick(() => {
        window.addEventListener('scroll', this.onScroll, false)
      })
    }
  }
</script>
