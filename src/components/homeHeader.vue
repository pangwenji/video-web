<template>
  <div class="homeHeader">
    <div class="header-wrap">
      <div class="left-part">
        <div class="logo-img">
          <img src="../assets/logo.png" alt="logo">
        </div>
        <div v-if="userInfo.account" class="user_name" @click="userInfoSetDialogRef.open()">{{ userInfo.account }}</div>
        <div class="user_balance_coin" v-if="userInfo.money">
          <img :src="baseImages.coin" alt="coin" style="width: 16px;height: 16px;">
          {{ userInfo.money }}
        </div>
      </div>
      <div class="right-part">
        <ul class="right-menu">
          <li class="menu-item-li">
            <div class="btn-icon">
              <el-tooltip class="box-item" effect="dark" :content="$t('home.betHistory')" placement="bottom-end">
                <IconBetLog @click="userBetHistoryDialogRef.open()" />
              </el-tooltip>
            </div>
          </li>
          <li class="menu-item-li">
            <div class="btn-icon">
              <el-tooltip class="box-item" effect="dark" :content="$t('home.setVoice')" placement="bottom-end">
                <IconVoice />
              </el-tooltip>
            </div>
          </li>
          <li class="menu-item-li">
            <div class="btn-icon">
              <el-dropdown @handleOpen="openSetting" trigger="click" @command="settingMenuClick" placement="bottom-end">
                <IconSetting />
                <template #dropdown>
                  <div class="setting-wrap">
                    <div class="set-account">
                      <div class="set-title">{{ $tc("home.account", 2) }}</div>
                      <div class="item-li" @click="userInfoSetDialogRef.open()">{{ $t("home.setNickname") }}</div>
                    </div>
                    <div class="set-game">
                      <div class="set-title">{{ $tc("home.game", 2) }}</div>
                      <div class="item-li" command="set-coin-style" @click="setChipStyleRef.open()">{{
                        $t("home.chipStyle") }}</div>
                      <div class="item-li" command="set-bet-interface" style="display: none;"
                        @click="setTableStyleRef.open()">{{ $t("home.betTableStyle") }}</div>
                      <div class="item-li" command="set-livemode" style="display: none;">{{ $t("home.liveModel") }}</div>
                      <div class="item-li" command="set-handicap" @click="setHandicapRef.open()">{{ $t("home.setHandicap") }}</div>
                    </div>
                    <div class="set-system-notice">
                      <div class="set-title">{{ $t("home.system") }}</div>
                      <div class="item-li" command="set-notice-style" @click="setRouteRecommantRef.open()">{{
                        $t("home.setNotice") }}</div>
                      <div class="item-li" command="set-language" @click="setLanguageRef.open()">{{ $t("home.setLanguage")
                      }}</div>
                      <div class="item-li" command="set-problems" @click="faqRef.open()">{{ $t("home.usualProblem") }}</div>
                    </div>
                  </div>
                </template>
              </el-dropdown>
            </div>
          </li>
          <li class="menu-item-li">
            <div class="btn-icon">
              <el-tooltip class="box-item" effect="dark" :content="$tc('user.logout', 2)" placement="bottom-end">
                <IconShutdown @click="logoutDialogRef.open()" />
              </el-tooltip>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <logoutDialog ref="logoutDialogRef" />
    <userInfoSetDialog ref="userInfoSetDialogRef" />
    <setChipStyle ref="setChipStyleRef" />
    <setTableStyle ref="setTableStyleRef" />
    <setLanguage ref="setLanguageRef" />
    <setHandicap ref="setHandicapRef" />
    <forceLogoutDialog ref="forceLogoutDialogRef" />
    <userBetHistoryDialog ref="userBetHistoryDialogRef" />
    <setRouteRecommant ref="setRouteRecommantRef" />
    <FAQ ref="faqRef" />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import IconBetLog from '@/components/icons/IconBetLog.vue'
import IconVoice from '@/components/icons/IconVoice.vue'
import IconSetting from '@/components/icons/IconSetting.vue'
import IconShutdown from '@/components/icons/IconShutdown.vue'
import baseImages from '@/utils/baseImages'
import logoutDialog from './setting/logoutDialog.vue'
import userInfoSetDialog from '@/components/setting/userInfoSetDialog.vue'
import forceLogoutDialog from '@/components/setting/forceLogoutDialog.vue'
import userBetHistoryDialog from '@/components/setting/userBetHistoryDialog.vue'
import setChipStyle from './setting/setChipStyle.vue'
import setTableStyle from './setting/setTableStyle.vue'
import setRouteRecommant from './setting/setRouteRecommant.vue'
import setLanguage from './setting/setLanguage.vue'
import setHandicap from './setting/setHandicap.vue'
import FAQ from './setting/FAQ.vue'
import { useUserStore } from '@/store'

const logoutDialogRef = ref()
const userInfoSetDialogRef = ref()
const setChipStyleRef = ref()
const setTableStyleRef = ref()
const forceLogoutDialogRef = ref()
const userBetHistoryDialogRef = ref()
const setRouteRecommantRef = ref()
const setLanguageRef = ref()
const setHandicapRef = ref()
const faqRef = ref()

const userStore = useUserStore()
const userInfo = ref({})

function openSetting(e) {
  console.log('打开设置', e);
}
function settingMenuClick(item) {
  console.log('点击设置', item);
}

onMounted(() => {
  userInfo.value = userStore.$state
})
</script>
<style scoped lang="less">
.homeHeader {
  background-color: black;
  width: 100%;
  height: 70px;
  line-height: 70px;
  position: sticky;
  top: 0;

  .header-wrap {
    width: 100%;
    display: flex;
    position: relative;
    color: #fff;
    flex-wrap: nowrap;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    justify-content: space-between;

    .left-part {
      display: flex;
      align-items: center;

      .logo-img {
        width: 145px;
        height: 45px;

        img {
          width: 100%;
        }
      }

      .user_name {
        cursor: pointer;
      }

      .user_balance_coin {
        margin-left: 10px;
        display: flex;
        align-items: center;
      }
    }

    .right-part {
      font-size: 20px;
      line-height: 1;

      .right-menu {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        list-style: none;

        .menu-item-li {
          margin: 0 5px;

          .btn-icon {
            display: inline-block;
            align-items: center;
            justify-content: center;
            position: relative;
          }
        }
      }
    }
  }

}

.setting-wrap {
  list-style: none;
  outline: none;
  width: 130px;
  display: block;
  padding-left: 0;
  z-index: 1100;
  background: #000;
  top: 38px;
  border: 1px solid transparent;
  padding-bottom: 0;
  background-image: linear-gradient(#000, #000), linear-gradient(0deg, rgba(153, 102, 6, .52), #fffbf5 51%, hsla(30, 60%, 79%, .4));
  background-origin: border-box;
  background-clip: content-box, border-box;
  border-radius: 5px;
  box-shadow: none;
  font-weight: 600;
  user-select: none;

  .set-title {
    font-weight: 400;
    min-width: 55px;
    color: #bf986b;
    font-size: 15px;
    text-align: left;
    border-bottom: 1px solid #454545;
    padding: 10px;
  }

  .item-li {
    font-weight: 400;
    min-width: 55px;
    color: #fff;
    font-size: 15px;
    text-align: left;
    border-bottom: 1px solid #454545;
    padding: 10px;

    &.typeSelected {
      color: #bf986b;
    }

    &:hover {
      background-color: #454545;
      cursor: pointer;
    }
  }
}
</style>
