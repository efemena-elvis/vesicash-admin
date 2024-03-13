<template>
  <div class="neutral-10-bg charge-table-container">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="charge-table"
      :table_data="getPaginatedCharges"
      :table_header="table_header"
      :is_loading="loading"
      :empty_message="empty_message"
      @emptyAction="$emit('emptyAction')"
      @goToPage="updatePage"
      :pagination="getPagination"
      show_paging
    >
      <ChargeTableRow
        v-for="(charge, index) in getPaginatedCharges"
        :key="index"
        table_name="charge-table"
        :data="charge"
        :index="
          index + 1 + (getPagination.current_page - 1) * getPagination.per_page
        "
        @action="toggleUpdateRateModal"
      />
    </TableContainer>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_update_rate">
        <UpdateChargeModal
          @closeTriggered="toggleUpdateRateModal"
          :charge_details="selected_charge"
          @done="$emit('refresh')"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TableContainer from "@/shared/components/table-comps/table-container";
import ChargeTableRow from "@/modules/pricing/components/charge-table-row";
import UpdateChargeModal from "@/modules/pricing/components/modals/update-charge-modal";

export default {
  name: "ChargeTable",

  components: {
    TableContainer,
    ChargeTableRow,
    UpdateChargeModal,
  },

  props: {
    charges: {
      type: Array,
      default: () => [],
    },

    loading: {
      type: Boolean,
      default: false,
    },

    type: {
      type: String,
      default: "",
    },
  },

  computed: {
    ...mapGetters({ getChargeRanges: "pricing/getChargeRanges" }),

    selectedCharged() {
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
    getCharges() {
      return Array.from({ length: 50 }, (_, index) => index + 1);
    },

    getPaginatedCharges() {
      const { per_page } = this;
      const charges = [...this.charges]?.map((charge) => {
        const fmt = (currency, amount) =>
          `${this.$money.getSign(currency)}${this.$money?.addComma(amount)}`;

        const currency = charge?.currency;

        const range =
          charge.max_value > 0
            ? `${fmt(currency, charge.min_value)} - ${fmt(
                currency,
                charge.max_value
              )}`
            : `> ${fmt(currency, charge.min_value - 1)}`;

        const fee = (cost, percent, cap) => {
          const amount = percent ? `${cost}%` : fmt(currency, cost);
          const capped = cap ? ` capped at ${fmt(currency, cap)}` : ``;
          return `${amount}${capped}`;
        };

        const card_fee = fee(
          charge?.value?.card_fee,
          charge?.value?.is_percentage_card_fee,
          charge?.value?.card_fee_capped_at
        );
        const bank_fee = fee(
          charge?.value?.bank_fee,
          charge?.value?.is_percentage_bank_fee,
          charge?.value?.bank_fee_capped_at
        );

        return { ...charge, range, card_fee, bank_fee };
      });
      const max_index = Math.max(0, Math.ceil(charges.length / per_page));
      const index = Math.min(this.page - 1, max_index);
      const start_range = per_page * index;
      const end_range = start_range + per_page;
      return charges.slice(start_range, end_range);
    },

    //   getPagination() {
    //     return {
    //       current_page: this.getConnectedUsers?.current_page,
    //       per_page: this.getConnectedUsers?.per_page,
    //       last_page: this.getConnectedUsers?.last_page,
    //       from: this.getConnectedUsers?.from,
    //       to: this.getConnectedUsers?.to,
    //       total: this.getConnectedUsers?.total,
    //     };
    //   },

    getPagination() {
      const charges = [...this.charges];
      const { per_page } = this;
      const current_page = this.page;

      const max_index = Math.max(0, Math.ceil(charges.length / per_page));
      const index = Math.min(this.page - 1, max_index);
      const from = per_page * index;
      const to = Math.min(from + per_page, charges.length);

      return {
        current_page,
        per_page,
        last_page: Math.ceil(charges.length / per_page),
        from: from + 1,
        to,
        total: charges.length,
      };
    },
  },

  data() {
    return {
      table_header: ["#", "Amount", "Card fee", "Bank transfer fee", "Action"],

      page: 1,
      per_page: 10,

      table_data: [],

      selected_charge: {
        range: "",
        range_id: "",
        card_fee: "",
        card_cap: 0,
        bank_transfer_fee: "",
        bank_transfer_cap: 0,
        currency: "",
        is_percentage_card_fee: false,
        is_percentage_transfer_fee: false,
        type: this.type,
      },

      table_loading: false,
      pagination: {
        current_page: 1,
        per_page: 10,
        last_page: 3,
        from: 1,
        to: 20,
        total: 50,
      },
      paginatedData: {},
      paginationPages: {},
      empty_message: "No match found",
      show_update_rate: false,
      range_id: "",
    };
  },

  watch: {
    "$route.query.page": {
      handler(page) {
        if (page) this.page = Number(page);
      },
      immediate: true,
      deep: true,
    },
  },

  mounted() {
    this.fetchCharges(this.page);
  },

  methods: {
    toggleUpdateRateModal(data) {
      if (data) {
        const charge = data;
        const currency = data?.currency;
        const fmt = (currency, amount) =>
          `${this.$money.getSign(currency)}${this.$money?.addComma(amount)}`;

        const range =
          charge.max_value > 0
            ? `${fmt(currency, charge.min_value)} - ${fmt(
                currency,
                charge.max_value
              )}`
            : `> ${fmt(currency, charge.min_value - 1)}`;

        const range_id =
          this.getChargeRanges?.find((range) => {
            return (
              range?.max_value === charge?.max_value ||
              range?.min_value === charge?.min_value
            );
          })?.id || 2;

        this.selected_charge = {
          id: charge.id,
          range,
          range_id,
          card_fee: charge.value.card_fee,
          card_cap: charge.value.card_fee_capped_at,
          bank_transfer_fee: charge.value.bank_fee,
          bank_transfer_cap: charge.value.bank_fee_capped_at,
          currency: charge.currency,
          is_percentage_card_fee: charge.value.is_percentage_card_fee,
          is_percentage_transfer_fee: charge.value.is_percentage_bank_fee,
          type: this.type,
        };
      }

      this.show_update_rate = !this.show_update_rate;
    },

    updatePage(page) {
      this.page = Number(page);
      const query = { ...this.$route?.query, page };

      this.$router.replace({
        path: this.$route.path,
        query: { ...query },
      });
    },

    fetchCharges(page) {
      this.table_loading = true;

      setTimeout(() => {
        this.table_loading = false;
      }, 2500);

      this.page = page;
    },
  },
};
</script>

<style lang="scss">
.charge-table-container {
  min-height: 35vh;
  border: toRem(1) solid getColor("grey-100");
}

.charge-table {
  &-1 {
    max-width: toRem(50);
  }

  &-2,
  &-3,
  &-4 {
    min-width: toRem(150);
    max-width: toRem(220);
  }

  &-5 {
    max-width: toRem(120);
  }

  .head-data {
    padding: toRem(14) toRem(22) !important;
  }

  .body-data {
    padding: toRem(12) toRem(22) !important;
  }
}
</style>
