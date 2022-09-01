<template>
  <div style="height: 100%">
    <el-row type="flex">
      <el-col :xs="15" :sm="15">工作进度</el-col>
      <el-col :xs="1" :sm="1"> </el-col>
      <el-col :xs="8" :sm="8">{{ new Date().Format('yyyy-MM-dd hh:mm') }}。又是新的一天。☀</el-col>
    </el-row>
    <el-row type="flex">
      <el-col>
        <ChartSalesFunnel :globalObj="globalObj" :chartData="localObj.chartDataSalesFunnel" />
      </el-col>
      <el-col>
        <ChartDailyDistribute :globalObj="globalObj" :chartData="localObj.chartDataDailyDistribute" />
      </el-col>
      <el-col>
        <br />
        <b>待办事项</b>
        <ul style="font-size: 1rem">
          <li>09:00 打开电脑</li>
          <li>09:10 查看客户邮件</li>
          <li style="color: red">09:30 内部会议</li>
          <li>12:00 午休时间</li>
          <li>14:00 系统功能优化</li>
          <li>14:20 点个下午茶</li>
          <li>16:30 在线培训</li>
          <li>18:00 下班打卡</li>
        </ul>
      </el-col>
    </el-row>
    <br />
  </div>
</template>

<script setup>
//模块引入
import { reactive, computed, onMounted } from 'vue';
import ChartDailyDistribute from '@/views/home/components/ChartDailyDistribute.vue';
import ChartSalesFunnel from '@/views/home/components/ChartSalesFunnel.vue';
import languages from '@/views/home/languages.js';

//父系入参
const props = defineProps({
  globalObj: Object,
});

//本地变量和函数

let langPack = computed(() => languages[props.globalObj.locale.language]);

let localObj = reactive({ name: 'home', chartDataDailyDistribute: [], chartDataSalesFunnel: [] });

onMounted(() => {
  console.log('home: 已加载');
  todayFollowReady();
  dailyDistributeReady();
});

function todayFollowReady(msg) {
  let plotData = [
    { name: '当前库容', value: 750 },
    { name: '总客户数', value: 660 },
    { name: '已联系上', value: 180 },
  ];
  localObj.chartDataSalesFunnel = plotData;
}

function dailyDistributeReady(msg) {
  let plotData = [
    { 分类: '待注册', 数量: 50 },
    { 分类: '邮箱退信', 数量: 20 },
    { 分类: '90d注册', 数量: 100 },
    { 分类: '90d升级', 数量: 88 },
    { 分类: '90d咨询', 数量: 77 },
    { 分类: '12h联系', 数量: 24 },
  ];
  localObj.chartDataDailyDistribute = plotData;
}
</script>
