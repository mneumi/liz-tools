<script lang="ts" setup>
import Navigator from "cpns/navigator/Navigator.vue"
</script>

<template>
  <div class="container">
    <el-row>
      <el-col :span="24">
        <Navigator />
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="less">
.container {
  box-sizing: border-box;
  padding: 10px 10px 0 10px;
}
</style>
