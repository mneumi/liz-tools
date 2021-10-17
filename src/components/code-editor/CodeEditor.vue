<script lang="ts" setup>
import { ref, watch, PropType } from "vue"
// 代码编辑器
import { PrismEditor } from "vue-prism-editor"
import "vue-prism-editor/dist/prismeditor.min.css"
// 代码高亮
import prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css"
// 语言高亮文件
import "prismjs/components/prism-sql.js"
import "prismjs/components/prism-go.js"
import "prismjs/components/prism-protobuf.js"

const props = defineProps({
  lineNumber: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    required: true,
  },
  language: {
    type: String as PropType<"sql" | "go" | "protobuf">,
    required: true,
  },
  width: String,
  height: String,
})

const highlighter = (code: string) => {
  return prism.highlight(code, prism.languages[props.language], props.language)
}

const code = ref<string>(props.modelValue)

const emit = defineEmits(["update:modelValue"])

watch(code, (newValue) => {
  emit("update:modelValue", newValue)
})

watch(props, () => {
  code.value = props.modelValue
})
</script>

<template>
  <div class="container">
    <prism-editor
      class="my-editor"
      v-model="code"
      :highlight="highlighter"
      :tabSize="4"
      :line-numbers="props.lineNumber"
      :readonly="props.readonly"
      :style="{ height: props.height }"
    />
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 0 !important;
  .my-editor {
    width: 100%;
    background: #2d2d2d;
    color: #ccc;
    font-size: 14px;
    line-height: 1.5;
    padding: 10px 0 !important;
  }
}
</style>
