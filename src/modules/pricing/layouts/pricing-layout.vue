<template>
  <div>
    <div class="top-row mgb-30">
      <div class="page-title">{{ $route.meta.name || "Pricing" }}</div>
    </div>

    <RouteTabSwitcher :tabs="tabs" />
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import RouteTabSwitcher from "@/shared/components/route-tab-switcher";

export default {
  name: "PricingLayout",

  components: {
    RouteTabSwitcher,
  },

  computed: {
    ...mapGetters({
      getMORCountries: "mor/getMORCountries",
      getChargeRanges: "pricing/getChargeRanges",
    }),

    tabs() {
      return [
        {
          name: "WALLET FUNDING",
          route: "wallet-funding",
        },
        {
          name: "WALLET WITHDRAWAL",
          route: "wallet-withdrawal",
        },
        {
          name: "MOR TRANSACTION",
          route: "mor",
        },
        {
          name: "MOR WITHDRAWAL",
          route: "mor-withdrawal",
        },
        {
          name: "ESCROW",
          route: "escrow",
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

  async mounted() {
    if (!this.getMORCountries?.length) await this.fetchMORCountries();
    if (!this.getChargeRanges?.length) await this.fetchChargeRanges();
  },

  methods: {
    ...mapActions({
      fetchMORCountries: "mor/fetchMORCountries",
      fetchChargeRanges: "pricing/fetchChargeRanges",
    }),
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
