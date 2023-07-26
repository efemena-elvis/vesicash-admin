<template>
  <div class="fx-table-container neutral-10-bg">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="exchange-rate-tb"
      :table_data="getPaginatedTable"
      :table_header="table_header"
      :is_loading="table_loading"
      :empty_message="empty_message"
      :show_paging="showPagination"
      :pagination="getPagination"
      @goToPage="updatePage"
    >
      <template v-for="(data, index) in getPaginatedTable">
        <MORPayoutsRow
          :key="index"
          :index="index + 1 + (page - 1) * per_page"
          table_name="exchange-rate-tb"
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
  name: "MORTxnTable",

  components: {
    TableContainer,
    EmptyExchangeIcon,
    MORPayoutsRow: () =>
      import(
        /* webpackChunkName: "mor-module" */ "@/modules/mor/components/mor-payouts-table-row"
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
      getMORPayouts: "mor/getMORPayouts",
    }),

    filterQuery() {
      return this.queryStrings(this.$route?.query);
    },

    showPagination() {
      return true;
    },

    getPaginatedTable() {
      return this.getMORPayouts?.data || [];
    },

    getPagination() {
      return {
        current_page: this.page,
        per_page: 15,
        last_page: this.getMORPayouts?.pagination?.total_pages_count || 0,
        from: 0,
        to: 0,
        total: 0,
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
        this.fetchPayouts(query);
      },
    },
  },

  data() {
    return {
      table_header: [
        "#",
        "Date",
        "Reference ID",
        "Merchant name",
        "Total amount paid",
        "Status",
        "Action",
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
      empty_message: "No past records of MOR payouts",
    };
  },

  mounted() {
    this.fetchPayouts(this.filterQuery);
  },

  created() {
    this.$bus.$on("refreshMOR", () => {
      this.fetchPayouts(this.filterQuery);
    });
  },

  methods: {
    ...mapActions({
      fetchMORPayouts: "mor/fetchMORPayouts",
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

    fetchPayouts(query) {
      const _query = this.filterQuery
        ? `?${this.filterQuery}`
        : this.filterQuery;

      this.table_loading = true;

      this.fetchMORPayouts(query)
        .then((response) => {
          if (
            response.code === 200 &&
            _query === decodeURIComponent(location.search)
          ) {
            this.table_data = response.data;
            this.table_loading = false;
          }

          // HANDLE NON 200 RESPONSE
          else if (response?.code !== 200) this.handleErrorResponse();
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

.exchange-rate-tb {
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
