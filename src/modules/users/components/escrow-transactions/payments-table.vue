<template>
  <div class="payment-table-container neutral-10-bg">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="payment-tb"
      :table_data="payments"
      :table_header="table_header"
      :is_loading="loading"
      :empty_message="getEmptyMessage"
    >
      <template v-for="(data, index) in payments">
        <PaymentTableRow
          :key="index"
          table_name="payment-tb"
          :index="index + 1"
          :title="title"
          :type="type"
          :data="data"
          @view="$emit('view')"
        />
      </template>
    </TableContainer>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import TableContainer from "@/shared/components/table-comps/table-container";
import { escrow_payment_table_empty_states as EMPTY_STATES } from "@/utilities/status";

export default {
  name: "PaymentsTable",

  components: {
    TableContainer,
    PaymentTableRow: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/users/components/escrow-transactions/payment-table-row"
      ),
  },

  props: {
    payments: {
      type: Array,
      default: () => [],
    },

    loading: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "",
    },
  },

  computed: {
    getEmptyMessage() {
      return (
        this.EMPTY_STATES[this.status] ||
        "No payments has been made for this escrow transaction."
      );
    },

    getEmptyActionName() {
      return this.$route?.name === "AllTransactions" ? "Create escrow" : "";
    },
  },

  data() {
    return {
      EMPTY_STATES,
      table_header: ["#", "Date", "Paid by", "Amount paid", "Status", "Action"],

      table_data: [],
      table_loading: false,
      paginatedData: {},
      paginationPages: {},
      pagination: {
        current_page: 1,
        per_page: 10,
        last_page: 3,
        from: 1,
        to: 20,
        total: 50,
      },
      empty_message:
        "You have not created any transactions yet. Click the button below to get started",
    };
  },

  mounted() {
    // this.fetchPayments(1);
  },

  methods: {
    ...mapActions({
      fetchUserTransactions: "users/fetchUserTransactions",
    }),

    // ====================================
    // FETCH ALL USER TRANSACTIONS
    // ====================================
    fetchPayments(page) {
      // USE PREVIOUSLY SAVED DATA FOR THAT PAGE NUMBER (AVOID UNNECESSARY API CALLS)
      if (this.paginatedData[page] && this.paginationPages[page]) {
        this.table_data = this.paginatedData[page];
        this.pagination = this.paginationPages[page];
        this.table_loading = false;
        return;
      }

      const payload = {
        payload: { account_id: this.getAccountId },
        page,
        limit: this.$route?.name === "AllTransactions" ? 20 : 3,
      };

      this.table_loading = true;

      this.fetchUserTransactions(payload)
        .then((response) => {
          if (response.code === 200) {
            // this.table_data = response.data;
            this.table_loading = false;

            // this.saveTransactionDataAndPagination(
            //   response.data,
            //   response.pagination,
            //   page
            // );
          }

          // HANDLE NON 200 RESPONSE
          else this.handleErrorResponse();
        })
        .catch(() => this.handleErrorResponse());
    },

    saveTransactionDataAndPagination(data, pagination, page) {
      //SET PAGINATION DATA
      const from = pagination?.limit * (pagination?.currentPage - 1) + 1;

      this.pagination = {
        current_page: pagination?.currentPage,
        per_page: pagination?.limit,
        last_page: pagination?.totalPages,
        from,
        to: from + (data?.length - 1),
        total: pagination?.total_records,
      };

      this.paginationPages[page] = this.pagination;

      this.paginatedData[page] = data;
    },

    // ==========================
    // HANDLE ERROR RESPONSE
    // ==========================
    handleErrorResponse() {
      this.table_loading = false;
      this.table_data = [];
    },
  },
};
</script>

<style lang="scss">
.payment-table-container {
  border: toRem(1) solid getColor("grey-100");
  min-height: 40vh;
}

.payment-tb {
  &-1,
  &-7 {
    min-width: toRem(50);
  }

  &-3 {
    min-width: toRem(200);
    max-width: toRem(230);
  }

  &-4,
  &-5,
  &-6 {
    max-width: toRem(180);
    min-width: toRem(150);
  }

  &-2 {
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
