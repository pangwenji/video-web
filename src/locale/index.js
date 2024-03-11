import { ref } from 'vue'
import { createI18n } from "vue-i18n";
import zhCn from './lang/zh'
import en from './lang/en'
import tool from "@/utils/tool";

const messages = {
  en, zhCn
}

const setLang = ref()

const userSetting = tool.local.get('userSetting')
setLang.value = userSetting && userSetting.language || "zh-cn"

const i18n = createI18n({
  locale: setLang.value === 'zh-cn' ? "zhCn" : 'en',
  fallbackLocale: "en",
  messages
})

export default i18n
