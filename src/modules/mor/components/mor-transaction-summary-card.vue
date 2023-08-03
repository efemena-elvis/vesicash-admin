<template>
  <div class="summary-card">
    <div class="h5-text w-100 mgb-20">
      Total Processed {{ summaryType }} summary
    </div>
    <div class="balance-block-wrapper" v-if="loading">
      <div class="skeleton-loader" v-for="i in 4" :key="i"></div>
    </div>

    <div class="balance-block-wrapper" v-else>
      <div
        class="balance-block"
        v-for="option in summary"
        :key="option.currency"
      >
        <div class="secondary-3-text grey-700 mgb-4 text-uppercase">
          {{ option.currency }} {{ summaryType }}
        </div>
        <div class="h5-text teal-800">
          {{ formattedAmount(option.currency, option.amount) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "MORTransactionSummaryCard",

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters({
      getMORSummary: "mor/getMORSummary",
      getMORPayoutSummary: "mor/getMORPayoutSummary",
      getMORWithdrawalsSummary: "mor/getMORWithdrawalsSummary",
    }),

    summary() {
      const routeName = this.$route?.name;

      switch (routeName) {
        case "MORPayouts":
          return this.getMORPayoutSummary;
        case "MORTransactions":
          return this.getMORSummary;
        case "MORWithdrawals":
          return this.getMORWithdrawalsSummary;
        default:
          return this.getMORSummary;
      }
    },

    summaryType() {
      const routeName = this.$route?.name;

      switch (routeName) {
        case "MORPayouts":
          return "Payouts";
        case "MORTransactions":
          return "Transactions";
        case "MORWithdrawals":
          return "Withdrawals";
        default:
          return "Transactions";
      }
    },
  },

  methods: {
    formattedAmount(currency, cost) {
      const amount = `${this.$money?.getSign(currency)}${this.$money?.addComma(
        cost
      )}`;

      return amount;
    },
  },
};
</script>

<style lang="scss" scoped>
.summary-card {
  border-radius: toRem(8);
  box-shadow: 0.436607px -0.436607px 0.436607px rgba(51, 49, 49, 0.06),
    -0.436607px 0.436607px 0.436607px rgba(51, 49, 49, 0.06);
  border: toRem(0.4) getColor("teal-200") solid;
  padding: toRem(15) toRem(20);
  background: getColor("neutral-10");

  .balance-block-wrapper {
    // @include flex-row-start-wrap;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
    gap: toRem(25) 20px;
    & > .balance-block {
      border-right: toRem(1.5) getColor("grey-100") solid;
      padding-right: 15px;

      &:last-child:nth-of-type(n) {
        border: 0;
      }
    }

    & > .skeleton-loader {
      min-height: toRem(70);
    }
  }
}
</style>
