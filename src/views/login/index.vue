<template>
  <div style="height: 100%">
    <loginForm :globalObj="globalObj" :langPack="langPack" />
  </div>
</template>

<script setup>
//模块引入
import { reactive, watch, computed, onMounted, onActivated, onDeactivated, onUpdated } from 'vue';
import loginForm from '@/views/login/components/loginForm.vue';
import languages from '@/views/login/languages.js';

//父系入参
const props = defineProps({
  globalObj: Object,
});

//本地变量和函数
let localObj = reactive({ name: 'login' });
let langPack = computed(() => languages[props.globalObj.locale.language]);
</script>

<style scoped></style>
