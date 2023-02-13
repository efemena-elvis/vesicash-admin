<template>
  <div class="metric-wrapper rounded-8 neutral-10-bg">
    <div class="h5-text mgb-8 fw-700 teal-900">{{ metric.value || '--------' }}</div>
    <div class="tertiary-2-text grey-800">{{ metric.title }}</div>
  </div>
</template>


<script>
export default {
  name: "MetricCard",

  props: {
    metric: {
      type: Object,
      default: () => ({
        title: "Transaction volume",
        value: "34.2M",
      }),
    },
  },
};
</script>

<style lang="scss" scoped>
.metric-wrapper {
  padding: toRem(20);
}
</style>