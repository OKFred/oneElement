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
        range-separator="???"
        :start-placeholder="/time/gi.test(obj.type) ? '????????????' : '????????????'"
        :end-placeholder="/time/gi.test(obj.type) ? '????????????' : '????????????'"
        :value-format="/time/gi.test(obj.type) ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'"
        :picker-options="{
          shortcuts: [
            {
              text: '????????????',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '???????????????',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '????????????',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '???????????????',
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
        placeholder="????????????"
      >
      </el-time-picker>
      <el-date-picker
        v-else
        v-model="commonFormObj.formData[obj.name]"
        @change="obj.onChange"
        :type="obj.type"
        style="width: 100%"
        placeholder="????????????"
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
        <el-button slot="trigger" size="small" type="primary">????????????</el-button>
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
          ??????
        </el-button>
        <el-button
          style="margin-left: 10px"
          size="small"
          v-if="Array.isArray(commonFormObj.resetQuery) && commonFormObj.resetQuery.length"
          @click="commonFormObj.resetQuery.forEach((fn) => fn())"
        >
          ??????
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
// ??????
// ????????????

// ????????????
const props = defineProps({
  commonFormObj: {
    type: Object
  }
});

// ?????????????????????

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
