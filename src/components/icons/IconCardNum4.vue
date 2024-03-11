<template>
  <svg data-v-f8c9cbb8="" class="icon-card-num4" height="26" viewBox="0 0 26 26" width="26"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="m4 4h8.6086957v8.6086957h-8.6086957zm0 9.3913043h8.6086957v8.6086957h-8.6086957zm9.3913043-9.3913043h8.6086957v8.6086957h-8.6086957zm0 9.3913043h8.6086957v8.6086957h-8.6086957z"
      fill-rule="evenodd"></path>
    <path
      d="m4 4h8.6086957v8.6086957h-8.6086957zm0 9.3913043h8.6086957v8.6086957h-8.6086957zm9.3913043-9.3913043h8.6086957v8.6086957h-8.6086957zm0 9.3913043h8.6086957v8.6086957h-8.6086957z"
      fill="#FFF" opacity="0"></path>
  </svg>
</template>
<style scoped lang="less">
.icon-card-num4 {
  cursor: pointer;

  path {
    fill: #6d6d6d;
  }

  &:hover {
    path {
      &:nth-child(2) {
        fill: #ad9570;
        opacity: 0.24;
      }
    }
  }
}

.card-selected {
  path:first-child {
    fill: #ad9570;
  }
}
</style>
