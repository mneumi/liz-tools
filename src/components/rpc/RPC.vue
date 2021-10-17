<script lang="ts" setup>
import { ref } from "vue"
import { IVerifyResult, IServices } from "services/proto-to-go"
import { ITabType } from "./types"
import Editor from "./Editor.vue"
import Result from "./Result.vue"
import Dialog from "./Dialog.vue"

const tab = ref<ITabType>("lint-error")
const dialogVisible = ref<boolean>(false)

const lintErrorList = ref<IVerifyResult[]>([])
const onLintError = (list: IVerifyResult[]) => {
  dialogVisible.value = true
  lintErrorList.value = list
  tab.value = "lint-error"
}

const rpcNameList = ref<string[]>([])
const onRpcSelect = (services: IServices) => {
  if (services) {
    const serviceName = Object.keys(services)[0]
    rpcNameList.value = services[serviceName].methods.map((method) => method.name)

    dialogVisible.value = true
    tab.value = "rpc-select"
  }
}
</script>

<template>
  <el-row>
    <el-col class="column" :span="12">
      <el-scrollbar height="92vh">
        <Editor @lint-error="onLintError" @rpc-select="onRpcSelect" />
      </el-scrollbar>
    </el-col>
    <el-col class="column" :span="12">
      <el-scrollbar height="92vh">
        <Result />
      </el-scrollbar>
    </el-col>
  </el-row>
  <Dialog
    v-model="dialogVisible"
    :tab="tab"
    :lint-error-list="lintErrorList"
    :rpc-name-list="rpcNameList"
  />
</template>

<style scoped lang="less">
.container {
  box-sizing: border-box;
  padding: 0 30px 0 10px;
  .column {
    height: 92vh;
  }
}
</style>
