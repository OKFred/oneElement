<template>
  <el-form
    :model="commonFormObj.formData"
    :rules="commonFormObj.rules"
    style="
      display: grid;
      grid-template-columns: auto auto auto auto auto auto auto auto auto auto auto auto;
      gap: 0.3em;
      width: 100%;
      max-height: 50vh;
      overflow: auto;
      align-items: end;
    "
    status-icon
  >
    <el-form-item
      v-for="(obj, index) in commonFormObj.inputItem"
      v-show="!obj.hidden"
      :key="obj.name + index"
      :label="obj.label"
      :prop="obj.name"
      :style="{
        'grid-area': `${obj.row} / ${obj.col || 1} / span 1 / span ${obj.span || 12}`,
        display: commonFormObj.inline ? 'flex' : 'block',
        'flex-wrap': 'wrap',
        'align-items': 'flex-end'
      }"
    >
      <el-input
        v-model="commonFormObj.formData[obj.name]"
        :placeholder="obj.placeholder"
        :type="obj.type || 'input'"
        @change="obj.onChange"
        :show-password="obj.type === 'password'"
      />
    </el-form-item>
    <el-form-item
      v-for="(obj, index) in commonFormObj.checkboxItem"
      v-show="!obj.hidden"
      :key="obj.name + index"
      :prop="obj.name"
      :style="{
        'grid-area': `${obj.row} / ${obj.col || 1} / span 1 / span ${obj.span || 12}`,
        display: commonFormObj.inline ? 'flex' : 'block',
        'flex-wrap': 'wrap',
        'align-items': 'flex-end'
      }"
    >
      <el-checkbox v-model="commonFormObj.formData[obj.name]" @change="obj.onChange">{{ obj.label }}</el-checkbox>
    </el-form-item>
    <el-form-item
      v-for="(obj, index) in commonFormObj.selectItem"
      v-show="!obj.hidden"
      :key="obj.name + index"
      :label="obj.label"
      :prop="obj.name"
      :style="{
        'grid-area': `${obj.row} / ${obj.col || 1} / span 1 / span ${obj.span || 12}`,
        display: commonFormObj.inline ? 'flex' : 'block',
        'flex-wrap': 'wrap',
        'align-items': 'flex-end'
      }"
    >
      <el-select
        v-model="commonFormObj.formData[obj.name]"
        :name="obj.name"
        :placeholder="obj.placeholder"
        style="width: 100%"
        :multiple="obj.multiple || false"
        :collapse-tags="obj.multiple || false"
        @change="obj.onChange"
      >
        <el-option v-for="option in obj.optionArr" :key="option.value" :label="option.label" :value="option.value" />
      </el-select>
    </el-form-item>
    <el-form-item
      v-for="(obj, index) in commonFormObj.categoryItem"
      v-show="!obj.hidden"
      :key="obj.name + index"
      :label="obj.label"
      :prop="obj.name"
      :style="{
        'grid-area': `${obj.row} / ${obj.col || 1} / span 1 / span ${obj.span || 12}`,
        display: commonFormObj.inline ? 'flex' : 'block',
        'flex-wrap': 'wrap',
        'align-items': 'flex-end'
      }"
    >
      <el-cascader
        v-model="commonFormObj.formData[obj.name]"
        :placeholder="obj.placeholder"
        :options="obj.optionArr"
        :props="{ multiple: obj.multiple || false }"
        @change="obj.onChange"
        style="width: 100%"
        filterable
        clearable
      />
    </el-form-item>
    <el-form-item
      v-for="(obj, index) in commonFormObj.dateItem"
      v-show="!obj.hidden"
      :key="obj.name + index"
      :label="obj.label"
      :prop="obj.name"
      :style="{
        'grid-area': `${obj.row} / ${obj.col || 1} / span 1 / span ${obj.span || 12}`,
        display: commonFormObj.inline ? 'flex' : 'block',
        'flex-wrap': 'wrap',
        'align-items': 'flex-end'
      }"
    >
      <el-date-picker
        v-if="/range/gi.test(obj.type)"
        v-model="commonFormObj.formData[obj.name]"
        @change="obj.onChange"
        :type="obj.type"
        style="width: 100%"
        range-separator="至"
        :start-placeholder="/time/gi.test(obj.type) ? '开始时间' : '开始日期'"
        :end-placeholder="/time/gi.test(obj.type) ? '结束时间' : '结束日期'"
        :value-format="/time/gi.test(obj.type) ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'"
        :picker-options="{
          shortcuts: [
            {
              text: '未来一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '未来一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '过去一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '过去一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(end.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }
          ]
        }"
      />
      <el-time-picker
        v-else-if="obj.type === 'time'"
        v-model="commonFormObj.formData[obj.name]"
        @change="obj.onChange"
        style="width: 100%"
        placeholder="选择时间"
      >
      </el-time-picker>
      <el-date-picker
        v-else
        v-model="commonFormObj.formData[obj.name]"
        @change="obj.onChange"
        :type="obj.type"
        style="width: 100%"
        placeholder="选择日期"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item
      v-for="(obj, index) in commonFormObj.uploadItem"
      v-show="!obj.hidden"
      :key="obj.name + index"
      :label="obj.label"
      :prop="obj.name"
      :style="{
        'grid-area': `${obj.row} / ${obj.col || 1} / span 1 / span ${obj.span || 12}`,
        display: commonFormObj.inline ? 'flex' : 'block',
        'flex-wrap': 'wrap',
        'align-items': 'flex-end'
      }"
    >
      <el-upload
        :action="obj.action || ''"
        :file-list="commonFormObj.formData[obj.name]"
        :accept="obj.accept"
        :on-change="obj.onChange"
        :on-remove="obj.onChange"
        multiple
        :limit="obj.limit || 0"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <div slot="tip">{{ obj.placeholder }}</div>
      </el-upload>
    </el-form-item>
    <el-form-item
      :style="{
        'grid-column': 'none',
        display: commonFormObj.inline ? 'flex' : 'block',
        'flex-wrap': 'wrap',
        'align-items': 'flex-end'
      }"
    >
      <span style="display: flex">
        <el-button
          type="primary"
          size="small"
          v-if="Array.isArray(commonFormObj.mainQuery) && commonFormObj.mainQuery.length"
          @click="commonFormObj.mainQuery.forEach((fn) => fn())"
        >
          查询
        </el-button>
        <el-button
          style="margin-left: 10px"
          size="small"
          v-if="Array.isArray(commonFormObj.resetQuery) && commonFormObj.resetQuery.length"
          @click="commonFormObj.resetQuery.forEach((fn) => fn())"
        >
          重置
        </el-button>
        <div v-if="Array.isArray(commonFormObj.extraQuery)" style="display:contents;">
          <el-button
            v-for="(obj, index) in commonFormObj.extraQuery"
            :key="index"
            @click="obj.fn"
            :style="obj.style"
            size="small"
          >
            {{ obj.label }}
          </el-button>
        </div>
      </span>
    </el-form-item>
  </el-form>
</template>

<script setup>
// 通用
// 模块引入

// 父系传参
const props = defineProps({
  commonFormObj: {
    type: Object
  }
});

// 本地变量和函数

/* commonFormObj: {
      formData: {},
      rules: {},
      inputItem: [{ name: '', label: '', placeholder: '', row: 1, col: 1, span: 12, onChange: () => {} }],
      checkboxItem: [{ name: '', label: '', row: 1, col: 1, span: 12, onChange: () => {} }],
      dateItem: [{ name: '', label: '', type: '', row: 1, col: 1, span: 12, onChange: () => {} }],
      selectItem: [
        { name: '', label: '', placeholder: '', optionArr: [{ value: '', label: '' }], multiple: false, row: 1, col: 1, span: 12, onChange: () => {} }
      ],
      categoryItem: [{ name: '', label: '', placeholder: '', optionArr: [{ value: '', label: '' }], multiple: false, row: 1, col: 1, span: 12, onChange: () => {} }],
      uploadItem: [{ name: '', label: '', placeholder: '', action: '', accept: '', onChange: '', limit: '', row: 1, col: 1, span: 12, onChange: () => {} }],
      mainQuery: [],
      resetQuery: [],
    } */
</script>
