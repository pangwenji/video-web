import useClipboard from 'vue-clipboard3'
import { ElMessage } from 'element-plus'

const copy = (el, binding) => {
  const { value } = binding
  el.addEventListener('click', async () => {
    if (value && value !== '') {
      try {
        await useClipboard().toClipboard(value)
        ElMessage.success('已成功复制到剪切板')
      } catch(e) {
        ElMessage.error('复制失败')
      }
    } else {
      throw new Error(`need for copy content! Like v-copy="Hello World"`)
    }
  })
}

export default {
  mounted(el, binding) {
    copy(el, binding)
  },
  updated(el, binding) {
    copy(el, binding)
  },
};
