<script lang="ts" setup>
import { procedureList, procedureHint } from "resources/procedure"
import { ElMessage } from "element-plus"
import CodeEditor from "cpns/code-editor/CodeEditor.vue"
import Clipboard from "clipboard"

const copy = (index: number) => {
  const clipboard = new Clipboard(`.btn-${index}`)
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

const open = () => {
  window.open("https://ykupgrader.myscrm.cn/")
}
</script>

<template>
  <div class="container">
    <el-row :gutter="20" class="top-bar">
      <el-col :span="22">
        <el-alert
          type="success"
          :title="procedureHint.title"
          :description="procedureHint.description"
          :closable="false"
        />
      </el-col>
      <el-col :span="2" class="open-btn">
        <el-button type="primary" @click="open">打开云客更新系统</el-button>
      </el-col>
    </el-row>
    <el-scrollbar height="92vh">
      <el-collapse accordion>
        <el-collapse-item
          v-for="(item, index) in procedureList"
          :title="item.title"
          :name="index"
          :key="index"
        >
          <el-button
            type="primary"
            :class="`copy-btn btn-${index}`"
            :data-clipboard-text="item.sql"
            @click="() => copy(index)"
            >一键复制</el-button
          >
          <CodeEditor line-number readonly v-model="item.sql" language="sql" />
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
  </div>
</template>

<style scoped lang="less">
.container {
  box-sizing: border-box;
  padding: 0 30px 0 10px;
  .top-bar {
    margin-bottom: 20px;
    .open-btn {
      margin-top: 5px;
    }
  }
  .copy-btn {
    margin-bottom: 10px;
  }
}
</style>
