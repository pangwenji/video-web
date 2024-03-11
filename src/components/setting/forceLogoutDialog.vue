<script setup>
import { ref, onMounted, toRefs, watch } from 'vue'
import user from '@/api/user';

function btnComfirmEvent() {
  console.log("确定");
}
const visible = ref(false)
const open = (row) => {
  visible.value = true
}

defineExpose({ open })
</script>

<template>
  <el-dialog v-model="visible" width="30%" :close-on-click-modal="false" :close-on-press-escape="false"
    :show-close="false" align-center append-to-body class="force-logout">
    <template #header>
      <span class="title"> {{ $t('home.yourHadLogout') }} </span>
    </template>
    <div class="content">
      <p>{{ $t('home.logoutMessage') }}</p>
    </div>

    <template #footer>
      <div class="dialog-footer" v-if="false">
        <el-button class="btn-left" @click="btnComfirmEvent">{{ $t("home.confirm", 2) }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less">
.el-dialog__headerbtn {
  display: none;
}

.force-logout {
  font-size: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
  outline: none;
  user-select: none;
  border-radius: 4px;
  border: 1px solid #ffe88e;
  min-width: 500px;
  box-sizing: border-box;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 4px;

  &.el-dialog {
    position: fixed !important;
    background: linear-gradient(0deg, #020202, #2e2a21) !important;
  }

  .el-dialog__header {
    margin: 0;
    padding: 0 !important;
  }

  .el-dialog__headerbtn {
    display: none;
  }

  .title {
    margin: 0;
    padding: 0;
    list-style: none;
    outline: none;
    user-select: none;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 47px;
    font-size: 18px;
    color: #ffe7a3;
    background: url("../../assets/images/dialog_title_light.png") no-repeat;
    background-size: 320px;
    background-position: top;
    box-sizing: border-box;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-image: linear-gradient(270deg, rgba(152, 103, 45, 0), rgba(152, 103, 45, .5) 22%, #ffe7a3 53%, rgba(190, 132, 58, .5) 81%, rgba(190, 132, 58, 0));
    }
  }

  .el-dialog__body {
    padding: 0;

    .content {
      color: #fff;
      font-size: 15px;
      padding: 0;
      list-style: none;
      outline: none;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px 0;
      box-sizing: border-box;
    }
  }

  .dialog-footer {
    width: 60%;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
  }

  .btn-left {
    padding: 0;
    list-style: none;
    outline: none;
    user-select: none;
    border: none;
    font-size: 16px;
    border-radius: 20px;
    cursor: pointer;
    color: #000;
    font-weight: 500;
    width: 140px;
    height: 40px;
    background: #d7b66f;
    margin: 0 8px;
    box-sizing: border-box;

    &:hover {
      background: #dfc58c;
      color: #000;
    }
  }
}
</style>
