<template>
  <div>
    <el-dialog :title="globalObj.modal.title" :visible.sync="globalObj.modal.visible" @close="onClose" center>
      <div v-if="globalObj.modal.htmlContent" v-html="globalObj.modal.htmlContent" />
      <div v-if="globalObj.modal.content">{{ globalObj.modal.content }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
//模块引入
import { onBeforeMount } from 'vue';

//父系入参
let props = defineProps({
  globalObj: Object,
});

//本地变量和函数
function showModal({ content, title, isHTML = true, callback }) {
  console.log({ content, title, isHTML, callback });
  if (props.globalObj.modal.visible) return false; // 当前已经有对话框了
  let obj = { status: undefined }; // 初始化
  const modalContent = typeof content === 'object' ? JSON.stringify(content) : content;
  const modalTitle = title !== undefined ? title : '对话框';
  obj = { ...obj, title: modalTitle };
  if (isHTML) {
    obj = { ...obj, htmlContent: modalContent };
    obj = { ...obj, content: '' };
  } else {
    obj = { ...obj, htmlContent: '' };
    obj = { ...obj, content: modalContent };
  }
  obj = { ...obj, visible: true, callback };
  props.globalObj.setModal(obj);
}

// 本地变量和函数
function onOk() {
  props.globalObj.setModal({ status: true, visible: false });
  console.log('对话框回复', props.globalObj.modal.status);
  let { callback } = props.globalObj.modal;
  if (callback && typeof callback === 'function') callback();
}
function onCancel() {
  props.globalObj.setModal({ status: false, visible: false });
  console.log('对话框回复', props.globalObj.modal.status);
}
function onClose() {
  if (props.globalObj.modal.status === undefined) return onCancel();
}

window.showModal = showModal; // ⭐全局函数

onBeforeMount(() => {
  props.globalObj.setModal({
    title: '',
    content: '',
    htmlContent: '',
    visible: false,
    status: false,
    callback: undefined,
  });
});
</script>
