<template>
  <div class="user-details-layout">
    <PageBackBtn back_link="/users/manage-users" />

    <div class="top-row mgb-30">
      <div class="page-title">
        {{ $route.query.name || getUserDetails.fullname }}
      </div>
      <button class="btn btn-md btn-primary">Reset Password</button>
    </div>

    <div class="meta-loading-container" v-if="loading_details">
      <div v-for="i in 4" :key="i" class="skeleton-loader"></div>
    </div>

    <UserDetailsMeta :details="getUserDetails" v-else />

    <div class="balance-row mgt-20 mgb-40">
      <UserBalanceCard
        :wallet_balance="mainBalance"
        :loading_wallet="loading_details"
      />
      <UserBalanceCard
        :wallet_balance="escrowBalance"
        :loading_wallet="loading_details"
        escrow
      />
    </div>

    <RouteTabSwitcher :tabs="user_routes" />
    <router-view :loading="loading_details" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
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

  mounted() {
    this.fetchUserDetails();
    this.$bus.$on("refresh_users", this.fetchUserDetails);
  },

  data() {
    return {
      main_balance: [
        {
          sign: "naira",
          value: "0",
          description: "Naira balance",
        },
        {
          sign: "dollar",
          value: "0",
          description: "Dollar balance",
        },
        {
          sign: "pound",
          value: "0",
          description: "Pounds balance",
        },
      ],

      user_profile: {},

      loading_details: false,

      user_routes: [
        {
          name: "PROFILE",
          routeName: "UserProfile",
        },
        {
          name: "ESCROW",
          routeName: "UserEscrowTransactions",
        },
        {
          name: "TRANSACTIONS",
          routeName: "UserWalletFunding",
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
        // {
        //   name: "CONNECTED USERS",
        //   routeName: "UserConnectedUsers",
        // },
        {
          name: "API",
          routeName: "UserAPI",
        },
      ],
    };
  },

  computed: {
    ...mapGetters({ getUserProfile: "users/getUserProfile" }),

    getUserDetails() {
      return {
        userID: this.$route?.params?.userID,
        account_type: this.getUserProfile?.user?.account_type || "-------",
        business_name: this.getUserProfile?.profile?.business?.business_name,
        fullname: `${this.getUserProfile?.user?.firstname || "--------"} ${
          this.getUserProfile?.user?.lastname || "------"
        }`,
        verified: this.getUserProfile?.profile?.is_verified,
      };
    },

    mainBalance() {
      if (!this.getUserProfile?.user?.wallet_balances?.length)
        return [...this.main_balance];

      const naira_balance = this.walletBalance(
        "NGN",
        this.getUserProfile?.user?.wallet_balances
      );
      const dollar_balance = this.walletBalance(
        "USD",
        this.getUserProfile?.user?.wallet_balances
      );

      return [
        {
          sign: "naira",
          value: naira_balance?.available || "0.00",
          description: "Naira balance",
        },
        {
          sign: "dollar",
          value: dollar_balance?.available || "0.00",
          description: "Dollar balance",
        },
        {
          sign: "pound",
          value: "0.00",
          description: "Pounds balance",
        },
      ];
    },

    escrowBalance() {
      if (!this.getUserProfile?.user?.wallet_balances?.length)
        return [...this.main_balance];

      const naira_balance = this.walletBalance(
        "ESCROW_NGN",
        this.getUserProfile?.user?.wallet_balances
      );
      const dollar_balance = this.walletBalance(
        "ESCROW_USD",
        this.getUserProfile?.user?.wallet_balances
      );

      return [
        {
          sign: "naira",
          value: naira_balance?.available || "0.00",
          description: "Naira balance",
        },
        {
          sign: "dollar",
          value: dollar_balance?.available || "0.00",
          description: "Dollar balance",
        },
        {
          sign: "pound",
          value: "0.00",
          description: "Pounds balance",
        },
      ];
    },

    isBusiness() {
      return this.getUserProfile?.user?.account_type === "business";
    },
  },

  methods: {
    ...mapActions({ fetchUserProfile: "users/fetchUserProfile" }),

    walletBalance(currency, wallets) {
      return wallets?.find((wallet) => wallet?.currency === currency);
    },

    async fetchUserDetails() {
      this.loading_details = true;

      try {
        const response = await this.fetchUserProfile(this.$route.params.userID);
        this.loading_details = false;
        if (response.code === 200) this.user_profile = response?.data;
        else
          this.pushToast(
            response?.message || "Failed to load user details",
            "warning"
          );
      } catch (e) {
        this.loading_details = false;
        this.pushToast("Failed to load user details", "warning");
        console.log("ERROR FETCHING USER DETAILS", e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.user-details-layout {
  padding-bottom: toRem(100);
}

.top-row {
  @include flex-row-between-nowrap;
}

.balance-row {
  @include flex-row-start-wrap;
  gap: toRem(30);
}

.meta-loading-container {
  @include flex-row-start-wrap;
  gap: toRem(20);
  margin-bottom: toRem(40);

  div {
    height: toRem(60);
    width: toRem(150);
  }
}
</style>
