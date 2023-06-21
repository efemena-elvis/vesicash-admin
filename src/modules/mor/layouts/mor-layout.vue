<template>
  <div class="pdb-50">
    <div class="top-row mgb-30">
      <div class="page-title">{{ $route.meta.name }}</div>

      <div class="right-row">
        <button
          class="btn btn-md btn-primary"
          @click="togglePayoutModal"
          :disabled="loading_summary"
        >
          Payouts to wallets
        </button>
        <button
          class="btn btn-md btn-primary"
          @click="toggleTransactionRecordModal"
        >
          Record transaction
        </button>
      </div>
    </div>

    <MorTransactionSummaryCard :loading="loading_summary" />

    <RouteTabSwitcher :tabs="morRoutes" class="mgt-30" :plain="false" />

    <RouterView />

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_transaction_record_modal">
        <RecordMorTransactionModal
          @closeTriggered="toggleTransactionRecordModal"
        />
      </transition>

      <transition name="fade" v-if="show_payout_modal">
        <PayoutMorModal @closeTriggered="togglePayoutModal" />
      </transition>
    </portal>
  </div>
</template>

<script>
import MorTransactionSummaryCard from "../components/mor-transaction-summary-card.vue";
import RouteTabSwitcher from "@/shared/components/route-tab-switcher";
import RecordMorTransactionModal from "@/modules/mor/components/modals/record-mor-transaction-modal";
import PayoutMorModal from "@/modules/mor/components/modals/payout-mor-modal";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "MORLayout",

  components: {
    MorTransactionSummaryCard,
    RouteTabSwitcher,
    RecordMorTransactionModal,
    PayoutMorModal,
  },

  computed: {
    ...mapGetters({
      getMORSummary: "mor/getMORSummary",
    }),

    morRoutes() {
      return [
        {
          name: "MOR Transactions",
          route: "/mor/transactions",
        },
        {
          name: "MOR Payouts",
          route: "/mor/payouts",
        },
      ];
    },
  },

  data() {
    return {
      loading_summary: false,
      show_transaction_record_modal: false,
      show_payout_modal: false,
    };
  },

  async mounted() {
    this.loadSummary();
    await this.fetchMORUsers();
    await this.fetchMORCountries();
  },

  created() {
    this.$bus.$on("refreshMOR", () => {
      this.loadSummary(true);
    });
  },

  methods: {
    ...mapActions({
      fetchMORSummary: "mor/fetchMORSummary",
      fetchMORUsers: "mor/fetchMORUsers",
      fetchMORCountries: "mor/fetchMORCountries",
    }),

    async loadSummary(ignore = false) {
      if (this.getMORSummary?.length && !ignore) return;
      try {
        this.loading_summary = true;
        const res = await this.fetchMORSummary();
        this.loading_summary = false;
        if (res?.status !== "success") this.pushToast(res.message, "warning");
      } catch (err) {
        this.loading_summary = false;
        this.pushToast("Failed to load MOR summary", "warning");
      }
    },

    toggleTransactionRecordModal() {
      this.show_transaction_record_modal = !this.show_transaction_record_modal;
    },

    togglePayoutModal() {
      this.show_payout_modal = !this.show_payout_modal;
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
</style>
