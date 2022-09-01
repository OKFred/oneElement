<template>
  <div style="height: 100%">
    <el-row type="flex">
      <el-col>
        <ChartBMap :globalObj="globalObj" :chartData="localObj.chartDataBMap" :polygonData="localObj.polygonData" />
      </el-col>
    </el-row>
    <br />
  </div>
</template>

<script setup>
//模块引入
import { reactive, computed, onMounted } from 'vue';
import ChartBMap from './components/ChartBMap.vue';
import ChartDataLine from './components/ChartDataLine.js';
import ChartDataPolygon from './components/ChartDataPolygon.js';

//父系入参
const props = defineProps({
  globalObj: Object,
});

//本地变量和函数

let localObj = reactive({ name: 'home', chartDataBMap: [] });

onMounted(() => {
  console.log('map: 已加载');
  polygonDataReady();
  mapDataReady();
});

function mapDataReady() {
  let plotData = [...ChartDataLine].map((track) => {
    return {
      coords: track.map((segment, index) => {
        return segment.coord;
      }),
    };
  });
  localObj.chartDataBMap = plotData;
}
function polygonDataReady() {
  localObj.polygonData = [...ChartDataPolygon];
}
</script>
