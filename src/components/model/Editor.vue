<script lang="ts" setup>
import { ref, computed } from "vue"
import CodeEditor from "cpns/code-editor/CodeEditor.vue"
import sqlToModel from "services/sql-to-model/sql-to-model"

const code = ref<string>("")
const canGenerate = computed(() => {
  return code.value.length > 0
})

const emit = defineEmits(["generate-code"])

const generate = () => {
  const result = sqlToModel.genAllTableCode(code.value)
  emit("generate-code", result)
}
</script>

<template>
  <div class="container">
    <el-alert
      type="success"
      title="DDL 转 Model"
      description="输入建表语句，生成 Go 的 Model 层代码"
      class="alert"
      :closable="false"
    />
    <CodeEditor line-number v-model="code" language="sql" height="76vh" />
    <el-button class="btn" type="primary" :disabled="!canGenerate" @click="generate"
      >生成代码</el-button
    >
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 0 15px 0 10px;
  .alert {
    margin-bottom: 15px;
  }
  .btn {
    margin-top: 16px;
    width: 100%;
  }
}
</style>
