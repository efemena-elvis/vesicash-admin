<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.68342 25.6801C8.4796 26.9312 10.306 26.9312 11.1021 25.6801L14.5026 20.3364C15.361 18.9876 14.3921 17.2225 12.7933 17.2225H10.8456V10.7855C10.8456 9.9462 10.1653 9.26586 9.32601 9.26586C8.48677 9.26586 7.80642 9.9462 7.80642 10.7855L7.80642 17.2225H5.99229C4.39349 17.2225 3.42457 18.9876 4.28293 20.3364L7.68342 25.6801Z"
      :fill="swapped ? '#043B56' : '#B3E4FB'"
      :class="swapped ? 'swapped' : ''"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M18.8463 4.43186C19.652 3.26832 21.3721 3.26832 22.1778 4.43186L25.6762 9.4839C26.6067 10.8277 25.6449 12.6635 24.0104 12.6635L22.1075 12.6635V19.2482C22.1075 20.0875 21.4271 20.7678 20.5879 20.7678C19.7486 20.7678 19.0683 20.0875 19.0683 19.2482V12.6635L17.0137 12.6635C15.3792 12.6635 14.4174 10.8277 15.3479 9.4839L18.8463 4.43186Z"
      :fill="swapped ? '#B3E4FB' : '#043B56'"
    />
  </svg>
</template>

<script>
export default {
  name: "RateSwapIcon",

  props: {
    swapped: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
svg {
  path {
    transition: all ease-in-out 0.3s;
  }
}
</style>
