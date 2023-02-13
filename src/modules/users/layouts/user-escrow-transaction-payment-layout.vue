<template>
  <div class="mgt-15">
    <RouteTabSwitcher exact :plain="false" :tabs="tabs" class="mgb-40" />
    <router-view />
  </div>
</template>

<script>
import RouteTabSwitcher from "@/shared/components/route-tab-switcher";

export default {
  name: "UserEscrowTransactionPayment",

  components: {
    RouteTabSwitcher,
  },

  computed: {
    paymentsTab() {
      return [
        {
          name: "Payments",
          route: "",
        },
        {
          name: "Disbursements",
          route: "disbursements",
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

<style lang="scss" scoped>
</style>