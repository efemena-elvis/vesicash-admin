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
  name: "TransactionTable",

  components: {
    TableContainer,

    TransactionTableRow: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/payments/components/transaction-table-row"
      ),
  },

  props: {},

  computed: {
    ...mapGetters({
      getTransactions: "transaction/getTransactions",
    }),

    payload() {
      let payload = {
        wallet_type: this.$route?.query?.wallet_type || "NGN",
        tx_type: this.$route?.query?.tx_type || "inflow",
        payment_entry: this.$route?.query?.payment_entry || "funding",
      };

      const status = this.$route?.query?.status;
      const start_date = this.$route?.query?.start_date;
      const end_date = this.$route?.query?.end_date;

      if (status) payload.status = status;
      if (start_date) payload.start_date = start_date;
      if (end_date) payload.end_date = end_date;

      return payload;
    },

    paymentEntry() {
      return this.$route?.query?.payment_entry || "funding";
    },

    txType() {
      return this.$route?.query?.tx_type || "inflow";
    },

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
      const transactions = this.getTransactions?.data;
      if (!transactions?.length) return [];
      if (["funding", "escrow"].includes(this.paymentEntry))
        return transactions.map(this.fundingTxnMap);
      if (this.paymentEntry === "transfer")
        return transactions.map(this.transferTxnMap);
      return transactions.map((data) => this.fxTxnMap(data, this.txType));
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
      handler() {
        this.fetchTransactions(this.page, this.payload);
      },
      immediate: true,
    },
  },

  data() {
    return {
      table_header: [
        "#",
        "Date",
        "Reference ID",
        "Account name",
        "Payment method",
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
      fetchAllTransactions: "transaction/fetchAllTransactions",
    }),

    getCost(currency, cost) {
      return `${this.$money?.getSign(currency)}${this.$money.addComma(cost)}`;
    },

    fundingTxnMap(data) {
      return {
        ...data,
        payment_entry: this.paymentEntry,
        tx_type: this.txType,
        date: this.$date
          .formatDate(new Date(data?.created_at), false)
          .getSimpleFormatDate(),
        id: data?.payment_id || "-------",
        username: data?.user?.lastname
          ? `${data?.user?.lastname} ${data?.user?.firstname}`
          : "------- -------",
        payment_method:
          data?.payment_method?.split("_")?.join(" ") || "-------",
        amount: this.getCost(data?.currency, data?.total_amount),
        paid_by: data?.user?.email_address,
        wallet_funded: data?.wallet_funded,
        status: data?.is_paid ? "Completed" : "Pending",
      };
    },

    transferTxnMap(data) {
      const currency =
        data?.currency?.split("_")?.length > 1
          ? data?.currency?.split("_")[1]
          : data?.currency?.split("_")[0];
      return {
        ...data,
        date: this.$date
          .formatDate(new Date(data?.created_at), false)
          .getSimpleFormatDate(),
        id: data?.reference || "-------",
        username: data?.user?.lastname
          ? `${data?.user?.lastname} ${data?.user?.firstname}`
          : "------- -------",
        payment_method: "Wallet",
        amount: this.getCost(currency, data?.amount),
        paid_by: data?.user?.email_address,
        wallet_funded: data?.currency || data?.wallet_funded,
        status: "Completed",
      };
    },

    fxTxnMap(data, type) {
      const wallet_type = this.$route?.query?.wallet_type || "NGN";
      const currency =
        wallet_type?.split("_")?.length > 1
          ? wallet_type?.split("_")[1]
          : wallet_type?.split("_")[0];
      const amount =
        type === "inflow"
          ? this.getCost(currency, data?.final_amount)
          : this.getCost(currency, data?.initial_amount);

      return {
        ...data,
        date: this.$date
          .formatDate(new Date(data?.created_at), false)
          .getSimpleFormatDate(),
        id: data?.uid || "-------",
        username: data?.user?.lastname
          ? `${data?.user?.lastname} ${data?.user?.firstname}`
          : "------- -------",
        payment_method: "Wallet",
        amount,
        paid_by: data?.user?.email_address,
        wallet_funded: wallet_type,
        status: data.status,
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
    fetchTransactions(page, payload) {
      const _query = decodeURIComponent(location.search);

      this.table_loading = true;

      this.page = page;

      // USE PREVIOUSLY SAVED DATA FOR THAT PAGE NUMBER (AVOID UNNECESSARY API CALLS)
      // if (this.getUserTxn?.length) {
      //   this.table_loading = false;
      //   return;
      // }

      this.table_loading = true;

      this.fetchAllTransactions({ page, payload })
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
