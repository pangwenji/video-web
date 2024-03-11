<script setup>
import { ref, onMounted } from 'vue'
import tool from '@/utils/tool';

const selectedLang = ref('zh-cn')
const localUserSetting = ref()

onMounted(() => {
  localUserSetting.value = tool.local.get("userSetting")
  selectedLang.value = localUserSetting.value.language
})

function saveLangSet() {
  try {
    tool.local.set('userSetting', {
      ...localUserSetting.value,
      language: selectedLang.value
    })
    visible.value = false
    location.reload()
  } catch (error) { }
}
const visible = ref(false)
const open = () => {
  visible.value = true
}

defineExpose({ open })
</script>

<template>
  <el-dialog v-model="visible" width="30%" align-center append-to-body class="logout">
    <template #header>
      <span class="title"> {{ $t('home.setLanguage') }} </span>
    </template>
    <div class="content">
      <div class="title-text">{{ $t("home.chooseYourLanguage") }}</div>
      <div class="lang-select-list">
        <div class="list-wrap">
          <div class="lang-item lang-zhcn" :class="{ 'selected': selectedLang == 'zh-cn' }" @click="selectedLang = 'zh-cn'">
            <img src="../../assets/images/icon-login-sc.png" alt="">
            <span>简中</span>
          </div>
          <div class="lang-item lang-en" :class="{ 'selected': selectedLang == 'en' }" @click="selectedLang = 'en'">
            <img src="../../assets/images/icon_login_en.png" alt="">
            <span>English</span>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button class="btn-left" @click="saveLangSet">{{ $tc('home.confirm', 2) }}</el-button>
        <el-button class="btn-right" @click="visible = false">{{ $tc('home.close', 2) }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less">
.el-dialog__headerbtn {
  display: none;
}

.logout {
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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 10px 0 20px;
      box-sizing: border-box;

      .title-text {
        font-size: 20px;
        color: #fff;
        font-weight: 600;
      }

      .lang-select-list {
        max-height: 200px;
        overflow-y: scroll;

        .list-wrap {
          display: flex;
          flex-direction: column;

          .lang-item {
            width: 200px;
            height: 36px;
            line-height: 36px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            margin-top: 5px;
            margin-bottom: 5px;
            cursor: pointer;

            img {
              width: 16px;
              height: 16px;
              margin: 0 16px 0px 56px;
            }

            &:hover {
              background-color: rgb(252 251 249 / 16%);
              color: #fff;
            }

            &.selected {
              color: #333;
              background-color: #d2b679;
            }
          }
        }
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
