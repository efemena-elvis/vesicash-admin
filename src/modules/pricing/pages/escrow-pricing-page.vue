<template>
  <div>
    <div class="d-flex justify-content-end mgy-20">
      <button
        class="btn btn-primary btn-md"
        @click="toggleAddRateModal"
        :disabled="loading"
      >
        Add Escrow Charge
      </button>
    </div>

    <RouteTabSwitcher
      controlled
      v-if="tabs.length"
      :tabs="tabs"
      class="mgy-30"
    />
    <ProcessingFeeTable
      :charges="sortedCharges"
      :loading="loading"
      type="escrow"
      @refresh="fetchAllCharges"
    />

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_add_rate">
        <UpdateFeeModal
          @closeTriggered="toggleAddRateModal"
          :charge_details="chargeDefaults"
          @done="fetchAllCharges"
          title="Escrow charge"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ProcessingFeeTable from "@/modules/pricing/components/processing-fee-table";
import RouteTabSwitcher from "@/shared/components/route-tab-switcher";
import UpdateFeeModal from "@/modules/pricing/components/modals/update-fee-modal";
export default {
  name: "EscrowPricingPage",

  components: {
    ProcessingFeeTable,
    RouteTabSwitcher,
    UpdateFeeModal,
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
        fee: "",
        cap: 0,
        currency: "",
        is_percentage_fee: false,
        type: "escrow",
      };
    },

    charges() {
      if (!this.getCharges?.escrow) return [];
      const first_key = Object.keys(this.getCharges?.escrow)?.[0];
      return this.getCharges?.escrow?.[
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
      return this.getCharges?.escrow
        ? Object.keys(this.getCharges?.escrow).map((currency, index) => {
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
          })
        : [];
    },
  },

  async mounted() {
    if (!this.getCharges?.escrow) this.fetchAllCharges();
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
      await this.fetchCharges("escrow");
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
