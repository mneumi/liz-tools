<script lang="ts" setup>
import { ref } from "vue"
import { IResult } from "services/sql-to-model/sql-to-model"
import Editor from "./Editor.vue"
import Result from "./Result.vue"

const results = ref<IResult[]>([])
const showResult = (res: IResult[]) => {
  results.value = res
}
</script>

<template>
  <div class="container">
    <el-row>
      <el-col class="column" :span="12">
        <el-scrollbar height="92vh">
          <Editor @generate-code="showResult" />
        </el-scrollbar>
      </el-col>
      <el-col class="column" :span="12">
        <el-scrollbar height="92vh">
          <Result :results="results" />
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="less">
.container {
  box-sizing: border-box;
  .column {
    height: 92vh;
  }
}
</style>
