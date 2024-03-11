<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import user from '@/api/user';
const limitRedList = ref([])

const selectedId = ref(0)
const visible = ref(false)

onBeforeMount(async () => {
  await getList()
})

function getList() {
  return new Promise((resolve, reject) => {
    user.limitRedList().then(res => {
      if (res.code === 200) {
        limitRedList.value = res.data
        let selectedLimitRed = res.data.filter(item => item.status === 1)[0]
        if (!selectedLimitRed) {
          selectedLimitRed = limitRedList.value[0]
          selectedId.value = selectedLimitRed.id
          resolve(selectedId.value)
        } else {
          selectedId.value = selectedLimitRed.id
          resolve(selectedId.value)
        }
      }
    }).catch(err => {
      console.log('获取限红列表出错', err);
      reject(err)
    })
  })
}

watch(visible, async val => {
  if (limitRedList.value.length === 0) {
    await getList()
  }
  let selectedLimitRed = limitRedList.value.filter(item => item.status === 1)[0]
  selectedId.value = selectedLimitRed ? selectedLimitRed.id : limitRedList.value[0]
  if (!val) {
    limitRedList.value = []
  }
})

function toSelectRule(id) {
  selectedId.value = id
}

function selectedConfirm() {
  return new Promise((resolve, reject) => {
    user.limitRedEdit({
      red_limit_id: selectedId.value
    }).then(res => {
      visible.value = false
      resolve(res)
    }).catch(err => {
      console.log('更新出错', err);
      reject(err)
    })
  })
}

const open = (row) => {
  visible.value = true
  setTimeout(() => {
    document.getElementsByClassName("selected-list-item")[0] && document.getElementsByClassName("selected-list-item")[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 400);
}

defineExpose({ open })
</script>

<template>
  <el-dialog v-model="visible" width="30%" align-center append-to-body class="setHandicap">
    <template #header>
      <div class="title">
        <span class="title-text">选择游戏盘口</span>
      </div>
    </template>
    <div class="content">
      <ul>
        <li class="limit-red-item" v-for="item in limitRedList" :key="item.id"
          :class="{ 'selected-list-item': item.id === selectedId }" @click="toSelectRule(item.id)">
          <div class="wrap">
            <span>{{ item.name }}</span>
          </div>
        </li>
      </ul>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button class="btn-left" @click="selectedConfirm">确定</el-button>
        <el-button class="btn-right" @click="visible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less">
.el-dialog__headerbtn {
  display: none;
}

.setHandicap {
  font-size: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
  outline: none;
  user-select: none;
  border-radius: 4px;
  background: linear-gradient(0deg, #928383, #2e2a21);
  border: 1px solid #ffe88e;
  max-width: 500px;
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
    position: absolute;
    top: -38px;
    left: 50%;
    width: 305px;
    height: 66px;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('../../assets/images/bg_ribbon.png') no-repeat;
    background-size: 100% 100%;

    .title-text {
      margin-bottom: 10px;
      font-weight: bold;
      font-size: 18px;
      color: #232323;
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
      margin: 40px 0 20px;
      box-sizing: border-box;
      max-height: 450px;
      overflow-y: scroll;

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        width: 80%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        max-height: 450px;
        overflow-y: scroll;

        li {
          margin-top: 10px;

          &.limit-red-item {
            width: 227px;

            .wrap {
              border: 1px solid #4a4a4a;
              display: flex;
              flex-shrink: 0;
              align-items: center;
              justify-content: flex-start;
              font-size: 18px;
              line-height: 18px;
              font-weight: 500;
              cursor: pointer;
              padding-left: 18px;
              padding-right: 18px;
              border-radius: 20px;
              overflow: hidden;
              height: 40px;
              box-sizing: border-box;
              border-color: transparent;
              width: 100%;

              &:hover {
                background-image: unset;
                background-color: hsla(0, 0%, 100%, .2);
              }

              span {
                display: inline-flex;
                justify-content: flex-start;
              }
            }

            &.selected-list-item {
              .wrap {
                background: #d7b66f;
                color: #000;
              }
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

    .el-button {

      &.btn-left {
        padding: 0;
        list-style: none;
        outline: none;
        user-select: none;
        border: none;
        font-size: 16px;
        border-radius: 20px;
        cursor: pointer;
        color: #000;
        width: 140px;
        height: 40px;
        background: #dfc58c;
        margin: 0 8px;
        box-sizing: border-box;

        span {
          font-weight: bold;
        }
      }
    }
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
