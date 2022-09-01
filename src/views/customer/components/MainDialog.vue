<template>
  <!-- 对话框 -->
  <el-dialog
    :title="dialogObj.title"
    :visible.sync="dialogObj.visible"
    @close="dialogObj.onDialogClose"
    width="66%"
    center
  >
    <div v-if="dialogObj.type === 'read'">
      <div class="grid-two-columns">
        <span v-for="(valueArr, label) in dialogObj.readDialog" :key="label">
          {{ label }}：<span>{{ valueArr.map((value) => dialogObj.formObj.formData[value]).join(' 至 ') }}</span>
        </span>
      </div>
    </div>
    <div v-else-if="dialogObj.type === 'update' || dialogObj.type === 'add'">
      <CommonForm :commonFormObj="dialogObj.formObj" :ref="dialogObj.formName" />
      <div class="grid-two-columns">
        <span v-for="(valueArr, label) in dialogObj.editDialog" :key="label">
          {{ label }}：<span>{{ valueArr.map((value) => dialogObj.formObj.formData[value]).join(' 至 ') }}</span>
        </span>
      </div>
      <slot v-bind:localObj="localObj" name="StockInDetailTable">
        <!-- <span>表格</span> -->
      </slot>
    </div>
    <div v-else-if="dialogObj.type === 'stop'"></div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogObj.onDialogOk" :style="dialogObj.status ? `` : `filter: grayscale(30%)`" type="primary">
        确 定
      </el-button>
      <el-button @click="dialogObj.onDialogCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script setup>
// 通用

//模块引入
import { onBeforeMount, reactive, getCurrentInstance } from 'vue';
import CommonForm from '@/views/components/CommonForm.vue';

//父系入参
const props = defineProps({
  globalObj: Object,
  localObj: Object,
});

// 本地变量和函数 🚩
let { $refs } = getCurrentInstance().proxy;

let validator = (rule, value, callback) => {
  console.log('表单验证', value);
  let { field, required } = rule;
  /* 通用规则 */
  let checkResult = () => {
    if (required && value === undefined) return callback('不能为空');
    if (!/^\S/.test(value)) return callback('不能以空格开头');
    /* 个性规则 */
    if (field === 'title') {
      if (value.length > 128) return callback('字符长度超限');
    } else if (field === 'queryTime') {
      if (value.find((str) => !str)) return callback('请输入日期');
    }
    return true;
  };
  let formResult = checkResult();
  if (!formResult) return false;
  callback();
  return true;
}; //表单验证

let onFormChange = (() => {
  let fn = async (...args) => {
    console.log(...args);
  };

  return {
    fn,
  };
})(); //表单值变化

async function onFormSubmit(finalFormObj, type) {
  let msg = type === 'add' ? '新增' : type === 'update' ? '更新' : '结束';
  props.localObj.mainTableFn.newTable(finalFormObj);
  queryResult(true, msg + '成功');
}

function onFormValidate(formName, callback) {
  let formRef = $refs[formName].$children.find((obj) => typeof obj.validate === 'function');
  return formRef ? formRef.validate(callback) : false;
} //表单验证全部

function onDialogCancel() {
  Object.assign(dialogObj, { formObj: { formData: {}, rules: {} }, visible: false, status: undefined });
  if (dialogObj.type === 'update') {
    let { formName } = dialogObj;
    let formRef = $refs[formName].$children.find((obj) => typeof obj.clearValidate === 'function');
    return formRef ? formRef.clearValidate() : false;
  }
}

function onDialogClose() {
  if (dialogObj.status === undefined) return onDialogCancel();
} //表单关闭

function onDialogOk() {
  let { visible, status, type, formName, formObj } = dialogObj;
  if (type === 'read') {
    status = undefined;
    visible = false;
    Object.assign(dialogObj, { visible, status });
    return;
  } else if (type === 'update' || type === 'add') {
    let callback = (valid) => {
      let status, visible; // 表单结果和对话框显示状态
      let finalFormObj = { ...formObj.formData };
      let { lastSingleContactTime } = finalFormObj;
      if (valid) {
        /* 清除不需要的数据 */
        /* 数据转换 */
        if (lastSingleContactTime) {
          finalFormObj.lastSingleContactTime = new Date(lastSingleContactTime).Format('yyyy-MM-dd hh:mm:ss');
        }
        /* 写入并返回 */
        status = true;
        visible = false;
        console.log(status, '表单OK', finalFormObj);
        onFormSubmit(finalFormObj, type);
      } else {
        status = false;
        visible = true;
        console.log(status, '表单无效');
      }
      Object.assign(dialogObj, { visible, status });
      return;
    };
    return onFormValidate(formName, callback);
  }
} // 表单提交

// 对外输出 🚩
async function showDialog(dialogData, formData) {
  if (dialogObj.visible) return false; // 当前已经有对话框了
  let { formObj } = dialogObj;
  let { type } = dialogData;
  if (type === 'read') {
  } else if (type === 'update' || type === 'add') {
    formObj = { ...dialogObj.editForm };
  } else if (type === 'stop') {
    formObj = { ...dialogObj.stopForm };
  }
  formObj.formData = formData;
  Object.assign(dialogObj, { formObj, ...dialogData, visible: true });
} // 打开对话框

let dialogObj = reactive({
  title: '对话框',
  visible: false, //对话框显示状态
  type: '', //对话框类型：详情，新增，编辑，结束
  status: undefined, //表单结果：成功，失败，未定义
  readDialog: {
    //查看详情时显示的内容
    公司名: ['companyName'],
    国家: ['countryCN'],
    当地时间: ['localTime'],
    跟进时间: ['lastSingleContactTime'],
    小记: ['lastMemo'],
  },
  editDialog: {
    //编辑时显示的内容
  },
  stopDialog: {
    //结束时显示的内容
  },
  formName: 'StockInForm', //表单名称
  formObj: {
    formData: {}, //UI返回的表单数据
    rules: {},
  },
  editForm: {
    formData: {}, //表单数据
    rules: {
      companyName: [{ validator, required: true, trigger: 'blur' }],
      code: [{ validator, required: true, trigger: 'blur' }],
      lastSingleContactTime: [{ validator, required: true, trigger: 'blur' }],
      lastMemo: [{ validator, required: true, trigger: 'blur' }],
    }, //表单验证规则
    selectItem: [
      {
        name: 'code',
        label: '国家',
        optionArr: [],
        row: 1,
        span: 6,
        onChange: onFormChange.fn,
      },
    ],
    dateItem: [
      {
        name: 'lastSingleContactTime',
        label: '跟进时间',
        type: 'datetime',
        row: 2,
        span: 6,
        onChange: onFormChange.fn,
      },
    ],
    inputItem: [
      {
        name: 'companyName',
        label: '公司名',
        placeholder: '请输入公司名',
        row: 1,
        col: 7,
        span: 6,
        onChange: onFormChange.fn,
      },
      {
        name: 'lastMemo',
        label: '小记',
        placeholder: '请输入小记',
        row: 2,
        col: 7,
        span: 6,
        onChange: onFormChange.fn,
      },
    ],
  },
  stopForm: {},
  onDialogOk,
  onDialogCancel,
  onDialogClose,
});

function mappingOptions() {
  let { optionArr } = dialogObj.editForm.selectItem[0];
  optionArr = [...window.CountryRegions].map((obj) => {
    return {
      ...obj,
      label: obj.countryCN,
      value: obj.code,
    };
  });
  dialogObj.editForm.selectItem[0].optionArr = optionArr;
}

onBeforeMount(() => {
  mappingOptions();
  props.localObj.setLocalObj({
    mainDialogFn: {
      showDialog,
    },
  }); //共享方法
});
</script>

<style scoped>
.grid-two-columns {
  display: grid;
  grid-template-columns: auto auto;
  gap: 0.5em;
  align-items: center;
}
</style>