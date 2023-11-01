<template>
  <div>
    <div class="d-flex justify-content-end mgy-20">
      <button
        class="btn btn-primary btn-md"
        @click="toggleAddRateModal"
        :disabled="loading"
      >
        Add Wallet Charge
      </button>
    </div>

    <RouteTabSwitcher
      controlled
      v-if="tabs.length"
      :tabs="tabs"
      class="mgy-30"
    />
    <ChargeTable
      :charges="sortedCharges"
      :loading="loading"
      type="wallet_funding"
      @refresh="fetchAllCharges"
    />

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_add_rate">
        <UpdateChargeModal
          @closeTriggered="toggleAddRateModal"
          :charge_details="chargeDefaults"
          @done="fetchAllCharges"
          title="Wallet Funding Charge"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ChargeTable from "@/modules/pricing/components/charge-table";
import RouteTabSwitcher from "@/shared/components/route-tab-switcher";
import UpdateChargeModal from "@/modules/pricing/components/modals/update-charge-modal";
export default {
  name: "FundingPricingPage",

  components: {
    ChargeTable,
    RouteTabSwitcher,
    UpdateChargeModal,
  },

  computed: {
    ...mapGetters({
      getCharges: "pricing/getCharges",
      getMORCountries: "mor/getMORCountries",
    }),

    chargeDefaults() {
      return {
        range: "",
        range_id: "",
        card_fee: "",
        card_cap: 0,
        bank_transfer_fee: "",
        bank_transfer_cap: 0,
        currency: "",
        is_percentage_card_fee: false,
        is_percentage_transfer_fee: false,
        type: "wallet_funding",
      };
    },

    charges() {
      if (!this.getCharges?.wallet_funding) return [];
      const first_key = Object.keys(this.getCharges?.wallet_funding)?.[0];
      return this.getCharges?.wallet_funding?.[
        this.$route?.query?.currency || first_key
      ];
    },

    sortedCharges() {
      return this.charges
        ? [...this.charges].sort(
            (a, b) => Number(a.min_value) - Number(b.min_value)
          )
        : [];
    },

    tabs() {
      return this.getCharges?.wallet_funding
        ? Object.keys(this.getCharges?.wallet_funding).map(
            (currency, index) => {
              const active = this.$route?.query?.currency
                ? this.$route?.query?.currency === currency
                : index === 0;
              const query = currency;
              const name = `${currency} currency`;
              return {
                active,
                query,
                name,
              };
            }
          )
        : [];
    },
  },

  async mounted() {
    if (!this.getCharges?.wallet_funding) this.fetchAllCharges();
  },

  data() {
    return {
      show_add_rate: false,
      loading: false,
    };
  },

  methods: {
    ...mapActions({ fetchCharges: "pricing/fetchCharges" }),

    toggleAddRateModal() {
      this.show_add_rate = !this.show_add_rate;
    },

    async fetchAllCharges() {
      this.loading = true;
      await this.fetchCharges("wallet_funding");
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
