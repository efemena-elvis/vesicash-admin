<template>
  <div>
    <PageBackBtn back_link="/users/manage-users" />

    <div class="top-row mgb-30">
      <div class="page-title">Oladele Bangalee</div>
      <button class="btn btn-md btn-primary">Reset Password</button>
    </div>

    <UserDetailsMeta :details="getUserDetails" />

    <div class="balance-row mgt-20 mgb-40">
      <UserBalanceCard :wallet_balance="main_balance" :loading_wallet="false" />
      <UserBalanceCard :wallet_balance="main_balance" :loading_wallet="false" escrow />
    </div>

    <RouteTabSwitcher :tabs="user_routes" />
    <router-view />
  </div>
</template>

<script>
import PageBackBtn from "@/shared/components/page-back-btn";
import UserDetailsMeta from "@/modules/users/components/profile/user-details-meta";
import UserBalanceCard from "@/modules/users/components/profile/user-balance-card";
import RouteTabSwitcher from "@/shared/components/route-tab-switcher";
export default {
  name: "UserLayout",

  components: {
    PageBackBtn,
    UserBalanceCard,
    UserDetailsMeta,
    RouteTabSwitcher,
  },

  data() {
    return {
      main_balance: [
        {
          sign: "naira",
          value: "450000",
          description: "Naira balance",
        },
        {
          sign: "dollar",
          value: "500",
          description: "Dollar balance",
        },
        {
          sign: "pound",
          value: "590",
          description: "Pounds balance",
        },
      ],

      user_routes: [
        {
          name: "PROFILE",
          routeName: "UserProfile",
        },
        {
          name: "ESCROW TXN",
          routeName: "UserEscrowTransactions",
        },
        {
          name: "WALLET TXN",
          routeName: "UserWalletTransactions",
        },
        {
          name: "VERIFICATION",
          routeName: "UserVerification",
        },
        {
          name: "EXCHANGE TXN",
          routeName: "UserExchangeTransactions",
        },
        {
          name: "BANK INFO",
          routeName: "UserBankAccounts",
        },
        {
          name: "API",
          routeName: "UserAPI",
        },
      ],
    };
  },

  computed: {
    getUserDetails() {
      return {
        userID: this.$route?.params?.userID,
        account_type: "Business",
        business_name: "Candy studios",
        verified: false,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.top-row {
  @include flex-row-between-nowrap;
}

.balance-row {
  @include flex-row-start-wrap;
  gap: toRem(30);
}
</style>
