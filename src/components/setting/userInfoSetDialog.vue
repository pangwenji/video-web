<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store';
import { ElMessage } from 'element-plus';

const props = defineProps({
  platformName: "在线玩"
})

const userStore = useUserStore()
const visible = ref(false)
const nickname = ref("")

function btnComfirmEvent() {
  const regex = /^[a-zA-Z0-9]*$/;
  if(!regex.test(nickname.value)) {
    ElMessage.warning("昵称包含空格或特殊字符，请重新输入")
    return
  }
  userStore.updateUserInfo({
    user_nick: nickname.value
  }).then(result => {
    if (result && result.code === 200) {
      ElMessage.success({
        message: "昵称修改成功"
      })
      visible.value = false
    } else {
      ElMessage.error({
        message: result.message || "昵称修改失败"
      })
    }
  })
}

const open = (row) => {
  visible.value = true
}

defineExpose({ open })
</script>

<template>
  <el-dialog v-model="visible" width="30%" align-center append-to-body class="user-info-setting">
    <template #header>
      <span class="title"> 设置昵称 </span>
    </template>
    <div class="content">
      <el-input class="nick-inp" v-model="nickname" placeholder="请输入您的昵称"></el-input>
      <span class="nick-tip">名称不可使用空白或符号 (如：“*#+$等)</span>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button class="btn-left" @click="btnComfirmEvent">确定</el-button>
        <el-button class="btn-right" @click="visible = false">下次设定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less">
.user-info-setting {
  font-size: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
  outline: none;
  user-select: none;
  border-radius: 4px;
  background: linear-gradient(0deg, #928383, #2e2a21);
  border: 1px solid #ffe88e;
  min-width: 500px;
  box-sizing: border-box;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 4px;
  background: linear-gradient(0deg, #020202, #2e2a21);

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
      align-items: center;
      justify-content: center;
      margin: 20px auto;
      box-sizing: border-box;
      width: 70%;
      background-color: transparent;

      .nick-inp {
        margin: 0;
        list-style: none;
        outline: none;
        color: #fff;
        height: 40px;
        background: transparent;
        font-size: 15px;
        width: 100%;
        padding: 0 0 0 8px;
        border-radius: 0;
        padding-left: 0;
        box-sizing: border-box;

        .el-input__wrapper {
          background-color: transparent;
          box-shadow: 0 0 0 0;
          border: none;
          padding: 0;

          &.is-focus {
            .el-input__inner {
              border-bottom: 1px solid #ffe7a3;
            }
          }

          .el-input__inner {
            color: #fff;
            border: none;
            border-bottom: 1px solid #594f4f;
          }
        }
      }

      .nick-tip {
        display: block;
        font-size: 13px;
        color: #454545;
      }
    }
  }

  .dialog-footer {
    width: 60%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
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
    background: #dfc58c;
    margin: 0 8px;
    box-sizing: border-box;
  }

  .btn-right {
    padding: 0;
    list-style: none;
    outline: none;
    user-select: none;
    background-color: transparent;
    font-weight: 500;
    font-size: 16px;
    border-radius: 20px;
    cursor: pointer;
    color: #d2b679;
    border: 1px solid #4a4a4a;
    width: 140px;
    height: 40px;
    margin: 0 8px;
    box-sizing: border-box;
  }
}
</style>
