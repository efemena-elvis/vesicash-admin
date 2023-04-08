<template>
  <div class="neutral-10-bg api-table">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="api-tb"
      :table_data="getPaginatedAPIkeys"
      :table_header="table_header"
      :is_loading="table_loading"
      :empty_message="getEmptyMessage"
      show_paging
      :pagination="getPagination"
      @goToPage="updatePage"
    >
      <template v-for="(data, index) in getPaginatedAPIkeys">
        <ApiKeyTableRow
          @refresh="fetchkeys(filterQuery)"
          :key="index"
          table_name="api-tb"
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
  name: "APITable",

  components: {
    TableContainer,

    ApiKeyTableRow: () =>
      import(
        /* webpackChunkName: "api-module" */ "@/modules/api/components/api-key-table-row"
      ),
  },

  props: {},

  computed: {
    ...mapGetters({
      getAPIKeys: "api/getAPIKeys",
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

    getPaginatedAPIkeys() {
      return this.getAPIKeys?.data;
    },

    getPagination() {
      return {
        current_page: this.getAPIKeys?.current_page,
        per_page: this.getAPIKeys?.per_page,
        last_page: this.getAPIKeys?.last_page,
        from: this.getAPIKeys?.from,
        to: this.getAPIKeys?.to,
        total: this.getAPIKeys?.total,
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
        this.fetchkeys(query);
      },
      immediate: true,
    },
  },

  data() {
    return {
      table_header: [
        "#",
        "Date generated",
        "Account ID",
        "Account name",
        "Public Key",
        "Private Key",
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

  methods: {
    ...mapActions({
      fetchAPIkeys: "api/fetchAPIkeys",
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
    // FETCH ALL API KEYS
    // ====================================
    fetchkeys(query) {
      const _query = decodeURIComponent(location.search);

      this.table_loading = true;

      this.fetchAPIkeys(query)
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
.api-table {
  min-height: 65vh;
  border: toRem(1) solid getColor("grey-100");
}

.api-tb {
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
