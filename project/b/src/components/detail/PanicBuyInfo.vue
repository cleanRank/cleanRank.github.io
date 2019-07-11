<template id="">
<section>
  <div class="price seckill_price flex">
      <div class="cell_1 seckill_items">
        <!-- 限时秒杀 -->
      </div>
      <div class="cell_0 seckill_time">
          <p class="jljs_p">距结束还有</p>
          <p class="timer_p_2 flex">
            <span class="hour_num timer_s_2 cell_0">{{time.hours}}</span>
            <span class="minutes_nums timer_s_2 cell_0">{{time.minutes}}</span>
            <span class="cell_0 second_nums timer_s_2">{{time.seconds}}</span>
          </p>
      </div>
  </div>
  <!-- <div class="base_info">
    <h3 class="base_info_title">{{goodsInfo.productName}}</h3>
    <h3 class="vicetitle" v-if="goodsInfo.viceTitle != ''">{{goodsInfo.viceTitle}}</h3>
  </div> -->
  <!-- <div class="maisha_wrap">
    <p class="goodPrice"><span class="c_red">￥</span><span class="goodPrice_num c_red">{{goodsInfo.activityPrice}}</span><span class="tag_price c_red">秒杀价</span></p>
    <p class="virtualPrice">
      <del class="c_999 font12 virtualPrice_num">￥{{goodsInfo.jdPrice2 || goodsInfo.virtualPrice || goodsInfo.jdPrice}}</del>
      <span class="rebatePriceNumWrap" v-if="goodsInfo.rebateStatus && goodsInfo.rebateStatus!='0'&& goodsInfo.rebate && goodsInfo.rebate>0">
        <span class="rebateBefore">赚</span><span class="rebatePriceNum">￥{{goodsInfo.rebate}}</span>
      </span>
    </p>
  </div> -->
</section>
</template>
<script type="text/javascript">
  export default {
    props: {
      goodsInfo: {
        required: true,
        type: Object
      },
      time: {
        required: true,
        type: Object
      }
    }
  }
</script>
<style media="screen">
</style>
