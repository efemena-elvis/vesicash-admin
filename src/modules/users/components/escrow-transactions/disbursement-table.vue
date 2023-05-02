<template>
  <div class="disbursement-table-container neutral-10-bg">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="disbursement-tb"
      :table_data="disbursements"
      :table_header="table_header"
      :is_loading="loading"
      :empty_message="getEmptyMessage"
    >
      <template v-for="(data, index) in disbursements">
        <DisbursementTableRow
          :index="index + 1"
          :key="index"
          table_name="disbursement-tb"
          :data="data"
          :currency="currency"
          :reference="reference"
          :type="type"
          :title="title"
          :transaction="transaction"
          @view="$emit('view')"
        />
      </template>
    </TableContainer>
  </div>
</template>

<script>
import TableContainer from "@/shared/components/table-comps/table-container";
import { escrow_disbursement_table_empty_states as EMPTY_STATES } from "@/utilities/status";

export default {
  name: "DisbursementTable",

  components: {
    TableContainer,
    DisbursementTableRow: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/users/components/escrow-transactions/disbursement-table-row"
      ),
  },

  props: {
    disbursements: {
      type: Array,
      default: () => [],
    },

    loading: {
      type: Boolean,
      default: false,
    },

    currency: {
      type: String,
      default: "NGN",
    },

    reference: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      default: "",
    },

    transaction: {
      type: Object,
      default: () => null,
    },
  },

  computed: {
    getEmptyMessage() {
      const status = this?.transaction?.status?.toLowerCase() || "failed";
      return EMPTY_STATES[status];
    },
  },

  data() {
    return {
      EMPTY_STATES,
      table_header: [
        "#",
        // "Date",
        "Paid to",
        "User role",
        "Amount received",
        // "Payment method",
        // "Status",
        "Action",
      ],
    };
  },
};
</script>

<style lang="scss">
.disbursement-table-container {
  border: toRem(1) solid getColor("grey-100");
  min-height: 35vh;
}

.disbursement-tb {
  &-1,
  &-8 {
    min-width: toRem(50);
  }

  &-2 {
    min-width: toRem(200);
    max-width: toRem(230);
  }

  &-5,
  &-6,
  &-7 {
    max-width: toRem(180);
    min-width: toRem(160);
  }

  &-4 {
    min-width: toRem(160);
  }

  .head-data {
    padding: toRem(13) toRem(22) !important;
  }

  .body-data {
    padding: toRem(10) toRem(22) !important;
  }
}
</style>
