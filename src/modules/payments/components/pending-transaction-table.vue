<template>
  <div class="neutral-10-bg escrow-table">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="transaction-tb"
      :table_data="getPaginatedTransaction"
      :table_header="table_header"
      :is_loading="table_loading"
      :empty_message="getEmptyMessage"
      show_paging
      :pagination="getPagination"
      @goToPage="updatePage"
    >
      <template v-for="(data, index) in getPaginatedTransaction">
        <TransactionTableRow
          :key="index"
          table_name="transaction-tb"
          :data="data"
          @refresh="fetchTransactions(filterQuery)"
          :index="
            index +
            1 +
            (getPagination.current_page - 1) * getPagination.per_page
          "
        />
      </template>
    </TableContainer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TableContainer from "@/shared/components/table-comps/table-container";

export default {
  name: "PendingTransactionTable",

  components: {
    TableContainer,

    TransactionTableRow: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/payments/components/pending-transaction-table-row"
      ),
  },

  props: {},

  computed: {
    ...mapGetters({
      getTransactions: "transaction/getPendingTransactions",
    }),

    getEmptyMessage() {
      return "No match found";
    },

    getEmptyActionName() {
      return "";
    },

    filterQuery() {
      return this.queryStrings(this.$route?.query);
    },

    getPaginatedTransaction() {
      const transactions = this.getTransactions?.data
        ? [...this.getTransactions?.data]
        : [];
      return transactions.map((data) => this.pendingTransactionMap(data));
    },

    getPagination() {
      return {
        current_page: this.getTransactions?.current_page,
        per_page: this.getTransactions?.per_page,
        last_page: this.getTransactions?.last_page,
        from: this.getTransactions?.from,
        to: this.getTransactions?.to,
        total: this.getTransactions?.total,
      };
    },
  },

  watch: {
    "$route.query.page": {
      handler(page) {
        if (page) this.page = Number(page);
      },
      immediate: true,
      deep: true,
    },

    filterQuery: {
      handler(query) {
        this.fetchTransactions(query);
      },
      immediate: true,
    },
  },

  data() {
    return {
      table_header: [
        "#",
        "Date",
        "Account ID",
        "Account name",
        "Payment type",
        "Amount",
        "Status",
        "Action",
      ],

      table_data: [6],
      table_loading: false,
      paginatedData: {},
      paginationPages: {},
      page: 1,
      per_page: 15,
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
    // this.fetchTransactions(this.page, this.payload);
  },

  methods: {
    ...mapActions({
      fetchAllTransactions: "transaction/fetchPendingTransactions",
      fetchPendingTransactionsCount:
        "transaction/fetchPendingTransactionsCount",
    }),

    getCost(currency, cost) {
      return `${this.$money?.getSign(currency)}${this.$money.addComma(cost)}`;
    },

    pendingTransactionMap(data) {
      const date = this.$date
        .formatDate(new Date(data?.created_at), false)
        .getSimpleFormatDate();
      const sender_account_id = data?.user?.account_id || "-------";
      const receiver_account_id = data?.user?.account_id;
      const sender_name = data?.user?.firstname
        ? `${data?.user?.firstname} ${data?.user?.lastname}`
        : data?.user?.email_address || "------ -------";
      const receiver_name = data?.user?.firstname
        ? `${data?.user?.firstname} ${data?.user?.lastname}`
        : data?.user?.email_address || "------ -------";
      const type = data?.type?.split("_")?.join(" ") || "--------";
      const sender_amount = this.getCost(data?.currency, data?.total_amount);
      const receiver_amount = data?.total_amount
        ? this.getCost(data?.currency, data?.total_amount)
        : "";
      const status = data?.approved;

      return {
        ...data,
        date,
        sender_account_id,
        receiver_account_id,
        sender_name,
        receiver_name,
        type,
        sender_amount,
        receiver_amount,
        status,
      };
    },

    updatePage(page) {
      this.page = Number(page);
      const query = { ...this.$route?.query, page };

      this.$router.replace({
        path: this.$route.path,
        query: { ...query },
      });
    },

    queryStrings(query) {
      return Object.entries(query)
        .map(([k, v]) => `${k}=${v}`)
        .join("&");
    },

    // ====================================
    // FETCH ALL USER TRANSACTIONS
    // ====================================
    fetchTransactions(query) {
      const _query = decodeURIComponent(location.search);

      this.table_loading = true;

      // USE PREVIOUSLY SAVED DATA FOR THAT PAGE NUMBER (AVOID UNNECESSARY API CALLS)
      // if (this.getUserTxn?.length) {
      //   this.table_loading = false;
      //   return;
      // }

      this.table_loading = true;

      this.fetchAllTransactions(query)
        .then((response) => {
          if (
            response.code === 200 &&
            _query === decodeURIComponent(location.search)
          ) {
            this.table_data = response.data;
            this.table_loading = false;

            // this.saveTransactionDataAndPagination(
            //   response.data,
            //   response.pagination,
            //   page
            // );
          }

          // HANDLE NON 200 RESPONSE
          else if (response?.code !== 200) this.handleErrorResponse();
        })
        .catch(() => this.handleErrorResponse());
      this.fetchPendingTransactionsCount();
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
.escrow-table {
  min-height: 65vh;
  border: toRem(1) solid getColor("grey-100");
}

.transaction-tb {
  &-1 {
    min-width: toRem(50);
    max-width: toRem(90);
  }

  &-2,
  &-3,
  &-5,
  &-6 {
    max-width: toRem(200);
    min-width: toRem(160);
  }

  &-4 {
    max-width: toRem(250);
    min-width: toRem(200);
  }

  &-7 {
    min-width: toRem(100);
  }

  .head-data {
    padding: toRem(13) toRem(22) !important;
  }

  .body-data {
    padding: toRem(10) toRem(22) !important;
  }
}
</style>
