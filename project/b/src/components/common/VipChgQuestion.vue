<template>
  <section>
    <ul class="ruleList problemlist">
      <li class="li_item flex">
        <span class="span_num cell_0">1</span>
        <p class="p_txt cell_1">
          <b class="title_problem">付款成功后，一般需要多久收到【激活码或兑换码】？</b>
          <span>答：付款成功后，10分钟左右，会以短信形式，发送【激活码或兑换码】到您的手机，请注意查收。有遇特殊情况，比如不再服务区等情况，短信通道可能会有延迟。</span>
        </p>
      </li>
      <li class="li_item flex">
        <span class="span_num cell_0">2</span>
        <p class="p_txt cell_1">
          <b class="title_problem">【激活码或兑换码】为何无法在订单详情中查看到？</b>
          <span>答：为了安全因素的考虑，防止有人盗用您的【激活码或兑换码】，所以我们只会以短信的方式告之您所购买商品的【激活码或兑换码】。</span>
        </p>
      </li>
      <li class="li_item flex">
        <span class="span_num cell_0">3</span>
        <p class="p_txt cell_1">
          <b class="title_problem">我已经成功付款，能否取消订单？</b>
          <span>答：不可以，虚拟商品充值成功，无法取消订单。</span>
        </p>
      </li>
      <li class="li_item flex">
        <span class="span_num cell_0">4</span>
        <p class="p_txt cell_1">
          <b class="title_problem">我购买了卡密，拿到卡密后如何充值？</b>
          <span>答：请登录相应的会员官方网站或对应官方充值中心输入账号和【激活码或兑换码】进行充值。</span>
        </p>
      </li>
      <li class="li_item flex">
        <span class="span_num cell_0">5</span>
        <p class="p_txt cell_1">
          <b class="title_problem">充值失败，退款多久到账，额度多久恢复？</b>
          <span>答：首付款将于1-2个工作日内退回，授信额度将于3-7个工作日内恢复。</span>
        </p>
      </li>
      <li class="li_item flex">
        <span class="span_num cell_0">6</span>
        <p class="p_txt cell_1">
          <b class="title_problem">充值成功后，可否开具发票？</b>
          <span>答：暂不对虚拟充值业务提供发票，敬请谅解。</span>
        </p>
      </li>
      <li class="li_item flex">
        <span class="span_num cell_0">7</span>
        <p class="p_txt cell_1">
          <b class="title_problem">我已成功付款，为什么订单状态还是“待支付”？</b>
          <span>答：由于在线支付网关信息延迟，所以订单状态还没有变更过来，您可稍后查看订单状态。</span>
        </p>
      </li>
      <li class="li_item flex">
        <span class="span_num cell_0">8</span>
        <p class="p_txt cell_1">
          <b class="title_problem">发现价格变动异常怎么办?</b>
          <span>答：因可能存在系统缓存、页面更新导致价格变动异常等不确定性情况出现，如您发现商品标价或促销信息有异常，请您立即联系我们，以便我们及时补正。</span>
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
