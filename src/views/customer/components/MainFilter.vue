<template>
  <!-- 主筛选 -->
  <div style="margin-bottom: 1em; display: flex">
    <CommonForm :commonFormObj="filterObj" />
  </div>
</template>

<script setup>
// 通用
import { reactive, onBeforeMount, getCurrentInstance } from 'vue';

// 模块引入 🚩
import CommonForm from '@/views/components/CommonForm.vue';

// 父系传参
const props = defineProps({
  globalObj: Object,
  localObj: Object,
});

// 本地变量和函数 🚩
async function init() {
  // 网络请求，获取一些数据
  getCountryRegionList();
  setTimeout(() => {
    filterObj.mainQuery.push(props.localObj.mainTableFn.newTable);
    filterObj.resetQuery.push(props.localObj.mainTableFn.newTable);
  }, 300);
} //初始化配置 🚩

async function getCountryRegionList() {
  // let queryMsg = await api.dataQuery();
  // let { status, result } = queryMsg.response;
  // if (!status) return queryResult(false, '查询失败');
  let dataObj = filterObj.selectItem.find((obj) => obj.label === '国家');
  let optionArr = [...window.CountryRegions].map((obj) => {
    return { ...obj, label: obj.countryCN, value: obj.code };
  });
  filterObj.CountryRegions = [...optionArr]; //与其他组件之间共享数据
  optionArr.unshift({ label: '全部', value: '' });
  dataObj.optionArr = optionArr;
  return;
}

let onFormChange = (() => {
  let fn = (...args) => {
    console.log(...args);
  };

  return {
    fn,
  };
})(); //表单值变化

function getQueryData() {
  let { queryTime } = filterObj.formData;
  if (queryTime) {
    let [startTime, endTime] = queryTime;
    filterObj.formData.startTime = new Date(startTime).Format('yyyy-MM-dd hh:mm:ss');
    filterObj.formData.endTime = new Date(endTime).Format('yyyy-MM-dd hh:mm:ss');
  }
  return { ...filterObj.formData };
} // 获取表单

function handleData(obj) {
  if (!obj) return filterObj;
  Object.assign(filterObj, obj);
} // ⭐设置筛选

let filterObj = reactive({
  formName: 'mainFilter',
  formData: {}, //表单数据
  inline: true, // 是否为行内表单
  rules: {},
  mainQuery: [], //主查询条件
  resetQuery: [],
  dateItem: [
    {
      name: 'queryTime',
      value: [],
      label: '日期范围',
      type: 'datetimerange',
      row: 1,
      col: 1,
      span: 3,
      onChange: onFormChange.fn,
    },
  ],
  selectItem: [
    {
      name: 'code',
      value: '',
      label: '国家',
      optionArr: [],
      row: 1,
      col: 5,
      span: 4,
      onChange: onFormChange.fn,
    },
  ],
  inputItem: [
    {
      name: 'lastMemo',
      value: '',
      label: '搜索',
      placeholder: '搜索小记关键词',
      row: 1,
      col: 9,
      span: 4,
      onChange: onFormChange.fn,
    },
  ],
});

onBeforeMount(() => {
  init();
  props.localObj.setLocalObj({
    mainFilterFn: {
      getQueryData,
      handleData,
    },
  }); //共享方法
});
</script>
