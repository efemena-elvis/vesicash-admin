<template>
  <div class="metric-wrapper">
    <div class="primary-1-text mgb-8 fw-bolder">{{metric.value}}</div>
    <div class="tertiary-2-text neutral-900">{{metric.title}}</div>
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
  padding: toRem(20) toRem(20);
  background: getColor("neutral-10");
}
</style>