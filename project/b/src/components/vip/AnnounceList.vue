<template>
<section v-if="isLoading">
   <div class="list" v-for="(item, index) in announceList" :key="index" @click="toDetail(item.contentId)">
       <div class="annLeft">
           <div class="annTit">{{item.title}}</div>
           <div class="annBom">
               <span class="author">{{item.author}}</span>
               <span class="time">{{item.createTime | timeFormat(1)}}</span>
           </div>
       </div>
       <div class="annRight">
           <img :src="item.titleImg" alt="">
       </div>
   </div>
</section>
</template>
<style lang="scss" scoped>
@import "../../assets/scss/app";
    .content-offset{
         @include px2rem(padding, 0 24);
    }
    .list{
        width:100%;
        @include px2rem(padding, 20 0);
        @include px2rem(height, 208);
        border-bottom: 1px solid #f4f4f4;
        box-sizing: border-box;
        overflow: hidden;
        .annLeft{
            float: left;
            height: 100%;
            @include px2rem(width, 438);
            @include px2rem(line-height, 40);
            @include font-dpr(30);
            color: #444;
            position: relative;
            overflow: hidden;
            .annTit{
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: justify;
                display: -webkit-box;
                word-break: break-all;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2; 
            }
            .annBom{
               position:absolute;
               left:0;
               bottom: 0;
               @include font-dpr(22); 
               color:#999;
               .author{
                  @include px2rem(margin-right, 20); 
               }
            }
        }
        .annRight{
            float: right;
             @include px2rem(width, 224);
             @include px2rem(height, 168);
             overflow: hidden;
            img{
                display:block;
                width: 100%;
                border:none;
            }
        }
    }
</style>
<script>
import changeBg from '@/mixin/'
export default {
  mixins: [changeBg],
  data () {
    return {
      isLoading: false,
      announceList: [],
      isSCrollLoading: false,
      pageNo: 1, // 当前页数
      pageCount: 4, // 总页数
      pageSize: 10 // 分页单位
    }
  },
  created () {
    this.getAnnounceList()
    this.$nextTick(() => {
      window.addEventListener('scroll', this.onScroll, false)
    })
  },
  methods: {
    getAnnounceList (type) {
      let { uid, token } = this.$store.state.userInfo
      if (this.pageCount < this.pageNo) {
        return Promise.resolve()
      }
      this.isSCrollLoading = true
      this.showLoad(true)
      this.$post({
        url: this.$store.state.api.getAnnounceList,
        data: {
          uid,
          token,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.showLoad(false)
        this.isLoading = true
        this.isSCrollLoading = false
        if (res.data.status==1) {
          this.pageNo += 1
          this.pageCount = res.data.pageCount
          console.log(3)
          if (!type) {
            this.announceList=res.data.data
            console.log(1)
          } else {
            console.log(2)
            this.announceList = this.announceList.concat(res.data.data)
          }
        }
      })
    },
    toDetail (id) {
      this.$router.push({
        path: '/announceDetail',
        query: {
          origin: 'announce',
          isAc: false,
          contentId: id,
          contentNum: 0,
          fromChannel: 'sxyph5'
        }
      })
    },
    onScroll () {
      if (this.isBottom() && !this.isSCrollLoading) {
        this.getAnnounceList('1')
      }
    },
    isBottom () {
      return ((document.body.scrollTop || document.documentElement.scrollTop) + document.documentElement.clientHeight + 20 >= document.body.scrollHeight)
    }
  }
}
</script>
