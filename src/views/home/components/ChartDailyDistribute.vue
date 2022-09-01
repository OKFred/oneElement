<template>
  <div style="display: flex; flex-direction: column; justify-content: center">
    <!-- 图表 -->
    <div ref="refChart" class="refChart" style="height: 300px"></div>
  </div>
</template>

<script setup>
//模块引入
import { reactive, watch, getCurrentInstance, onBeforeUnmount, onActivated } from 'vue';
import chartApp from './ChartDailyDistribute.js';

//父系入参
const props = defineProps({
  globalObj: Object,
  chartData: Array,
});

//本地变量和函数
let { $refs } = getCurrentInstance().proxy;
let localObj = reactive({ chart: null, chartData: [], listener: '' });

watch(
  () => props.chartData,
  (newValue, oldValue) => {
    if (newValue && newValue.length) {
      localObj.chartData = newValue;
      toggleGraph();
    }
  }
);

onBeforeUnmount(() => {
  if (localObj.listener) window.removeEventListener('resize', localObj.listener);
});

onActivated(() => {
  if (localObj.chart != null) localObj.chart.resize();
});

function toggleGraph(hide) {
  if (!hide) {
    if (localObj.chart != null) return localObj.chart.dispose(); //销毁
  }
  if (localObj.chart !== null) return localObj.chart.init(); //创建
  try {
    graphMaker();
  } catch (e) {
    console.log(e.message);
  }
}
function graphMaker() {
  let chartOption = chartApp.graphMaker(localObj.chartData);
  localObj.chart = props.globalObj.initCharts($refs['refChart'], chartOption); //创建 Chart 对象
  localObj.listener = window.addEventListener('resize', () => {
    if (localObj.chart != null) localObj.chart.resize();
  });
}
</script>

<style scoped>
@media screen and (max-width: 992px) {
  .refChart {
    width: 100%;
  }
}
@media screen and (min-width: 992px) {
  .refChart {
    width: 80%;
  }
}
</style>