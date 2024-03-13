<template>
  <div class="neutral-10-bg fee-table-container">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="fee-table"
      :table_data="getPaginatedCharges"
      :table_header="table_header"
      :is_loading="loading"
      :empty_message="empty_message"
      @emptyAction="$emit('emptyAction')"
      @goToPage="updatePage"
      :pagination="getPagination"
      show_paging
    >
      <ProcessingFeeTableRow
        v-for="(charge, index) in getPaginatedCharges"
        :key="index"
        table_name="fee-table"
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
        <UpdateFeeModal
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
import ProcessingFeeTableRow from "@/modules/pricing/components/processing-fee-table-row";
import UpdateFeeModal from "@/modules/pricing/components/modals/update-fee-modal";

export default {
  name: "FeeTable",

  components: {
    TableContainer,
    ProcessingFeeTableRow,
    UpdateFeeModal,
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

        const getFee = (cost, percent, cap) => {
          const amount = percent ? `${cost}%` : fmt(currency, cost);
          const capped = cap ? ` capped at ${fmt(currency, cap)}` : ``;
          return `${amount}${capped}`;
        };

        const fee = getFee(
          charge?.value?.fee,
          charge?.value?.is_percentage_fee,
          charge?.value?.fee_capped_at
        );

        return { ...charge, range, fee };
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
      table_header: ["#", "Amount", "Fee", "Action"],

      page: 1,
      per_page: 10,

      table_data: [],

      selected_charge: {
        range: "",
        range_id: "",
        fee: "",
        cap: 0,
        currency: "",
        is_percentage_fee: false,
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
          fee: charge.value.fee,
          cap: charge.value.fee_capped_at,
          currency: charge.currency,
          is_percentage_fee: charge.value.is_percentage_fee,
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
.fee-table-container {
  min-height: 30vh;
  border: toRem(1) solid getColor("grey-100");
}

.fee-table {
  &-1 {
    max-width: toRem(80);
  }

  &-2,
  &-3 {
    min-width: toRem(150);
    max-width: toRem(250);
  }

  &-4 {
    max-width: toRem(100);
  }

  .head-data {
    padding: toRem(14) toRem(22) !important;
  }

  .body-data {
    padding: toRem(12) toRem(22) !important;
  }
}
</style>
