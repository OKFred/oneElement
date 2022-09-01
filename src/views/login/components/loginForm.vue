<template>
  <el-row type="flex">
    <el-col :xs="1" :sm="1" :md="6" :lg="6" :xl="8"></el-col>
    <el-col :xs="22" :sm="22" :md="12" :lg="12" :xl="8">
      <CommonForm :commonFormObj="localObj" :ref="localObj.formName" />
      <el-button type="primary" size="small" @click="localObj.onFormSubmit">{{ langPack.form.submit }}</el-button>
      <el-button type="danger" size="small" @click="localObj.onFormReset">{{ langPack.form.reset }}</el-button>
    </el-col>
    <el-col :xs="1" :sm="1" :md="6" :lg="6" :xl="8"></el-col>
  </el-row>
</template>

<script setup>
//模块引入
import { reactive, watch, computed, onDeactivated, getCurrentInstance } from 'vue';
import languages from '@/views/login/languages.js';
import CommonForm from '@/views/components/CommonForm.vue';

//父系入参
let props = defineProps({
  globalObj: Object,
  langPack: Object,
});

//本地变量和函数
let { $refs } = getCurrentInstance().proxy;

let validator = (rule, value, callback) => {
  console.log('表单验证', value);
  let { field, required } = rule;
  /* 通用规则 */
  let checkResult = () => {
    if (required && value === undefined) return callback('不能为空');
    if (value.length > 128) return callback('字符长度超限');
    if (!/^\S/.test(value)) return callback('不能以空格开头');
    /* 个性规则 */
    if (field === 'email') {
      if (!/^.{1,30}@.{5,30}$/.test(value)) return callback('邮箱格式不正确');
    }
    return true;
  };
  let formResult = checkResult();
  if (!formResult) return false;
  callback();
  return true;
}; //表单验证

let localObj = reactive({
  formName: 'loginForm',
  formData: {
    username: '',
    pwd: '',
    email: '',
    tel: '',
    keep: false,
  },
  inputItem: [
    { name: 'username', placeholder: props.langPack.form.username, row: 1, onChange: () => {} },
    { name: 'pwd', placeholder: props.langPack.form.pwd, type: 'password', row: 2, onChange: () => {} },
    { name: 'email', placeholder: props.langPack.form.email, row: 3, onChange: () => {} },
    { name: 'tel', placeholder: props.langPack.form.tel, row: 4, onChange: () => {} },
  ],
  checkboxItem: [{ name: 'keep', label: props.langPack.form.keep, row: 5, onChange: () => {} }],
  rules: {
    // username: [{ validator, required: true, trigger: 'blur' }],
    // pwd: [{ validator, required: true, trigger: 'blur' }],
    // email: [{ validator, required: true, trigger: 'blur' }],
    // tel: [{ validator, required: true, trigger: 'blur' }],
  },
  onFormSubmit,
  onFormReset,
});

watch(
  () => props.langPack,
  (newValue, oldValue) => {
    localObj.inputItem.forEach((obj) => {
      obj.placeholder = props.langPack.form[obj.name];
    });
    localObj.checkboxItem.forEach((obj) => {
      obj.label = props.langPack.form[obj.name];
    });
  }
);

onDeactivated(() => {
  props.globalObj.checkBreakPoint();
});

function onFormSubmit() {
  let { formName, formData } = localObj;
  let finalFormObj = { ...formData };
  let callback = (valid) => {
    if (valid) {
      /* 清除不需要的数据 */
      /* 数据转换 */
      /* 写入并返回 */
      console.log('%c' + '登录成功', 'color: forestgreen');
      doLogin(finalFormObj);
    } else {
      console.log('%c' + '登录失败:', 'color: red');
    }
    console.log({ ...finalFormObj });
  };
  return onFormValidate(formName, callback);
} // 表单提交

function onFormValidate(formName, callback) {
  let formRef = $refs[formName].$children.find((obj) => typeof obj.validate === 'function');
  return formRef ? formRef.validate(callback) : false;
} //表单验证全部

async function doLogin(obj) {
  let loginResult = Promise.resolve(Math.random() > 0.5);
  if (loginResult) {
    setTimeout(() => {
      props.globalObj.setLogin({ hasLogin: true, loginInfo: loginResult });
    }, 1000);
    queryResult(true, props.langPack.form.loginSuccess);
  } else {
    props.globalObj.setLogin({ hasLogin: false, loginInfo: {} });
    queryResult(false, props.langPack.form.loginFailed);
  }
}

function onFormReset() {
  console.log('清空表单');
  localObj.formData = { keep: true };
}
</script>
