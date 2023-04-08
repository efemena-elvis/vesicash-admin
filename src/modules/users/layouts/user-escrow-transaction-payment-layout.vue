<template>
  <div class="mgt-15">
    <RouteTabSwitcher
      exact
      :plain="false"
      :tabs="paymentsTabs"
      class="mgb-40"
    />
    <router-view
      :loading="loading"
      :transaction="transaction"
      :payments="payments"
    />
  </div>
</template>

<script>
import RouteTabSwitcher from "@/shared/components/route-tab-switcher";

export default {
  name: "UserEscrowTransactionPayment",

  components: {
    RouteTabSwitcher,
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },

    transaction: {
      type: Object,
      default: () => null,
    },

    payments: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    paymentsTabs() {
      const { userID } = this.$route?.params;

      return userID
        ? [
            {
              name: "Payments",
              routeName: "UserEscrowTransactionPayments",
            },
            {
              name: "Disbursements",
              routeName: "UserEscrowTransactionDisbursements",
            },
          ]
        : [
            {
              name: "Payments",
              routeName: "EscrowTransactionPayments",
            },
            {
              name: "Disbursements",
              routeName: "EscrowTransactionDisbursements",
            },
          ];
    },
  },

  data() {
    return {
      tabs: [
        {
          name: "Payments",
          routeName: "UserEscrowTransactionPayments",
        },
        {
          name: "Disbursements",
          routeName: "UserEscrowTransactionDisbursements",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
