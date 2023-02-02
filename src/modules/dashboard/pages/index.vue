<template>
  <div>
    <div class="metric-container">
      <!-- METRICS CONTAINER -->
      <template>
        <div class="mgb-30">
          <div class="top-row mgb-20">
            <div class="page-title">Overview</div>

            <div class="date-wrapper"></div>
          </div>

          <div class="metric-cards-container pdy-30">
            <MetricCard
              v-for="metric in metrics"
              :key="metric.title"
              :metric="metric"
            />
          </div>
        </div>
      </template>

      <!-- GRAPH CONTAINER -->
      <template>
        <div>
          <div class="page-title mgb-25">Graphical metrics</div>

          <div class="metric-graphs-container pdy-20">
            <div class="neutral-10-bg pd-15">
              <div class="mgb-20 secondary-2-text">Transaction Volume</div>
              <MetricGraph />
            </div>

            <div class="neutral-10-bg pd-15">
              <div class="mgb-20 secondary-2-text">No. of users</div>
              <MetricGraph barColor="#0B618F" label="Users" />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import MetricCard from "@/modules/dashboard/components/metric-card";
import MetricGraph from "@/modules/dashboard/components/metric-graph";

export default {
  name: "Dashbooard",

  components: {
    MetricCard,
    MetricGraph,
  },

  data() {
    return {
      metrics: [
        {
          title: "Transaction volume",
          value: "34.2M",
        },
        {
          title: "Active transaction ",
          value: "498",
        },
        {
          title: "Completed transaction",
          value: "201K",
        },
        {
          title: "Registered users",
          value: "1545",
        },
        {
          title: "No of verified users",
          value: "1524",
        },
        {
          title: "Dollar balance",
          value: "$670K",
        },
        {
          title: "Naira balance",
          value: "₦234M",
        },
        {
          title: "Pounds balance",
          value: "£134M",
        },
        {
          title: "Exchange transactions",
          value: "234k",
        },
        {
          title: "GBP/USD rate",
          value: "£1/$340",
        },

        {
          title: "NGN/USD rate",
          value: "£1/$340",
        },
        {
          title: "NGN/GBP rate",
          value: "£1/$340",
        },
        {
          title: "Naira exchange balance",
          value: "₦490M",
        },
        {
          title: "Active keys",
          value: "13",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.metric-container {
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

  .metric-graphs-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: toRem(30);
  }
}
</style>