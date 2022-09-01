<template>
  <div>
    <!-- 侧边栏（未登录不显示） -->
    <el-menu
      class="frame-sidebar"
      default-active="1"
      :collapse-transition="false"
      v-if="props.globalObj.login.hasLogin"
      :collapse="globalObj.sidebar.collapse"
      :router="true"
      :style="
        globalObj.sidebar.collapse ? { width: '0px', display: 'none' } : { width: '180px', display: 'inline-block' }
      "
    >
      <el-menu-item index="/home">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/customer">
        <i class="el-icon-document"></i>
        <span slot="title">客户</span>
      </el-menu-item>
      <el-menu-item index="/map">
        <i class="el-icon-location"></i>
        <span slot="title">地图</span>
      </el-menu-item>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-document"></i>
          <span slot="title">分析</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="3-1" class="frame-sidebar-menu">数据管家</el-menu-item>
          <el-menu-item index="3-2" class="frame-sidebar-menu">行动方案</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span slot="title">设置</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="4-1" class="frame-sidebar-menu">我的</el-menu-item>
          <el-menu-item index="4-2" class="frame-sidebar-menu">更新</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    <!-- 内容（路由跳转） -->
    <div class="frame-content" :style="localObj.content">
      <el-card style="margin: 1%; border-radius: 10px">
        <transition>
          <keep-alive>
            <router-view :globalObj="globalObj" />
          </keep-alive>
        </transition>
      </el-card>
    </div>
  </div>
</template>

<script setup>
//模块引入
import { reactive, watch, onUpdated } from 'vue';

//父系入参
let props = defineProps({
  globalObj: Object,
});

//本地变量和函数
let localObj = reactive({
  content: {
    'margin-left': '180px',
    width: 'calc(100% - 196px)',
  },
});

watch(
  () => props.globalObj.display.breaked,
  (newValue, oldValue) => {
    toggleMargin();
  },
  { immediate: true }
); //[断点] p.s.: 移动端性能优化需要

watch(
  () => props.globalObj.sidebar.collapse,
  (newValue, oldValue) => {
    toggleMargin(newValue);
  }
); //[侧边栏] 大屏时提高屏幕使用率

function toggleMargin() {
  let marginNone = () => {
    localObj.content = {
      width: '100%',
    };
  };
  let marginShow = () => {
    localObj.content = {
      'margin-left': '180px',
      width: 'calc(100% - 196px)',
    };
  };
  if (!props.globalObj.login.hasLogin) return marginNone();
  //未登录时，默认全屏 (优先)
  if (props.globalObj.display.breaked) return marginNone(); //断点时，默认全屏
  props.globalObj.sidebar.collapse ? marginNone() : marginShow(); //登录了 且未断点时，根据侧边栏状态设置
}
</script>

<style>
.frame-sidebar {
  position: fixed;
  top: 70px;
  height: 88vh;
  z-index: 1080;
}
.frame-sidebar-toggle {
  color: cornflowerblue;
  margin-left: 1em;
  font-size: 2em;
  transition: transform 225ms ease-in-out;
}
.frame-sidebar-menu {
  min-width: auto !important;
}
.frame-content {
  position: absolute;
  top: 70px;
  height: calc(100% - 70px);
  border-radius: 10px 10px 0px 0px;
  background-color: rgb(227, 242, 253);
  transition: margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
}
</style>