<template>
  <div class="frame-header">
    <!-- 图标&文字 -->
    <span class="frame-logo"><i class="el-icon-s-shop" />ERP</span>
    <i
      v-if="props.globalObj.login.hasLogin"
      class="frame-sidebar-toggle el-icon-d-arrow-left"
      :style="{ transform: globalObj.sidebar.collapse ? 'rotate(180deg)' : 'rotate(0deg)' }"
      @click="toggleSidebar"
    />
    <!-- 搜索 -->
    <el-input
      class="frame-search"
      :placeholder="langPack.search.placeholder"
      size="medium"
      v-model="localObj.searchValue"
      @change="onSearch"
    >
      <el-button slot="append" icon="el-icon-search" />
    </el-input>
    <!-- 设置&头像 -->
    <div class="frame-setting">
      <el-avatar
        v-if="props.globalObj.login.hasLogin"
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      >
        <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
        <!-- fallback image -->
      </el-avatar>
      <img :src="svgURL" :style="localObj.svg.str" class="frame-setting-icon" alt="my-logo" @click="toggleSetting" />
    </div>
    <div class="frame-setting-panel" :style="{ width: localObj.panel.width }" @click="toggleSetting">
      <h2>设置 settings</h2>
      <hr />
      <div style="display: flex; flex-direction: column">
        <span @click.prevent="(e) => e.stopPropagation()">
          <el-switch
            v-model="localObj.switch.language"
            :active-text="localObj.switch.language ? '中文' : 'English'"
            @change="toggleLocale"
          />
          {{ langPack.settings.language }}
        </span>
        <br />
        <span @click.prevent="(e) => e.stopPropagation()">
          <el-switch
            v-model="localObj.switch.rightClick"
            :active-text="localObj.switch.rightClick ? langPack.confirm.enable : langPack.confirm.disable"
            @change="toggleRightClick"
          />
          {{ langPack.settings.rightClick }}
        </span>
        <br />
        <span @click.prevent="(e) => e.stopPropagation()">
          <el-switch
            v-model="localObj.switch.mode"
            :active-text="localObj.switch.mode ? langPack.confirm.enable : langPack.confirm.disable"
            @change="toggleMode"
          />
          {{ langPack.settings.mode }}
        </span>
        <el-button
          type="primary"
          size="large"
          style="bottom: 5px; position: absolute"
          v-show="globalObj.login.hasLogin"
          @click="goLogin(true)"
        >
          {{ langPack.settings.logout }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
//模块引入
import { reactive, watch, computed, onMounted, onActivated, onDeactivated } from 'vue';
import svgURL from '@/assets/setting.svg';

//父系入参
let props = defineProps({
  globalObj: Object,
  langPack: Object,
});

//本地变量和函数
let localObj = reactive({
  searchValue: '',
  name: 'setting',
  panel: {
    width: '0px',
  },
  switch: {
    language: true, //zhCN-enUS
    rightClick: true, //是否禁用右键菜单
    mode: false,
  },
  svg: {
    timer: '',
    deg: 0,
    str: `transform: rotate(360deg); translateZ(0px);`,
  },
});

onMounted(() => {
  settingSpinning();
});
onDeactivated(() => {
  console.log('setting: 已关闭');
  clearInterval(localObj.svg.timer);
});

function settingSpinning() {
  if (localObj.svg.timer !== '') clearInterval(localObj.svg.timer);
  localObj.svg.timer = setInterval(() => {
    localObj.svg.deg =
      localObj.svg.deg < 200
        ? localObj.svg.deg + 9
        : localObj.svg.deg < 300
        ? localObj.svg.deg + 6
        : localObj.svg.deg < 360
        ? localObj.svg.deg + 3
        : 0;
    localObj.svg.str = `transform: rotate(${localObj.svg.deg}deg); translateZ(0px);`;
  }, 50);
}

function toggleSidebar() {
  let collapse = !props.globalObj.sidebar.collapse;
  props.globalObj.setSidebar({ collapse });
} //侧边栏收起展开

function onSearch(value) {
  console.log('搜索了:', value);
} //搜索

function toggleSetting() {
  let panelWidth = props.globalObj.display.breaked ? '50%' : '30%';
  localObj.panel.width = localObj.panel.width === '0px' ? panelWidth : '0px';
} //切换设置面板

function toggleLocale() {
  props.globalObj.locale.language == 'zhCN'
    ? props.globalObj.setLocale({ language: 'enUS' })
    : props.globalObj.setLocale({ language: 'zhCN' });
} //切换语言

function toggleRightClick() {
  props.globalObj.display.rightClick
    ? props.globalObj.setDisplay({ rightClick: false })
    : props.globalObj.setDisplay({ rightClick: true });
} //切换右键菜单

function toggleMode() {
  props.globalObj.display.mode
    ? props.globalObj.setDisplay({ mode: false })
    : props.globalObj.setDisplay({ mode: true });
} //切换工作模式

async function goLogin(logout) {
  console.log('手动登出');
  //if (logout) await //doLogout()
  props.globalObj.setTab({
    currentTab: 'login',
  });
}
</script>

<style>
.frame-header {
  position: fixed;
  display: flex;
  align-items: center;
  width: 100%;
  height: 70px;
  z-index: 1080;
  background-color: var(--text-light);
}
.frame-logo {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 10px;
  font-size: 2.5em;
  color: cornflowerblue;
}
.frame-search {
  width: 50% !important;
  margin-left: 20px;
  transition: padding 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
}

.frame-setting {
  display: flex;
  position: fixed;
  right: 20px;
  flex-direction: row;
  align-items: center;
  align-content: center;
  background-color: rgb(227, 242, 253);
  border-radius: 30px;
  height: 50px;
  padding-left: 50px;
  padding-right: 50px;
}

.frame-setting-icon {
  margin-left: 10px;
}

.frame-setting-panel {
  position: fixed;
  right: 0px;
  top: 75px;
  height: 75%;
  transition: margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  z-index: 1100;
  background-color: #fff;
  opacity: 0.9;
  transition: width ease-in-out 225ms;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 10px -5px, rgba(0, 0, 0, 0.14) 0px 16px 24px 2px,
    rgba(0, 0, 0, 0.12) 0px 6px 30px 5px;
}
</style>