// 元素大小变化
const map = new WeakMap()
const ob = new ResizeObserver(entries => {
  for (const entry of entries) {
    const handler = map.get(entry.target)
    if (handler) {
      handler({
        width: entry.borderBoxSize[0].inlineSize,
        height: entry.borderBoxSize[0].blockSize
      })
    }
  }
})

export const Resize = {
  mounted(el, binding) {
    map.set(el, binding.value)
    ob.observe(el)
  },
  unmounted(el) {
    ob.unobserve(el)
  }
}

export default Resize
