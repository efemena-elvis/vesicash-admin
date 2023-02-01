<template>
  <div>
    <UserNavbar />

    <div class="metric-container">
      <div class="top-row">
        <div class="h4-text">Your metrics</div>
        <div class="date-wrapper"></div>
      </div>

      <div class="metric-cards-container pdy-30">
        <MetricCard v-for="i in 13" :key="i" />
      </div>
    </div>
  </div>
</template>

<script>
import UserNavbar from "@/shared/components/nav-comps/user-navbar";
import MetricCard from "@/modules/dashboard/components/metric-card";

export default {
  name: "Dashbooard",

  components: {
    UserNavbar,
    MetricCard,
  },
};
</script>

<style lang="scss" scoped>
.metric-container {
  padding-top: toRem(60);

  @include breakpoint-down(lg) {
    padding-top: 0;
  }

  .top-row {
    @include flex-row-between-nowrap;

    .date-wrapper {
      min-width: toRem(170);
      border: toRem(1) solid getColor("neutral-900");
      padding: toRem(10);
    }
  }

  .metric-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: toRem(30);
  }
}
</style>

<style lang="scss">
.layout-base {
  .content-build {
    background: getColor("grey-10");
  }
}
</style>