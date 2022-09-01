<template>
  <div style="border: 1px solid gainsboro; border-radius: 5px; padding: 5px; background-color: white">
    <!-- 工具栏 -->
    <div v-if="commonTableObj.currentPage && !commonTableObj.readOnly && !commonTableObj.toolbarHidden">
      <div name="menus" style="display: grid; gap: 5px; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr))">
        <el-button
          type="primary"
          size="mini"
          plain
          icon="el-icon-s-operation"
          @click="localObj.columnSelectorFn.toggleDisplay($refs['columnSelector'].$el)"
        >
          列
        </el-button>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-search"
          plain
          style="margin-left: 0px"
          @click="localObj.rowFilterFn.toggleDisplay()"
        >
          筛选器
        </el-button>
        <el-dropdown type="primary" size="mini" ref="densityDropdown" @command="(c) => (localObj.rowDensity = c)">
          <el-button type="primary" size="mini" plain style="width: 100%">
            <i class="el-icon-c-scale-to-original" />表格密度<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item style="width: 10em" command="">||紧密||</el-dropdown-item>
            <el-dropdown-item style="width: 10em" command="comfortable" divided>* 宽 松 *</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown type="primary" size="mini" ref="exportDropdown" @command="localObj.handleExportCommand">
          <el-button type="primary" size="mini" plain style="width: 100%">
            <i class="el-icon-download" />导出<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item style="width: 10em" command="excel">导出为EXCEL表格</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <slot v-bind:commonTableObj="commonTableObj" name="extraMenus">
          <!-- <span>自定义菜单</span> -->
        </slot>
      </div>
      <div style="padding-top: 5px" />
      <div name="tools" style="display: flex">
        <el-select
          ref="columnSelector"
          v-show="localObj.columnSelector.display"
          v-model="localObj.columnSelector.columns"
          @visible-change="(visible) => (!visible ? (localObj.columnSelector.display = false) : '')"
          @change="localObj.columnSelectorFn.onColumnSelected(commonTableObj)"
          placeholder="请选择列"
          size="mini"
          multiple
          filterable
          clearable
          collapse-tags
        >
          <el-option value="" :disabled="localObj.columnSelector.columns.length === commonTableObj.tableColumns.length">
            <b>全选</b>
          </el-option>
          <el-option
            v-for="{ value, label } in commonTableObj.tableColumns"
            :key="value"
            :value="value"
            :label="label"
          />
        </el-select>
        <el-select
          ref="rowFilterCol"
          v-show="localObj.rowFilter.display"
          v-model="localObj.rowFilter.columnSelected"
          @change="localObj.rowFilterFn.onColumnSelected"
          placeholder="请选择列"
          size="mini"
        >
          <el-option
            v-for="{ value, label } in commonTableObj.tableColumns"
            :key="value"
            :value="value"
            :label="label"
          />
        </el-select>
        <el-select
          ref="rowFilterRule"
          v-show="localObj.rowFilter.display"
          v-model="localObj.rowFilter.ruleSelected"
          @change="localObj.rowFilterFn.onRuleChange"
          placeholder="请选择条件"
          size="mini"
        >
          <el-option
            v-for="{ value, label } in localObj.rowFilter.ruleArr"
            :key="value"
            :value="value"
            :label="label"
          />
        </el-select>
        <el-input
          v-show="localObj.rowFilter.display"
          v-model="localObj.rowFilter.keyword"
          @change="localObj.rowFilterFn.onFiltering"
          ref="rowFilterInput"
          placeholder="筛选值"
          prefix-icon="el-icon-search"
          size="mini"
        />
      </div>
    </div>

    <!-- 表格主体 -->
    <el-table
      ref="commonTable"
      v-loading="commonTableObj.loading"
      :data="commonTableObj.tableRows"
      :max-height="commonTableObj.tableHeight || localObj.rowDensity === 'comfortable' ? '' : '310'"
      :row-style="{ height: localObj.rowDensity === 'comfortable' ? '5em' : 'auto' }"
      @selection-change="localObj.selectionFn.handleChange"
      highlight-current-row
    >
      <el-table-column type="selection" width="55" fixed="left" v-if="!commonTableObj.selectionHidden" />
      <slot>
        <el-table-column label="raw_data">
          <template slot-scope="{ row }">
            {{ row }}
          </template>
        </el-table-column>
      </slot>
    </el-table>

    <!-- 分页 -->
    <div
      v-if="commonTableObj.currentPage && !commonTableObj.readOnly"
      style="display: flex; align-items: center; justify-content: flex-end"
    >
      <el-pagination
        style="margin-top: 0px"
        background
        layout="total, prev, pager, next, jumper"
        :current-page.sync="commonTableObj.currentPage"
        :page-sizes="[5, 25, 50, 100]"
        :page-size="commonTableObj.pageSize"
        :total="commonTableObj.total"
        @size-change="commonTableObj.handlePageSizeChange"
        @current-change="commonTableObj.handleCurrentPageChange"
      />
    </div>
  </div>
</template>

<script setup>
// 通用
import { reactive, watch, getCurrentInstance } from 'vue';

// 模块引入
import * as FileSaver from 'file-saver';
const ExcelJS = require('exceljs');

// 父系传参
const props = defineProps({
  commonTableObj: Object
});

// 本地变量和函数
const { $refs } = getCurrentInstance().proxy;

let columnSelectorFn = (() => {
  function init(commonTableObj) {
    let { tableColumns } = commonTableObj;
    localObj.columnSelector.columns = tableColumns.map((obj) => obj.value) || [];
  }
  function onColumnSelected(commonTableObj) {
    let { tableColumns } = commonTableObj;
    tableColumns.forEach((obj) => (obj.hidden = true));
    let selectAll = () => {
      tableColumns.forEach((obj) => (obj.hidden = false));
      init(commonTableObj);
    };
    let selectOne = (columnName) => (tableColumns.find((obj) => obj.value === columnName).hidden = false);
    for (let columnName of localObj.columnSelector.columns) {
      if (!columnName) {
        selectAll();
        break;
      } //全选了
      selectOne(columnName);
    }
    if (typeof props.commonTableObj.handleData === 'function') return props.commonTableObj.handleData({ tableColumns });
    return console.log('选择列无回调函数');
  }

  function toggleDisplay(thisElement) {
    let func = localObj.columnSelector.display ? 'blur' : 'click';
    thisElement[func]();
    localObj.columnSelector.display = !localObj.columnSelector.display;
    localObj.rowFilter.display = false;
  }

  return {
    init,
    onColumnSelected,
    toggleDisplay
  };
})(); //列选择器

let rowFilterFn = (() => {
  function init(commonTableObj) {
    let { tableColumns } = commonTableObj;
    localObj.rowFilter.columnSelected = tableColumns.length ? tableColumns[0].value : '';
  }
  function onColumnSelected() {
    return onFiltering();
  }

  function toggleDisplay() {
    localObj.columnSelector.display = false;
    localObj.rowFilter.display = !localObj.rowFilter.display;
  }

  function onRuleChange(rule) {
    localObj.rowFilter.ruleSelected = rule;
    onFiltering();
  }

  function onFiltering() {
    let { columnSelected, ruleSelected, keyword } = localObj.rowFilter;
    if (!keyword) return;
    let rowArr = [];
    let reg; //表达式
    let positive = true; //取正取反
    if (ruleSelected === '等于') {
      reg = new RegExp('^' + keyword + '$', 'gi');
    } else {
      reg = new RegExp(keyword, 'gi');
      if (ruleSelected === '排除') positive = false;
    }
    props.commonTableObj.tableRows.forEach((rowObj) => {
      let word = rowObj[columnSelected];
      if (reg.test(word) === positive) rowArr.push(rowObj);
      reg.lastIndex = 0; //重置正则
    });
    selectionFn.changeSelection(rowArr);
  }

  return {
    init,
    onColumnSelected,
    toggleDisplay,
    onFiltering,
    onRuleChange
  };
})(); //行筛选器

let selectionFn = (() => {
  function changeSelection(rowArr) {
    $refs['commonTable'].clearSelection(); //elementUI fn
    rowArr.forEach((rowObj) => {
      $refs['commonTable'].toggleRowSelection(rowObj, true); //elementUI fn
    });
  }

  function handleChange(rowArr) {
    localObj.selectedRowArr = rowArr;
    if (typeof props.commonTableObj.handleSelectionChange === 'function') {
      return props.commonTableObj.handleSelectionChange(rowArr);
    }
    if (rowArr.length) return console.log('已选中' + rowArr.length + '行');
  }
  return {
    changeSelection,
    handleChange
  };
})(); //勾选行

function handleExportCommand(command) {
  return command === 'excel'
    ? localObj.handleExport(props.commonTableObj.tableColumns, props.commonTableObj.tableRows)
    : '';
}

async function handleExport(tableColumns, tableRows) {
  if (typeof props.commonTableObj.handleExport === 'function') {
    return props.commonTableObj.handleExport(props.commonTableObj.tableColumns, props.commonTableObj.tableRows);
  }
  let rowArr = localObj.selectedRowArr.length ? localObj.selectedRowArr : tableRows; //导出全部还是导出勾选的
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ExcelJS';
  workbook.lastModifiedBy = 'nobody';
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();
  workbook.properties.date1904 = true;
  workbook.calcProperties.fullCalcOnLoad = true; // 在加载时强制工作簿计算属性
  const worksheet = workbook.addWorksheet('sheet', { properties: { tabColor: { argb: 'FF00FF00' } } });
  worksheet.columns = tableColumns.map((obj) => {
    return {
      header: obj.label,
      key: obj.value,
      style: { font: { bold: true } }
    };
  });
  rowArr.forEach((rowObj, index) => {
    let row = worksheet.addRow(rowObj);
    row.font = { bold: false };
    /*     row.fill =
      index && index % 2 === 1
        ? { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFCC' } }
        : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFF' } }; */
  });
  // 写入 buffer
  return workbook.xlsx
    .writeBuffer()
    .then((buffer) => FileSaver.saveAs(new Blob([buffer]), '表格_' + new Date().Format('MMdd') + '.xlsx'))
    .catch((err) => console.warn('表格导出失败', err));
}

let localObj = reactive({
  rowDensity: '',
  selectedRowArr: [],
  columnSelector: {
    display: false,
    columns: []
  },
  columnSelectorFn,
  rowFilter: {
    display: false, //是否显示菜单
    columnSelected: '', //需要显示的列
    ruleArr: [
      { value: '包含', label: '包含' },
      { value: '排除', label: '排除' },
      { value: '等于', label: '=' }
    ], //条件选项
    ruleSelected: '包含', //选中的条件
    keyword: '' //关键词
  },
  rowFilterFn,
  selectionFn,
  handleExportCommand,
  handleExport
});

watch(
  () => props.commonTableObj.tableColumns,
  (newValue, oldValue) => {
    if (Array.isArray(newValue) && newValue.length !== oldValue.length) {
      localObj.columnSelectorFn.init(props.commonTableObj);
      localObj.rowFilterFn.init(props.commonTableObj);
    }
  } //列调整则更新工具栏的相关数据
);

/* commonTableObj : {
  loading: false,
  tableColumns: [],
  tableRows: [],
  hideSelection,
  handleSelectionChange: () => {},
  handleExport: () => {},
  handleData: () => {}
}; */
</script>
