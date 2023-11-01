<template>
  <div class="mgt-20">
    <RouteTabSwitcher controlled :tabs="tabs" class="mgb-20" />

    <UserNairaAccountTable
      :loading="loading"
      :accounts="getNairaAccounts"
      v-if="tabs[0].active"
    />

    <UserDollarAccountTable
      :loading="loading"
      :accounts="getDollarAccounts"
      v-else
    />
  </div>
</template>

<script>
import RouteTabSwitcher from "@/shared/components/route-tab-switcher";
import { mapGetters } from "vuex";
import UserNairaAccountTable from "@/modules/users/components/bank/user-naira-account-table";
import UserDollarAccountTable from "@/modules/users/components/bank/user-dollar-account-table";

export default {
  name: "UserBankAccounts",

  components: {
    UserNairaAccountTable,
    RouteTabSwitcher,
    UserDollarAccountTable,
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters({ getUserProfile: "users/getUserProfile" }),

    getAccounts() {
      return this.getUserProfile?.user?.bank_details?.length
        ? this.getUserProfile?.user?.bank_details
        : [];
    },

    getNairaAccounts() {
      return this.getAccounts.filter((acct) => acct.currency === "NGN");
    },

    getDollarAccounts() {
      return this.getAccounts.filter((acct) => acct.currency === "USD");
    },

    tabs() {
      return [
        {
          name: "Naira",
          query: "naira",
          active:
            !this.$route?.query?.currency ||
            this.$route?.query?.currency === "naira",
        },

        {
          name: "Dollar",
          query: "dollar",
          active: this.$route?.query?.currency === "dollar",
        },
      ];
    },
  },
};
</script>

<style></style>
