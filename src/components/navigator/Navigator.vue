<script lang="ts" setup>
import { ref } from "vue"
import RPC from "cpns/rpc/RPC.vue"
import Model from "cpns/model/Model.vue"
import Procedure from "cpns/procedure/Procedure.vue"

const activeTab = ref<string>("rpc")
</script>

<template>
  <div class="container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="RPC接口" name="rpc">
        <RPC />
      </el-tab-pane>
      <el-tab-pane label="Model映射" name="model">
        <Model />
      </el-tab-pane>
      <el-tab-pane label="存储过程模板" name="procedure">
        <Procedure />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="less">
.container {
  height: 92vh;
}
</style>
