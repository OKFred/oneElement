<template>
  <div style="height: 100%">
    <p>所请求的页面不存在。正在重新跳转...</p>
    <p>PAGE NOT FOUND. Redirecting...</p>
    <br />
  </div>
</template>

<script setup>
//模块引入

//父系入参
const props = defineProps({
  globalObj: Object,
});

//本地变量和函数
setTimeout(() => props.globalObj.setTab({ currentTab: 'login' }), 1000);
</script>
