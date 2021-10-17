<script lang="ts" setup>
import { PropType, toRefs, ref, computed } from "vue"
import { IResult } from "services/sql-to-model/sql-to-model"
import { ElMessage } from "element-plus"
import Clipboard from "clipboard"

const props = defineProps({
  results: {
    type: Array as PropType<IResult[]>,
    required: true,
  },
})

const copy = () => {
  const clipboard = new Clipboard(".copy-btn")
  clipboard.on("success", () => {
    ElMessage({
      message: "复制成功！",
      type: "success",
    })
    clipboard.destroy()
  })
  clipboard.on("error", () => {
    ElMessage.error("复制失败！")
    clipboard.destroy()
  })
}

const { results } = toRefs(props)
const currentIndex = ref<number>(0)
const currentGoCode = computed(() => {
  return results.value[currentIndex.value].goCode
})
const currentTable = computed(() => {
  return results.value[currentIndex.value].tableName
})
const change = (index: number) => {
  currentIndex.value = index
}
</script>

<template>
  <div class="container">
    <el-empty v-if="!results.length" class="empty" description="等待生成代码" />
    <div v-else>
      <div class="controller">
        <div class="title">
          <el-tag effect="dark">{{ currentTable }}</el-tag>
        </div>
        <div class="code-path">
          <el-tag effect="dark">{{ `model/mysql/${currentTable}/${currentTable}.go` }}</el-tag>
        </div>
      </div>
      <el-carousel height="78vh" :autoplay="false" @change="change" arrow="never" trigger="click">
        <el-carousel-item v-for="(item, index) in results" :key="index">
          <CodeEditor readonly line-number v-model="item.goCode" language="go" height="81vh" />
        </el-carousel-item>
      </el-carousel>
      <el-button type="primary" class="copy-btn" :data-clipboard-text="currentGoCode" @click="copy"
        >一键复制</el-button
      >
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 0 15px 0 10px;
  border-left: 1px dotted black;
  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
  }
  .controller {
    background-color: #e1f3d8;
    height: 5.3vh;
    margin-bottom: 15px;
    display: flex;
    .title {
      display: flex;
      align-items: center;
      padding-left: 1vw;
      padding-right: 1vw;
      color: #f0f9eb;
      font-weight: 800;
    }
    .code-path {
      flex: 1;
      display: flex;
      align-items: center;
      color: #409eff;
    }
  }
  .copy-btn {
    margin-top: 16px;
    width: 100%;
  }
}
</style>
