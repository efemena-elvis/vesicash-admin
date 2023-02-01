<template>
  <div class="metric-wrapper">
    <div class="primary-1-text mgb-8 fw-bold">34.2M</div>
    <div class="tertiary-2-text">Transaction volume</div>
  </div>
</template>

<script>
export default {
  name: "MetricCard",
};
</script>

<style lang="scss" scoped>
.metric-wrapper {
  padding: toRem(20) toRem(20);
  background: getColor("neutral-10");
}
</style>