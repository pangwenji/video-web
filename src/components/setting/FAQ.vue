<script setup>
import { ref } from "vue";
import i18n from "@/locale";
import { cloneDeep } from "lodash";

const visible = ref(false);
const activeNames = ref([]);
const selectValue = ref("all");
const keyWord = ref("");

const defaultShows = {
  network: [1, 2],
  type: [1, 2, 3, 4, 5],
  device: [1, 2],
  operating: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  betting: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
};
const shows = ref({
  network: [1, 2],
  type: [1, 2, 3, 4, 5],
  device: [1, 2],
  operating: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  betting: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
});
const selectShows = ref(["network", "type", "device", "operating", "betting"]);
const subActives = ref({
  network: [],
  type: [],
  device: [],
  operating: [],
  betting: [],
});

const list = [
  {
    key: "network",
    children: [1, 2],
  },
  {
    key: "type",
    children: [1, 2, 3, 4, 5],
  },
  {
    key: "device",
    children: [1, 2],
  },
  {
    key: "operating",
    children: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  },
  {
    key: "betting",
    children: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
];

const selectOptions = [
  {
    label: i18n.global.t("faq.all"),
    value: "all",
  },
  {
    label: i18n.global.t("faq.network.title"),
    value: "network",
  },
  {
    label: i18n.global.t("faq.type.title"),
    value: "type",
  },
  {
    label: i18n.global.t("faq.device.title"),
    value: "device",
  },
  {
    label: i18n.global.t("faq.operating.title"),
    value: "operating",
  },
  {
    label: i18n.global.t("faq.betting.title"),
    value: "betting",
  },
];

const handleList = (val) => {
  activeNames.value.length = 0;

  if (!val.trim()) {
    shows.value = cloneDeep(defaultShows);
    subActives.value = {
      network: [],
      type: [],
      device: [],
      operating: [],
      betting: [],
    };

    if (selectValue.value !== "all") {
      activeNames.value = [selectValue.value];
    }

    return;
  }

  list.forEach((item) => {
    shows.value[item.key].length = 0;
  });

  selectShows.value.forEach((key) => {
    const _list = list.find((i) => key === i.key).children;
    subActives.value[key].length = 0;
    _list.forEach((child) => {
      const q = i18n.global.t(`faq.${key}.q${child}`);
      const a = i18n.global.t(`faq.${key}.a${child}`);
      if (q.includes(val) || a.includes(val)) {
        shows.value[key].push(child);
        subActives.value[key].push(child);
      }
    });

    if (subActives.value[key].length) {
      activeNames.value.push(key);
    }
  });
};

const handleChange = (v) => {
  selectShows.value =
    v === "all" ? ["network", "type", "device", "operating", "betting"] : [v];
};

const getSubtitle = (str) => {
  const _keyword = keyWord.value.trim();
  if (!_keyword) return str;

  const reg = new RegExp(_keyword, "g");

  return str.replace(reg, `<span class="highlight">${_keyword}</span>`);
};

const handleInput = (v) => {
  handleList(v);
};

const open = () => {
  keyWord.value = "";
  selectValue.value = "all";
  selectShows.value = ["network", "type", "device", "operating", "betting"];
  shows.value = cloneDeep(defaultShows);
  handleInput("");
  visible.value = true;
};

defineExpose({ open });
</script>

<template>
  <el-dialog
    v-model="visible"
    width="700px"
    align-center
    append-to-body
    id="faq-dialog"
    class="faq-dialog"
  >
    <template #header>
      <span class="title"> {{ $t("faq.title") }} </span>
    </template>
    <div class="content">
      <div class="search">
        <el-select
          v-model="selectValue"
          size="large"
          class="search-select"
          popper-class="search-select-popper"
          @change="handleChange"
        >
          <el-option
            v-for="item in selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-input
          class="searh-input"
          v-model="keyWord"
          :placeholder="$t('faq.search')"
          @input="handleInput"
        />
      </div>

      <div class="question-answer">
        <el-collapse class="parent-collapse" v-model="activeNames">
          <el-collapse-item
            v-for="item in list"
            :key="item.key"
            :title="$t(`faq.${item.key}.title`)"
            :name="item.key"
            v-show="shows[item.key].length && selectShows.includes(item.key)"
          >
            <el-collapse class="sub-collapse" v-model="subActives[item.key]">
              <el-collapse-item
                v-for="child in item.children"
                :key="child"
                :name="child"
                v-show="shows[item.key].includes(child)"
              >
                <template #title>
                  <div v-html="getSubtitle($t(`faq.${item.key}.q${child}`))" />
                </template>

                <div v-html="getSubtitle($t(`faq.${item.key}.a${child}`))" />
              </el-collapse-item>
            </el-collapse>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button class="btn-left" @click="visible = false">{{
          $tc("home.close", 2)
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less">
.el-dialog__headerbtn {
  display: none;
}

.faq-dialog {
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

  .el-dialog__footer {
    padding: 20px;
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
    font-weight: 700;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-image: linear-gradient(
        270deg,
        rgba(152, 103, 45, 0),
        rgba(152, 103, 45, 0.5) 22%,
        #ffe7a3 53%,
        rgba(190, 132, 58, 0.5) 81%,
        rgba(190, 132, 58, 0)
      );
    }
  }

  .el-dialog__body {
    padding: 12px 0 30px;

    .content {
      color: #fff;
      font-size: 15px;
      padding: 0;
      list-style: none;
      outline: none;
      user-select: none;
      box-sizing: border-box;
      height: 300px;
      overflow-y: auto;

      .title-text {
        font-size: 20px;
        color: #fff;
        font-weight: 600;
      }
    }
  }

  .dialog-footer {
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
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
}

.question-answer {
  width: calc(100% - 68px);
  margin: 12px 34px;

  .el-collapse {
    border: none;
  }
}

.parent-collapse {
  > div > .el-collapse-item__header {
    background-color: transparent;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    border-bottom: none;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, #ffe7a3, hsla(47, 84%, 74%, 0.01));
    }
  }

  > div > .el-collapse-item__wrap {
    margin-top: 12px;

    > .el-collapse-item__content {
      padding-bottom: 0;
    }
  }

  .el-collapse-item__wrap {
    background-color: transparent;
    border: none;
  }
}

.sub-collapse {
  .el-collapse-item__header {
    background-color: transparent;
    border: none;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    line-height: 1.5;
    text-align: left;
  }

  .el-collapse-item {
    margin-bottom: 12px;
    padding: 0 16px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
  }

  .el-collapse-item__content {
    font-size: 14px;
    font-weight: 500;
    color: #b9b9b9;
  }

  .el-icon {
    display: none;
  }
}

.search {
  display: flex;
  padding: 0 34px;

  .search-select {
    width: 156px;
    border-right: 1px solid #282828;

    &.el-select:hover:not(.el-select--disabled) .el-input__wrapper {
      box-shadow: unset;
    }
    &.el-select .el-input.is-focus .el-input__wrapper {
      box-shadow: unset !important;
    }

    &.el-select .el-input__wrapper.is-focus {
      box-shadow: unset !important;
    }

    .el-select__wrapper {
      border-radius: 20px 0 0 20px;
      background-color: #000;
      box-shadow: unset;
    }
    
    .el-input__wrapper {
      border-radius: 20px 0 0 20px;
      background-color: #000;
      box-shadow: unset;
    }
    // 1px solid
    .el-select__icon {
      color: #fbf1b6;
    }

    .el-input__inner {
      color: #fff;
    }
  }

  .searh-input {
    .el-input__wrapper {
      background-color: #000;
      box-shadow: unset;
      border-radius: 0 20px 20px 0;
    }

    .el-input__inner {
      color: #fff;
    }
  }
}

.search-select-popper {
  border-color: #bf986b !important;
  background-color: #000;

  .el-popper__arrow {
    display: none;
  }

  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background-color: transparent;
  }

  .el-select-dropdown__item {
    color: #fff;
  }
  .el-select-dropdown__item.selected {
    color: #fbf1b6;
  }
  .el-select-dropdown__item.is-hovering {
    background-color: #020202;
  }
}

.highlight {
  background-color: #947b5e;
}
</style>
