<template>
  <div class="mgt-20">
    <RouteTabSwitcher exact :plain="false" :tabs="tabs" class="mgb-20" />
    <router-view />
  </div>
</template>

<script>
import RouteTabSwitcher from "@/shared/components/route-tab-switcher";

export default {
  name: "UserTransactions",

  components: {
    RouteTabSwitcher,
  },

  data() {
    return {
      tabs: [
        {
          name: "Funding",
          routeName: "UserWalletFunding",
        },
        {
          name: "Withdrawal",
          routeName: "UserWalletWithdrawal",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>