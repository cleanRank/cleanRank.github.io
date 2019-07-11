<template>
  <header class="head-cont flex position">
       <!-- <a class="return cell_0" href="javascript:history.go(-1)" v-if="this.$store.state.config.fromChannel != 'sxypApp'"></a> -->
       <span class="tit cell_1">{{$route.meta.title}}</span>
       <slot name="diy-text"></slot>
   </header>
</template>
