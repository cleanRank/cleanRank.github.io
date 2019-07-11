<template>
  <section class="feedback_wrap">
    <!-- question Type start -->
    <section class="question_type">
      <h6 class="question_type_tit">问题类型</h6>
      <ul class="question_type_list">
        <li
          class="question_type_item"
          v-for="(item, index) in questionTypeList"
          :key="index"
          @click="handlQuestionType(item, index)"
          :class="{'cur': questionTypeIdx === index}"
        >{{item.desc}}
        </li>
      </ul>
    </section>
    <!-- question Type end -->
    <!-- feedback info start -->
    <section class="feedback_info">
      <div class="feedback_describe_wrap">
        <textarea name="description" class="feedback_describe" maxlength="500" placeholder="请描述一下您的问题"
                  v-model.trim="feedback_describe_text"></textarea>
      </div>
      <div class="file_wrap">
        <div class="file_images ">
          <a href="javascript:;" class="file_image_item" v-for="(item, index) in photos" :key="index">
            <span class="file_image_del" @click.stop="delImage(index)"></span>
            <div class="file_image_item_img" @click="viewImage(item, index)"><img :src="item"></div>
          </a>
          <div class="upload_file file_image_item" v-show="photos.length<3">
            <input type="file" name="images" id="upload" class="file_ipt" @change="fileChange($event)"
                   accept="image/*"/>
          </div>
        </div>
        <span class="text_length">{{text_length}}/500</span>
      </div>
    </section>
    <section v-show="imgCarousel" :class="{fullScreenImg: imgCarousel}">
      <div class="imgCarouselHead">
        <a href="javacript:;" class="return" @click="toggleFullScreenImg"></a>
        <a href="javacript:;" class="img_carousel_del" @click="delImage(swiperActiveIndex)">删除</a>
      </div>
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(item, index) in photos" :key="index" class="mySwiper">
          <div class="img_box maxWH" @click="toggleFullScreenImg">
            <span><img alt="" class="" :src="item"></span>
          </div>
        </swiper-slide>
        <div class="swiper-pagination swiper-pagination-number" slot="pagination"></div>
      </swiper>
    </section>
    <!-- feedback info end -->
    <div class="cell_phone_number" id="cell_phone_Form">
      <p>手机号：</p>
      <input type="tel" placeholder="请输入手机号" name="mobile" data-validate="phone" autocomplete="off" maxLength='11' reg="phone" v-model.trim="mobile">
    </div>
    <div class="submitFeedback_wrap">
      <button type="button" class="submitFeedback" @click="submitFeedback($event)" :class="questionTypeIdx!=-1 && text_length>0 ? 'bgBlue' : ''">提交
      </button>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {
        // 反馈类型列表
        questionTypeList: [],
        questionTypeIdx: -1,
        feedbackType: '', // 反馈类型
        feedback_describe_text: '', // 反馈内容
        mobile: '', // 反馈手机号
        imgCarousel: false, // 图片预览的显示隐藏状态
        maxImgLength: 3,
        swiperOption: {
          pagination: '.swiper-pagination',
          paginationType: 'fraction',
          speed: 1000,
          initialSlide: 0,
          onTransitionEnd: (swiper) => {
            this.$set(this.$data, 'swiperActiveIndex', swiper.activeIndex)
          }
        },
        // 当前图片预览的index
        swiperActiveIndex: 0,
        photos: [], // 存放压缩后的base64编码
        picArray: [] // 存放图片发送到服务器
      }
    },
    computed: {
      text_length: function () {
        return this.feedback_describe_text.length
      },
      swiper () {
        return this.$refs.mySwiper.swiper
      }
    },
    created () {
      this.getQuestionType()
    },
    methods: {
      getQuestionType () {
        this.$post({
          url: this.$store.state.api.AdviceFeedbackType,
          data: {}
        }).then(data => {
          this.showLoad(false)
          let res = data.data
          if (res.status === "1") {
            this.questionTypeList = res.data
          } else {
            this.showToast({msg: res.statusDetail})
          }
        })
      },
      // 选择反馈类型
      handlQuestionType (item, index) {
        this.questionTypeIdx = index
        this.feedbackType = item.key
      },
      viewImage (item, index) {
        this.imgCarousel = true
        this.swiperActiveIndex = index
        this.swiper.slideTo(index, 1000, false)
      },
      // 隐藏图片预览
      toggleFullScreenImg () {
        this.imgCarousel = false
      },
      // 删除图片
      delImage (index) {
        let that = this
        this.showDialog({
          title: '提示',
          rBtnText: '确定',
          lBtnText: '取消',
          msg: '是否确认删除图片？',
          confCallBack () {
            that.photos.splice(index, 1)
            that.picArray.splice(index, 1)
            that.swiperActiveIndex--
            if (that.photos.length <= 0) {
              that.imgCarousel = false
            }
          }
        })
      },
      fileChange (e) { // 照片获取
        let _this = this
        let img = event.target.files
        if (img.length > 3 || (img.length + this.photos.length) > this.maxImgLength) {
          this.showToast({
            msg: '最多只可上传3张图片'
          })
          return false
        }
        _this.compressFile(img[0])
        // 时时更新数据
        event.target.value = ''
      },
      compressFile (file, wantedSize = 150000) {
        // 图片大小约是base64的70%
        const curSize = file.size || file.length * 0.7
        const quality = Math.max(wantedSize / curSize, 0.65)
        window.lrz(file, {
          // 压缩照片
          width: 880,
          quality
        }).then((src) => {
          // 添加图片路径到数组
          this.picArray.push(src.base64.replace(/^data:image\/\w+;base64,/, ""))
          this.photos.push(src.base64)
        })
      },
      feedbackInfo () {
        let {uid} = this.$store.state.userInfo
        this.$post({
          url: this.$store.state.api.feedbackH5,
          data: {
            uid,
            Plat: 'H5',
            description: this.feedback_describe_text,
            images: JSON.stringify(this.picArray),
            mobile: this.mobile,
            feedbackType: this.feedbackType
          }
        }).then(data => {
          this.showLoad(false)
          let res = data.data
          if (res.status == '1') {
            this.showToast({msg: '提交成功'})
            setTimeout(() => {
              this.$router.push('/personal')
            }, 1000)
          } else {
            this.showToast({msg: '提交失败'})
          }
        })
      },
      // 提交问题反馈
      submitFeedback (event) {
        if (this.questionTypeIdx == -1) {
          this.showToast({
            msg: '请选择问题类型'
          })
          return false
        }
        if (this.feedback_describe_text == '') {
          this.showToast({
            msg: '问题描述还未输入呢~'
          })
          return false
        }
        // 过滤表情包
        let regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g
        if (this.feedback_describe_text.match(regRule)) {
          this.showToast({
            msg: '问题描述中不能包含表情哦~'
          })
          return false
        }
        if (this.mobile != '') {
          let reg = /^0?(13|15|18|14|17|16|19)[0-9]{9}$/
          if (!reg.test(this.mobile)) {
            this.showToast({
              msg: '请输入正确的手机号'
            })
            return false
          }
        }
        this.feedbackInfo()
      }
    }
  }
</script>
