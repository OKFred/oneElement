<template>
  <div>
    <MainFilter :globalObj="globalObj" :localObj="localObj" />
    <CustomerTable :globalObj="globalObj" :localObj="localObj" />
    <CustomerDialog :globalObj="globalObj" :localObj="localObj" />
  </div>
</template>

<script setup>
//模块引入
import { reactive } from 'vue';
import MainFilter from './components/MainFilter.vue';
import CustomerTable from './components/MainTable.vue';
import CustomerDialog from './components/MainDialog.vue';

//父系入参
const props = defineProps({
  globalObj: Object,
});

//本地变量和函数
let localObj = reactive({
  name: 'customer',
  setLocalObj: function (obj) {
    Object.assign(localObj, obj);
  },
});
</script>

<style></style>
