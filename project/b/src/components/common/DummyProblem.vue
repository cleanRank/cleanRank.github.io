<template>
  <section>
   <ul class="ruleList problemlist">
       <li class="li_item flex">
           <span class="span_num cell_0">1</span>
           <p class="p_txt cell_1"><b class="title_problem">话费及流量充值都支持哪些用户？</b><span>答：全国移动用户支持2G,3G,4G用户充值(特殊套餐除外)；全国联通用户支持3G、4G用户充值全国电信用户支持2G、3G.4G,时常计费的用户除外。</span></p>
       </li>
       <li class="li_item flex">
           <span class="span_num cell_0">2</span>
           <p class="p_txt cell_1"><b class="title_problem">为什么我在充值的时候，提示我“该号码不可充流量。”？</b><span>答：根据相关规定，对于部分如非3G号码/欠费/非实名制/运营商黑名单用户，暂时不能使用流量充值服务。对于实名制等业务的办理方法，建议联系归属地运营商。</span></p>
       </li>
       <li class="li_item flex">
           <span class="span_num cell_0">3</span>
           <p class="p_txt cell_1"><b class="title_problem">为什么我充值后，使用流量还被运营商扣了额外的费用？</b><span>答：充值完成后，第三方中间服务商可能因为网络原因没有及时将充值电子订单发送至运营商，运营商对您的充值情况不知情。运营商会在收到第三方服务方订单后为您充值，并在成功后为您发送到账短信。请确保您在收到到账短信后再使用流量，以防出现流量包之外的费用。出现流量不到账的时候，建议您先参考水象优品> 我的〉我的订单确认您的订单情况。</span></p>
       </li>
       <li class="li_item flex">
           <span class="span_num cell_0">4</span>
           <p class="p_txt cell_1"><b class="title_problem">充值的流量可以漫游吗？</b><span>答：充值时请关注页面提示，如果显示“全国可用”表示可以全国漫游。</span></p>
       </li>
       <li class="li_item flex">
           <span class="span_num cell_0">5</span>
           <p class="p_txt cell_1"><b class="title_problem">充值的流量有效期是多长？</b><span>答：大部分省份运营商充值流量当月有效，月底失效，部分面额三个月有效，请以在运营商查询的信息为准。</span></p>
       </li>
       <li class="li_item flex">
           <span class="span_num cell_0">6</span>
           <p class="p_txt cell_1"><b class="title_problem">我充值后怎么查看是否到账？</b><span>答：对于充值不到账问题的咨询，请致电水象优品客服专线：400-678-9999。</span></p>
       </li>
       <li class="li_item flex">
           <span class="span_num cell_0">7</span>
           <p class="p_txt cell_1"><b class="title_problem">话费或流量充错号码怎么办？</b><span>答：非常抱歉，充错号码后运营商(移动、联通、电信)是不会办理退款的。由于充值成功后，交易就已经完成，运营商不会将已经充上的话费/流量退还给供货商，所以我们也无法给您办理退款。您可以选择如下几种方式尝试弥补损失：<br>
1、联系实际充值的号码机主，与对方协商是否愿意为此补偿您的费用；<br>
2、联系运营商客服(移动10086、联通10010、电信10000)，咨询是否能够退还已经充值成功的流量；给您带来的不便，尽请谅解!并希望您在下次操作的时候注意核对号码是否正确，谢谢您的支持！</span></p>
       </li>
       <!-- <li class="li_item flex">
           <span class="span_num cell_0">8</span>
           <p class="p_txt cell_1"><b class="title_problem">如何查询订单或交易记录呢？</b><span>答：可以通过水象优品APP > 我的 >我的订单查询到该笔订单。</span></p>
       </li> -->
       <li class="li_item flex">
           <span class="span_num cell_0">8</span>
           <p class="p_txt cell_1"><b class="title_problem">为什么我的号码一直充值失败？</b><span>由于联通存在每个面额每个月充值5次的限制，充值超过5次(不限微信平台)将会出现失败退款。建议您充值其他面额的流量。另外，号码欠费、套餐互斥、非实名认证、运营商黑名单等原因也会导致充值失败退款。</span></p>
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
    }
  }
</script>
<style media="screen">

</style>
