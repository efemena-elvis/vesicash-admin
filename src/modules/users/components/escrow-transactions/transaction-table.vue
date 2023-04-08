<template>
  <div>
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
        />
      </template>
    </TableContainer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TableContainer from "@/shared/components/table-comps/table-container";

export default {
  name: "UserEscrowTransactionTable",

  components: {
    TableContainer,

    TransactionTableRow: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/users/components/escrow-transactions/transaction-table-row"
      ),
  },

  props: {
    dataset: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    ...mapGetters({ getUserTxn: "users/getUserTxn" }),

    getEmptyMessage() {
      return "User has not performed any escrow transaction";
    },

    getEmptyActionName() {
      return "";
    },

    filterQuery() {
      return this.queryStrings(this.$route?.query);
    },

    getPaginatedTransaction() {
      const { per_page } = this;
      const index = this.page - 1;
      const start_range = per_page * index;
      const end_range = start_range + per_page;
      const transactions = [...this.getUserTxn];
      return transactions.slice(start_range, end_range);
    },

    getPagination() {
      const transactions = [...this.getUserTxn];
      const { per_page } = this;
      const current_page = this.page;

      const index = this.page - 1;
      const from = per_page * index;
      const to = Math.min(from + per_page, transactions.length);

      return {
        current_page,
        per_page,
        last_page: Math.ceil(transactions.length / per_page),
        from: from + 1,
        to,
        total: transactions.length,
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
        this.getUserTransactions(this.page);
      },
    },
  },

  data() {
    return {
      table_header: [
        "#",
        "Transaction name",
        "Due date",
        "Amount to pay",
        "Disbursment type",
        "Status",
        "Action",
      ],

      table_data: [6],
      table_loading: true,
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
    this.getUserTransactions(this.page);
  },

  methods: {
    ...mapActions({
      fetchUserTransactions: "users/fetchUserTransactions",
    }),

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
    getUserTransactions(page) {
      this.table_loading = true;
      this.page = page;

      // USE PREVIOUSLY SAVED DATA FOR THAT PAGE NUMBER (AVOID UNNECESSARY API CALLS)
      // if (this.getUserTxn?.length) {
      //   this.table_loading = false;
      //   return;
      // }

      const payload = {
        business_id: this.$route?.params?.userID,
      };

      this.table_loading = true;

      this.fetchUserTransactions(payload)
        .then((response) => {
          if (response.code === 200) {
            this.table_data = response.data;
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
.transaction-tb {
  &-1 {
    min-width: toRem(50);
    max-width: toRem(90);
  }

  &-2 {
    min-width: toRem(200);
    max-width: toRem(250);
  }

  &-3,
  &-4,
  &-5 {
    max-width: toRem(200);
    min-width: toRem(180);
  }

  &-6 {
    max-width: toRem(270);
    min-width: toRem(150);
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
