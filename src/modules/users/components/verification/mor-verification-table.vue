<template>
  <div class="fx-table-container neutral-10-bg">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="mor-verification-tb"
      :table_data="getPaginatedTable"
      :table_header="table_header"
      :is_loading="table_loading"
      :empty_message="empty_message"
      :show_paging="showPagination"
      :pagination="getPagination"
      @goToPage="updatePage"
    >
      <template v-for="(data, index) in getPaginatedTable">
        <MorVerificationTableRow
          :key="index"
          :index="index + 1 + (page - 1) * per_page"
          table_name="mor-verification-tb"
          :data="data"
        />
      </template>

      <template slot="emptyIconSlot">
        <EmptyExchangeIcon />
      </template>
    </TableContainer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TableContainer from "@/shared/components/table-comps/table-container";
import EmptyExchangeIcon from "@/shared/components/icon-comps/empty-exchange-icon";

export default {
  name: "MORVerificationTable",

  components: {
    TableContainer,
    EmptyExchangeIcon,
    MorVerificationTableRow: () =>
      import(
        /* webpackChunkName: "exchange-module" */ "@/modules/users/components/verification/mor-verification-table-row"
      ),
  },

  props: {
    dataset: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    ...mapGetters({
      getFxTable: "fx/getFXTransactions",
    }),

    filterQuery() {
      return this.queryStrings(this.$route?.query);
    },

    showPagination() {
      return true;
    },

    getPaginatedTable() {
      const { per_page } = this;
      const tables = [...this.getFxTable];
      const max_index = Math.max(0, Math.ceil(tables.length / per_page));
      const index = Math.min(this.page - 1, max_index);
      const start_range = per_page * index;
      const end_range = start_range + per_page;

      return tables.slice(start_range, end_range);
    },

    getPagination() {
      const tables = [...this.getFxTable];
      const { per_page } = this;
      const current_page = this.page;

      const max_index = Math.max(0, Math.ceil(tables.length / per_page));
      const index = Math.min(this.page - 1, max_index);
      const from = per_page * index;
      const to = Math.min(from + per_page, tables.length);

      return {
        current_page,
        per_page,
        last_page: Math.ceil(tables.length / per_page),
        from: from + 1,
        to,
        total: tables.length,
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

    "getFxTable.length": {
      handler(size) {
        const max_page = Math.max(1, Math.ceil(size / this.per_page));
        this.page = Math.min(this.page, max_page);
      },
      immediate: true,
      deep: true,
    },

    filterQuery: {
      handler(query) {
        this.getFxTransactions(query);
      },
    },
  },

  data() {
    return {
      table_header: [
        "#",
        "Mor country",
        "MOR document",
        "Document Status",
        "Actions",
      ],

      page: 1,
      per_page: 15,

      table_data: [],
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
      empty_message: "No fx transactions",
    };
  },

  mounted() {
    this.getFxTransactions(this.filterQuery);
  },

  methods: {
    ...mapActions({
      fetchAllFxTransactions: "fx/fetchFXTxns",
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

    getFxTransactions(query) {
      const _query = query ? `?${query}` : query;

      this.table_loading = true;

      this.fetchAllFxTransactions(query)
        .then((response) => {
          if (
            response.code === 200 &&
            _query === decodeURIComponent(location.search)
          ) {
            this.table_data = response.data;
            this.table_loading = false;
          }

          // HANDLE NON 200 RESPONSE
          else if (response.code !== 200) this.handleErrorResponse();
        })
        .catch(() => this.handleErrorResponse());
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
.fx-table-container {
  min-height: 40vh;
  border: toRem(1) solid getColor("grey-100");
}

.exchange-tb {
  &-5 {
    max-width: toRem(230);
  }

  .head-data {
    padding: toRem(14) toRem(22) !important;
  }

  .body-data {
    padding: toRem(13) toRem(22) !important;
  }
}
</style>
