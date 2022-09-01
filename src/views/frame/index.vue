<template>
  <div style="height: 100%">
    <!-- 置顶 -->
    <FrameDialog :globalObj="globalObj" />
    <FrameHeader :globalObj="globalObj" :langPack="langPack" />
    <FrameBody :globalObj="globalObj" />
    <FrameFooter />
  </div>
</template>

<script setup>
//模块引入
import { computed, onBeforeMount, onUpdated } from 'vue';
import FrameDialog from '@/views/frame/components/FrameDialog.vue';
import FrameHeader from '@/views/frame/components/FrameHeader.vue';
import FrameBody from '@/views/frame/components/FrameBody.vue';
import FrameFooter from '@/views/frame/components/FrameFooter.vue';
import '@/views/frame/components/GlobalNotification.js';
import languages from '@/views/frame/languages.js';

//父系入参
let props = defineProps({
  globalObj: Object,
});

//本地变量和函数
/* 
import searchBar from '@/views/frame/components/searchbar.vue'
import settingBar from '@/views/frame/components/settingbar.vue'
import sideBar from '@/views/frame/components/sidebar.vue'
import footerBar from '@/views/frame/components/footerbar.vue' */

let langPack = computed(() => languages[props.globalObj.locale.language]);

onBeforeMount(() => {
  window.matchMedia('(max-width: 992px)').addEventListener('change', (e) => {
    onBreakpoint(e.matches);
  }); //未登录时，也就没有侧边栏和它的断点接口，所以不用 @breakpoint API
  if (window.matchMedia('(max-width: 992px)').matches) onBreakpoint(true); //小屏则设置断点（毕竟默认值是大屏）
});

onUpdated(() => {
  console.log('页面更新'); //比如登录了
});

function onBreakpoint(breaked) {
  console.log('断点 ?', breaked);
  props.globalObj.display.breaked = breaked;
  props.globalObj.sidebar.collapse = breaked;
} //分辨率断点
</script>

<style>
:root {
  font-size: 16px;
  font-family: 等线, sans-serif;
  --text-dark: rgb(0, 21, 41);
  --text-light: rgb(255, 255, 255);
  --bg-dark: rgb(0, 21, 41);
  --bg-light: rgb(227, 242, 253);
}

html,
body,
#app {
  height: auto !important;
  margin: 0;
  padding: 0;
}

body::-webkit-scrollbar {
  width: 0.5rem;
}

body::-webkit-scrollbar-track {
  background-color: #ccc;
}

body::-webkit-scrollbar-thumb {
  background-color: #ccc;
}
</style>