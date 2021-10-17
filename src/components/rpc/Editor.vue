<script lang="ts" setup>
import { ref, computed } from "vue"
import { ElMessageBox } from "element-plus"
import { protoToSchema, schemaToObject, verifyObject } from "services/proto-to-go"
import { gitHostList, microServiceGroupList, microServiceList } from "resources/micro-service-list"

const gitHost = ref(gitHostList[0].value)
const microServiceGroup = ref(microServiceGroupList[0].value)
const microService = ref("")

const code = ref<string>("")

const canGenerate = computed(() => {
  return microService.value.length > 0 && code.value.length > 0
})
const btnTitle = computed(() => {
  const titleArray: string[] = []

  if (microService.value.length <= 0) {
    titleArray.push("请选择服务仓库")
  }
  if (code.value.length <= 0) {
    titleArray.push("请输入proto代码")
  }

  if (titleArray.length === 0) {
    return "生成代码"
  }

  return titleArray.join(" + ")
})

const emit = defineEmits(["generate-code", "lint-error", "rpc-select"])
const generate = () => {
  try {
    const schema = protoToSchema(code.value)
    const protoObject = schemaToObject(schema)
    const lintErrorList = verifyObject(protoObject)

    // 如果校验不通过
    if (lintErrorList.length > 0) {
      emit("lint-error", lintErrorList)
    } else {
      emit("rpc-select", protoObject.services)
    }
  } catch (e) {
    ElMessageBox.alert("请检查 proto 内容是否满足 proto buffer 3 的语法", "解析失败", {
      confirmButtonText: "确定",
      type: "error",
    })
  }
}
</script>

<template>
  <div class="container">
    <el-select v-model="gitHost" filterable placeholder="选择 git host">
      <el-option
        v-for="item in gitHostList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select v-model="microServiceGroup" filterable placeholder="选择服务分组" class="selector">
      <el-option
        v-for="item in microServiceGroupList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="microService"
      filterable
      placeholder="选择服务仓库"
      class="selector"
      style="width: 240px"
    >
      <el-option
        v-for="item in microServiceList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <CodeEditor line-number v-model="code" language="protobuf" height="77vh" />
    <el-button class="btn" type="primary" :disabled="!canGenerate" @click="generate"
      >{{ btnTitle }}
    </el-button>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 0 15px 0 10px;
  .selector {
    margin-left: 15px;
    margin-bottom: 15px;
  }
  .btn {
    margin-top: 16px;
    width: 100%;
  }
}
</style>
