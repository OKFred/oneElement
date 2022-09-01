<template>
  <div id="app">
    <FrameWork :globalObj="globalObj" />
  </div>
</template>

<script setup>
//模块引入
import { reactive, watch } from 'vue';
import router from '@/router/index.js';
import * as echarts from 'echarts';
import 'echarts/extension/bmap/bmap'; //echarts百度地图组件

//通用
import '@/base/proto_date.js';
import '@/base/proto_node.js';
import '@/base/proto_string.js';
import '@/base/network.js';

//项目
import FrameWork from '@/views/frame/index.vue';
window.CountryRegions = require('@/base/CountryRegions.js').main;

//全局变量 & 函数
window.fn = (...args) => {
  console.log(...args);
}; //测试用

let globalObj = reactive({
  name: 'globalObj',
  msgs: {}, //消息处理
  tab: {
    currentTab: 'home',
    params: '',
  }, //页面切换
  setTab: function (obj) {
    this.tab = { ...this.tab, ...obj };
    let path = `/${this.tab.currentTab}`;
    if (obj.params) path = path + '?' + obj.params;
    if (path == router.currentRoute.path) return;
    router.push({ path });
    console.log('跳转至', path);
    if (this.tab.currentTab === 'login') {
      globalObj.setLogin({ hasLogin: false, loginInfo: {} });
    } //已登录的话清除下登录信息
  }, //设置当前tab
  locale: {
    language: 'zhCN',
  },
  setLocale: function (obj) {
    this.locale = { ...this.locale, ...obj };
  }, //设置语言
  login: {
    hasLogin: false,
    loginInfo: {},
  },
  setLogin: function (obj) {
    this.login = { ...this.login, ...obj };
  }, //设置登录信息
  sidebar: {
    collapse: false,
  },
  setSidebar: function (obj) {
    this.sidebar = { ...this.sidebar, ...obj };
    if (this.sidebar.collapse) console.log('sidebar 已收起?', this.sidebar.collapse);
  }, //设置侧边栏
  display: {
    breaked: false,
    rightClick: true,
    mode: true,
  }, //分辨率断点
  setDisplay: function (obj) {
    this.display = { ...this.display, ...obj };
  },
  checkBreakPoint: function () {
    let matches = window.matchMedia('(max-width: 992px)').matches;
    globalObj.display.breaked = matches;
    return matches;
  }, //是否是小屏
  notification: {
    params: [],
  }, //消息提示
  setNotification: function (obj) {
    this.notification = { ...this.notification, ...obj };
  },
  modal: {
    params: [],
    result: false,
  }, //对话框(传参，显示，结果)
  setModal: function (obj) {
    this.modal = { ...this.modal, ...obj };
  },
  baseData: {},
  setBaseData: function (obj) {
    this.baseData = { ...this.baseData, ...obj };
  },
  initCharts: function (echartComponent, optionObj, styleObj = {}) {
    const chart = echarts.init(echartComponent, null, styleObj);
    //console.log(optionObj);
    chart.setOption(optionObj);
    return chart;
  }, // echats 初始化配置
  renderItem: function renderItem(params, api, coordArr, styleObj = { fill: 'gold', stroke: 'red' }) {
    let pointArr = [];
    for (let coord of coordArr) {
      pointArr.push(api.coord(coord));
    }
    let { x, y, width, height } = params.coordSys;
    let points = echarts.graphic.clipPointsByRect(pointArr, { x, y, width, height });
    let obj = {
      type: 'polygon',
      shape: { points },
      style: api.style(styleObj),
    };
    return obj;
  }, // echats 配置多边形
});

watch(
  () => globalObj.login.hasLogin,
  (newValue, oldValue) => {
    if (!newValue) {
      globalObj.setTab({ currentTab: 'login' });
      globalObj.setSidebar({ collapse: true });
    } else {
      globalObj.setTab({ currentTab: 'home' });
      globalObj.setSidebar({ collapse: false });
    } //登录(缓存)检查并跳转
  },
  { immediate: true }
); //[登录] p.s.: 隐藏无关的功能

window.oncontextmenu = function (e) {
  if (!globalObj.display.rightClick) e.preventDefault();
}; //右键菜单是否禁用

window.handler = (msg) => {
  //console.log('新消息');
  let { tab } = msg.info;
  globalObj.msgs[tab] = msg;
}; //插件模式：消息分发给每个tab去处理
</script>

<style>
#html,
body,
app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
</style>