<script lang="ts" setup>
import { PropType, computed, ref } from "vue"
import { IVerifyResult } from "services/proto-to-go"
import { ITabType } from "./types"
import { CircleCheckFilled } from "@element-plus/icons"

const props = defineProps({
  tab: {
    type: String as PropType<ITabType>,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
  lintErrorList: Array as PropType<IVerifyResult[]>,
  rpcNameList: Array as PropType<string[]>,
})

const title = computed(() => {
  switch (props.tab) {
    case "lint-error":
      return "proto校验不通过"
    case "rpc-config":
      return "接口生成配置"
    case "rpc-select":
      return "选择需要生成的接口"
  }
})

const rpcSelectedSet = ref<Set<string>>(new Set<string>())

const onRpcSelect = (rpcName: string) => {
  if (isSelected(rpcName)) {
    rpcSelectedSet.value.delete(rpcName)
  } else {
    rpcSelectedSet.value.add(rpcName)
  }
}
const isSelected = (rpcName: string) => {
  return rpcSelectedSet.value.has(rpcName)
}

const emit = defineEmits(["update:modelValue"])

const onClose = () => {
  emit("update:modelValue", false)
}
const onConfirm = () => {
  emit("update:modelValue", false)
}
</script>

<template>
  <el-dialog
    width="60%"
    top="10vh"
    center
    v-model="modelValue"
    :title="title"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <el-scrollbar height="60vh">
      <template v-if="tab === 'lint-error'">
        <el-alert
          v-for="(item, index) in lintErrorList"
          show-icon
          type="error"
          class="lint-error-alert"
          :key="index"
          :title="item.type"
          :description="item.msg"
          :closable="false"
        />
      </template>
      <template v-else-if="tab === 'rpc-select'">
        <template v-for="(item, index) in rpcNameList" :key="index">
          <div
            class="rpc-name-bar"
            :class="{ selected: isSelected(item) }"
            @click="() => onRpcSelect(item)"
          >
            <div class="icon-wrapper">
              <el-icon v-show="isSelected(item)" :size="20">
                <circle-check-filled />
              </el-icon>
            </div>
            <div class="title">{{ item }}</div>
          </div>
        </template>
      </template>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">关闭</el-button>
        <el-button type="primary" @click="onConfirm" v-if="props.tab !== 'lint-error'"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.lint-error-alert {
  margin-bottom: 10px;
}
.rpc-name-bar {
  margin-bottom: 10px;
  width: calc(100% - 5px);
  height: 5vh;
  display: flex;
  align-items: center;
  border: 1px dotted #666;
  border-radius: 5px;
  background-color: #f4f4f5;
  .icon-wrapper {
    width: 5vh;
    height: 5vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.selected {
  color: #fff;
  background-color: #409eff;
  border: 1px solid #409eff;
}
</style>
