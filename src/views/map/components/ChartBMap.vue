<template>
  <div style="display: flex; flex-direction: column; justify-content: center">
    <!-- 图表 -->
    <div ref="refChart" class="myChart" style="height: 600px"></div>
  </div>
</template>

<script setup>
//模块引入
import { reactive, watch, getCurrentInstance, onBeforeUnmount, onActivated } from 'vue';
import chartApp from './ChartBMap.js';

//父系入参
const props = defineProps({
  globalObj: Object,
  chartData: Array,
  polygonData: Array,
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
  //if (localObj.chart != null) localObj.chart.resize(); //地图组件用这个似乎还有反效果
});

function toggleGraph(hide) {
  if (!hide) {
    if (localObj.chart != null) return localObj.chart.dispose(); //销毁
  }
  if (localObj.chart !== null) return localObj.chart.init(); //创建
  try {
    graphMaker();
  } catch (e) {
    console.log(e);
  }
}
function graphMaker() {
  let renderItem = (params, api) => props.globalObj.renderItem(params, api, props.polygonData);
  let chartOption = chartApp.graphMaker(localObj.chartData, renderItem);
  localObj.chart = props.globalObj.initCharts($refs['refChart'], chartOption); //创建 Chart 对象
  localObj.listener = window.addEventListener('resize', () => {
    if (localObj.chart != null) localObj.chart.resize();
  });
}
</script>

<style scoped>
@media screen and (max-width: 992px) {
  .myChart {
    width: 100%;
  }
}
@media screen and (min-width: 992px) {
  .myChart {
    width: 80%;
  }
}
</style>
