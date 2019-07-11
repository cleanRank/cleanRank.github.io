<template>
  <section>
    <ul class="ruleList problemlist">
      <li class="li_item flex">
        <span class="span_num cell_0">1</span>
        <p class="p_txt cell_1">
          <b class="title_problem">爱奇艺</b>
          <span>
            使用方式<br>
            登录爱奇艺账号→输入激活码/兑换码→输入验证码，点击立即激活→激活成功！<br>
            适用范围<br>
            爱奇艺PC、移动端使用
          </span>
        </p>
      </li>
      <!-- <li class="li_item flex">
        <span class="span_num cell_0">2</span>
        <p class="p_txt cell_1">
          <b class="title_problem">乐视</b>
          <span>
            使用方式<br>
            登录乐视官网，登录账号，点击右上角"开通会员"，选择“使用兑换码”，输入兑换码和验证码即可<br>
            适用范围<br>
            乐次元影视会员仅可在PC、移动端使用；乐视超级影视会员可在TV端、PC、移动端使用
          </span>
        </p>
      </li> -->
      <li class="li_item flex">
        <span class="span_num cell_0">2</span>
        <p class="p_txt cell_1">
          <b class="title_problem">优酷</b>
          <span>
            使用方式<br>
            打开官网，登录会员账号，右上角显示账号昵称后即登录成功。点击会员卡，激活您的会员卡即可<br>
            适用范围<br>
            优酷PC、移动端使用
          </span>
        </p>
      </li>
      <li class="li_item flex">
        <span class="span_num cell_0">3</span>
        <p class="p_txt cell_1">
          <b class="title_problem">搜狐</b>
          <span>
            使用方式<br>
            登录搜狐视频官网，登录账号，点击"会员特权"，选择“兑换码”，输入兑换码和验证码即可激活<br>
            适用范围<br>
            搜狐PC、移动端使用
          </span>
        </p>
      </li>
      <li class="li_item flex">
        <span class="span_num cell_0">4</span>
        <p class="p_txt cell_1">
          <b class="title_problem">腾讯视频</b>
          <span>
            使用方式<br>
            进入腾讯视频官网—会员频道—点击“观影券”—选择“兑换好莱坞会员”—输入兑换码和验证码即可激活成为相应的好莱坞会员。或直接至http://film.qq.com/duihuan.html进行兑换<br>
            适用范围<br>
            腾讯PC、移动端使用
          </span>
        </p>
      </li>
    </ul>
  </section>
</template>
<script type="text/javascript">
export default {
  beforeRouteEnter (to, from, next) {
    document.querySelector('body').style.background = "#fff"
    next()
  },
  beforeRouteLeave (to, from, next) {
    document.querySelector('body').style.background = "$bgColor"
    next()
  },
  created () {
    this.showLoad(false)
  },
  mounted () {
  }
}
</script>
<style media="screen">

</style>
