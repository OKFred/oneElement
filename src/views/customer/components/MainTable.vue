<template>
  <CommonTable :commonTableObj="tableObj">
    <template #extraMenus>
      <el-button type="success" size="mini" style="margin-left: 0px" plain @click="tableObj.handleAdd()">
        新增
      </el-button>
      <el-button
        type="danger"
        size="mini"
        style="margin-left: 0px"
        plain
        @click="() => tableObj.handleDelete(tableObj.selectedRows)"
        :disabled="tableObj.selectedRows && tableObj.selectedRows.length ? false : true"
      >
        删除
      </el-button>
    </template>
    <template #default>
      <el-table-column
        v-for="(columnObj, index) in tableObj.tableColumns.filter((obj) => !obj.hidden)"
        :key="columnObj.value + index"
        :label="columnObj.label"
        :prop="columnObj.value"
        :width="columnObj.width || ''"
        :min-width="columnObj.minWidth || ''"
        :fixed="columnObj.fixed || false"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span v-if="columnObj.plain">{{ scope.row[columnObj.value] }}</span>
          <a
            v-else-if="columnObj.label === '公司名'"
            @click.prevent="tableObj.handleRead(scope.row, scope.$index)"
            style="color: #249fea"
            class="link"
          >
            {{ scope.row[columnObj.value] }}
          </a>
          <span v-else-if="/跟进时间/.test(columnObj.label)">
            {{ scope.row[columnObj.value] }} ({{ new Date(scope.row[columnObj.value]).Delta() }})</span
          >
          <span v-else> {{ scope.row[columnObj.value] }} </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="100">
        <template slot-scope="scope">
          <el-button size="mini" @click="tableObj.handleEdit(scope.row, scope.$index)">编辑</el-button>
        </template>
      </el-table-column>
    </template>
  </CommonTable>
</template>

<script setup>
//模块引入
import { onMounted, reactive } from 'vue';
import CommonTable from '@/views/components/CommonTable.vue';

//父系入参
const props = defineProps({
  globalObj: Object,
  localObj: Object,
});

//本地变量和函数
let tableObj = reactive({
  tableRows: [],
  tableColumns: [],
  total: 0,
  currentPage: 1,
  pageSize: 5,
  selectedRows: [],
  loading: false,
  handleData,
  handleSelectionChange,
  handleCurrentPageChange,
  handlePageSizeChange,
  handleTotalChange,
  handleDelete,
  handleEdit,
  handleAdd,
  handleRead,
});

function handleSelectionChange(rowArr) {
  tableObj.selectedRows = rowArr;
} // ⭐选择行

async function handleCurrentPageChange(value) {
  console.log('当前页', value);
  tableObj.currentPage = value;
  handleData();
} // ⭐翻页

async function handlePageSizeChange(value) {
  console.log('页面大小', value);
  tableObj.pageSize = value;
  handleData();
} // ⭐改变页面大小

async function handleTotalChange(value) {
  // console.log('总页数', value);
  tableObj.total = value;
} // ⭐改变总页数

async function handleDeletePrecheck(...params) {
  let callback = () => {
    handleDelete(...params);
  };
  showModal({
    content: `删除后，相关数据将无法恢复，是否确定删除？`,
    isHTML: '',
    callback,
  });
} // ⭐ 删除前检查

async function handleDelete(rowArr, index) {
  console.log('行删除', index);
  if (!props.globalObj.modal.status) return handleDeletePrecheck(rowArr);
  tableObj.tableRows = tableObj.tableRows.filter(
    (rowObj) => !rowArr.find((rowDeletion) => rowObj.index === rowDeletion.index)
  );
  queryResult(true, '删除成功');
  props.globalObj.modal.status = false;
  // return setTimeout(handleData, 500);
} // ⭐处理行删除

async function handleEdit(rowObj, index) {
  console.log('行编辑', index);
  let dialogData = {
    title: '客户编辑',
    type: 'update',
  };
  let formData = { ...rowObj };
  props.localObj.mainDialogFn.showDialog(dialogData, formData);
} // ⭐处理行编辑

async function handleRead(rowObj, index) {
  console.log('行阅读任务', index);
  let formData = { ...rowObj };
  let dialogData = {
    title: '客户详情',
    type: 'read',
  };
  props.localObj.mainDialogFn.showDialog(dialogData, formData);
}

async function handleAdd() {
  let dialogData = {
    title: '新增客户',
    type: 'add',
  };
  let formData = {};
  props.localObj.mainDialogFn.showDialog(dialogData, formData);
} // ⭐处理新增记录

function handleData(obj) {
  if (!obj) return tableObj;
  Object.assign(tableObj, obj);
  return tableObj;
} // ⭐设置数据

async function newTable(obj) {
  handleData({ loading: true });
  let queryData = props.localObj.mainFilterFn.getQueryData();
  if (tableObj.pageSize) queryData.pageSize = tableObj.pageSize;
  if (tableObj.currentPage) queryData.pageNum = tableObj.currentPage;
  console.log('查询参数', queryData);
  await sleep(500); //等待
  let rowArr = [
    {
      companyName: 'Angel Align Limited',
      code: 'UK',
      lastSingleContactTime: '2022-08-16 17:59:00',
      lastMemo: '待进一步联系',
    },
    {
      companyName: 'Best Sale Online Co., Ltd.',
      code: 'FR',
      lastSingleContactTime: '2022-08-28 15:30:00',
      lastMemo: '需要介绍',
    },
    {
      companyName: 'Interesting No.1 LLC',
      code: 'US',
      lastSingleContactTime: '2022-08-21 22:33:00',
      lastMemo: '财大气粗',
    },
    {
      companyName: 'Royal Machine GMBH',
      code: 'DE',
      lastSingleContactTime: '2022-08-17 16:14:00',
      lastMemo: '优质客户',
    },
    {
      companyName: 'Italian Food Trade SRL',
      code: 'IT',
      lastSingleContactTime: '2022-08-25 16:42:00',
      lastMemo: '热情好客',
    },
    {
      companyName: 'hongfeng Food Co.,Ltd.',
      code: 'CN',
      lastSingleContactTime: '2022-08-25 09:39:00',
      lastMemo: '需要面谈',
    },
    {
      companyName: 'Financial handler SG Ltd',
      code: 'SG',
      lastSingleContactTime: '2022-08-26 10:10:00',
      lastMemo: '资金待就位',
    },
    {
      companyName: 'Cooling LED SARL',
      code: 'ES',
      lastSingleContactTime: '2022-08-21 17:55:00',
      lastMemo: '晚点联系',
    },
    {
      companyName: 'Canadian Honey Seller Co.',
      code: 'CA',
      lastSingleContactTime: '2022-08-29 07:59:00',
      lastMemo: '需要咨询',
    },
    {
      companyName: 'Japan Noodles',
      code: 'JP',
      lastSingleContactTime: '2022-08-28 13:36:00',
      lastMemo: '最近在出差',
    },
    {
      companyName: 'Thailand Fruit Trading',
      code: 'TH',
      lastSingleContactTime: '2022-08-11 11:23:00',
      lastMemo: '待开发',
    },
  ];
  if (obj) {
    let matchedIndex = rowArr.findIndex((rowObj) => rowObj.companyName === obj.companyName);
    if (matchedIndex !== -1) rowArr[matchedIndex] = obj;
    else rowArr.push({ ...obj, index: rowArr.length });
  }
  let tableRows = rowFormatter(rowArr);
  let total = rowArr.length;
  handleData({ tableRows, total, loading: false });
}

function rowFormatter(rowArr, obj) {
  let rows = [...rowArr];
  rows = rows.map((rowObj, index) => {
    let { code } = rowObj;
    if (code) {
      let { countryCN, timeZone = 0 } = window.CountryRegions.find((obj) => obj.code === code) || {};
      rowObj.countryCN = countryCN;
      rowObj.localTime = new Date(
        new Date().valueOf() + (new Date().getTimezoneOffset() - timeZone) * 60 * 1000
      ).Format('yyyy-MM-dd hh:mm:ss');
    }
    return {
      ...rowObj,
      index,
    };
  });
  if (obj) {
  }
  return rows;
}

function columnFormatter(obj) {
  let columns = [];
  if (true /*localObj.search.searchArea === 'private'*/) {
    columns = [
      { label: '#', value: 'index', width: 50 },
      { label: '公司名', value: 'companyName' },
      { label: '国家', value: 'countryCN' },
      { label: '当地时间', value: 'localTime' },
      { label: '跟进时间', value: 'lastSingleContactTime' },
      { label: '小记', value: 'lastMemo' },
    ];
  }
  if (obj) {
  }
  return handleData({ tableColumns: columns });
}

onMounted(() => {
  columnFormatter();
  newTable();
  props.localObj.setLocalObj({
    mainTableFn: {
      handleData,
      newTable,
    },
  }); //共享方法
});
</script>

<style scoped>
.link:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
