<template>
  <div>
    <div class="top-row mgb-30">
      <div class="page-title">Exchange</div>

      <div class="right-row">
        <button class="btn btn-md btn-primary">Load balance</button>
        <button class="btn btn-md btn-primary" @click="toggleRateModal">
          Change rate
        </button>
      </div>
    </div>

    <div v-if="loading_stats" class="metric-cards-container">
      <div
        class="metric-skeleton skeleton-loader"
        v-for="i in 10"
        :key="i"
      ></div>
    </div>

    <div class="metric-cards-container pdy-30" v-else>
      <MetricCard
        v-for="metric in fxStats"
        :key="metric.title"
        :metric="metric"
      />

      <MetricCard :metric="{ title: nairaDollarTitle, value: nairaDollarRate }">
        <div class="swap-icon-wrapper" @click="naira_dollar = !naira_dollar">
          <RateSwapIcon :swapped="naira_dollar" />
        </div>
      </MetricCard>

      <MetricCard :metric="{ title: nairaPoundTitle, value: nairaPoundRate }">
        <div class="swap-icon-wrapper" @click="naira_pound = !naira_pound">
          <RateSwapIcon :swapped="naira_pound" />
        </div>
      </MetricCard>

      <MetricCard :metric="{ title: dollarPoundTitle, value: dollarPoundRate }">
        <div class="swap-icon-wrapper" @click="dollar_pound = !dollar_pound">
          <RateSwapIcon :swapped="dollar_pound" />
        </div>
      </MetricCard>
    </div>

    <RouteTabSwitcher :tabs="tabs" />

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_update_rate_modal">
        <UpdateRateModal
          @closeTriggered="toggleRateModal"
          @updateRate="fetchAllStats"
        />
      </transition>
    </portal>

    <router-view />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import MetricCard from "@/modules/dashboard/components/metric-card";
import RateSwapIcon from "@/shared/components/icon-comps/rate-swap-icon";
import RouteTabSwitcher from "@/shared/components/route-tab-switcher";
import UpdateRateModal from "@/modules/foreign-exchange/components/modals/update-rate-modal";

export default {
  name: "FXLayout",

  components: {
    MetricCard,
    RateSwapIcon,
    RouteTabSwitcher,
    UpdateRateModal,
  },

  computed: {
    ...mapGetters({ getFXStats: "fx/getFXStats" }),

    tabs() {
      return [
        {
          name: "FX TRANSACTIONS",
          routeName: "FXTransactions",
        },
        {
          name: "RATE HISTORY",
          routeName: "FXRateHistory",
        },
      ];
    },

    fxStats() {
      const {
        exchange_transactions,
        dollar_exchange_transaction,
        naira_exchange_transaction,
        pounds_exchange_transaction,
      } = this.getFXStats;

      return [
        {
          title: "Exchange Transactions",
          value: this.$string.formattedBulkUnit(exchange_transactions),
        },
        {
          title: "Dollar transaction",
          value: `${this.$money.getSign(
            "dollar"
          )}${this.$string.formattedBulkUnit(dollar_exchange_transaction)}`,
        },
        {
          title: "Naira transaction",
          value: `${this.$money.getSign(
            "naira"
          )}${this.$string.formattedBulkUnit(naira_exchange_transaction)}`,
        },
        {
          title: "Pound transaction",
          value: `${this.$money.getSign(
            "pound"
          )}${this.$string.formattedBulkUnit(pounds_exchange_transaction)}`,
        },
        {
          title: "Dollar balance",
          value: "",
        },
        {
          title: "Naira balance",
          value: "",
        },
        {
          title: "Pounds balance",
          value: "",
        },
      ];
    },

    nairaDollarRate() {
      const { naira_dollar, dollar_naira } = this.getFXStats;
      return this.naira_dollar
        ? `${this.sign("naira")}1/${this.sign("dollar")}${naira_dollar}`
        : `${this.sign("dollar")}1/${this.sign("naira")}${dollar_naira}`;
    },

    nairaDollarTitle() {
      return this.naira_dollar ? "NGN/USD rate" : "USD/NGN rate";
    },

    nairaPoundRate() {
      const { naira_pound, pound_naira } = this.getFXStats;
      return this.naira_pound
        ? `${this.sign("naira")}1/${this.sign("pound")}${naira_pound}`
        : `${this.sign("pound")}1/${this.sign("naira")}${pound_naira}`;
    },

    nairaPoundTitle() {
      return this.naira_pound ? "NGN/GBP rate" : "GBP/NGN rate";
    },

    dollarPoundRate() {
      const { dollar_pound, pound_dollar } = this.getFXStats;
      return this.dollar_pound
        ? `${this.sign("dollar")}1/${this.sign("pound")}${dollar_pound}`
        : `${this.sign("pound")}1/${this.sign("dollar")}${pound_dollar}`;
    },

    dollarPoundTitle() {
      return this.dollar_pound ? "USD/GBP rate" : "GBP/USD rate";
    },
  },

  mounted() {
    this.fetchAllStats();
  },

  data() {
    return {
      loading_stats: false,
      naira_dollar: false,
      naira_pound: false,
      dollar_pound: false,
      show_update_rate_modal: false,
    };
  },

  methods: {
    ...mapActions({ fetchFXStats: "fx/fetchFXStats" }),

    toggleRateModal() {
      this.show_update_rate_modal = !this.show_update_rate_modal;
    },

    async fetchAllStats() {
      this.loading_stats = true;
      try {
        const response = await this.fetchFXStats();
        this.loading_stats = false;
        if (response?.code !== 200)
          this.pushToast(
            response?.message || "Failed to load FX Stats",
            "warning"
          );
      } catch (err) {
        console.log("FAILED TO LOAD FX STATS", err);
        this.pushToast("Failed to load FX Stats", "error");
        this.loading_stats = false;
      }
    },

    sign(currency) {
      return this.$money?.getSign(currency);
    },
  },
};
</script>

<style lang="scss" scoped>
.top-row {
  @include flex-row-between-nowrap;

  .right-row {
    @include flex-row-start-nowrap;
    gap: toRem(20);
    margin-left: auto;

    @include breakpoint-down(xs) {
      @include flex-row-start-wrap;
      margin: 0;
      width: 100%;

      .btn {
        width: 100%;
      }
    }
  }

  .page-title {
    @include breakpoint-down(lg) {
      display: none;
    }
  }
}

.metric-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: toRem(30);
  margin-bottom: toRem(40);

  .metric-skeleton {
    height: 60px;
    width: 100%;
  }

  .swap-icon-wrapper {
    @include draw-shape(42);
    @include flex-column-center;
    @include center-placement("y-axis");
    background: getColor("teal-50");
    position: absolute;
    right: toRem(15);
    cursor: pointer;
    border-radius: 50%;
  }
}
</style>
