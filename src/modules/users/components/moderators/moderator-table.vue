<template>
  <div class="moderator-table-container neutral-10-bg">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="moderator-tb"
      :table_data="getPaginatedTable"
      :table_header="table_header"
      :is_loading="table_loading"
      :empty_message="empty_message"
      :show_paging="showPagination"
      :pagination="getPagination"
      @goToPage="updatePage"
    >
      <template v-for="(data, index) in getPaginatedTable">
        <ModeratorTableRow
          :key="index"
          :index="index + 1 + (page - 1) * per_page"
          :data="data"
          table_name="moderator-tb"
          @refresh="fetchModerarors(filterQuery)"
        />
      </template>

      <template slot="emptyIconSlot">
        <UserIcon />
      </template>
    </TableContainer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TableContainer from "@/shared/components/table-comps/table-container";
import UserIcon from "@/shared/components/icon-comps/user-icon";

export default {
  name: "ModeratorsTable",

  components: {
    TableContainer,
    UserIcon,
    ModeratorTableRow: () =>
      import(
        /* webpackChunkName: "moderators-module" */ "@/modules/users/components/moderators/moderator-table-row"
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
      getVesicashModerators: "users/getVesicashModerators",
    }),

    filterQuery() {
      return this.queryStrings(this.$route?.query);
    },

    showPagination() {
      return true;
    },

    getPaginatedTable() {
      const { per_page } = this;
      const tables = [...this.getVesicashModerators];
      const max_index = Math.max(0, Math.ceil(tables.length / per_page));
      const index = Math.min(this.page - 1, max_index);
      const start_range = per_page * index;
      const end_range = start_range + per_page;

      return tables.slice(start_range, end_range);
    },

    getPagination() {
      const tables = [...this.getVesicashModerators];
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

    "getVesicashModerators.length": {
      handler(size) {
        const max_page = Math.max(1, Math.ceil(size / this.per_page));
        this.page = Math.min(this.page, max_page);
      },
      immediate: true,
      deep: true,
    },

    filterQuery: {
      handler(query) {
        this.getPastFXRates(query);
      },
    },
  },

  data() {
    return {
      table_header: ["#", "Email", "Access type", "Action"],

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
      empty_message: "No moderators",
    };
  },

  mounted() {
    this.fetchModerarors(this.filterQuery);

    this.$bus.$on("refresh-moderators", () =>
      this.fetchModerarors(this.filterQuery)
    );
  },

  methods: {
    ...mapActions({
      fetchVesicashModerators: "users/fetchVesicashModerators",
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

    fetchModerarors(query) {
      const _query = this.filterQuery
        ? `?${this.filterQuery}`
        : this.filterQuery;

      this.table_loading = true;

      this.fetchVesicashModerators(query)
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
.moderator-table-container {
  min-height: 40vh;
  border: toRem(1) solid getColor("grey-100");

  svg {
    fill: getColor("teal-800") !important;
  }
}

.moderator-tb {
  &-1 {
    min-width: toRem(60);
    max-width: toRem(60);
  }
  &-2 {
    min-width: toRem(150);
    max-width: toRem(250);
  }
  &-3 {
    min-width: toRem(200);
    max-width: toRem(350);
  }
  &-4 {
    min-width: toRem(190);
    max-width: toRem(190);
  }
  .head-data {
    padding: toRem(14) toRem(22) !important;
  }

  .body-data {
    padding: toRem(13) toRem(22) !important;
  }
}
</style>
