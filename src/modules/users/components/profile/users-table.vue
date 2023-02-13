<template>
  <div class="neutral-10-bg table-container">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="user-table"
      :table_data="getPaginatedUser"
      :table_header="table_header"
      :is_loading="table_loading"
      :empty_message="empty_message"
      @emptyAction="$emit('emptyAction')"
      @goToPage="updatePage"
      :pagination="getPagination"
      show_paging
    >
      <UserTableRow
        v-for="(user, index) in getPaginatedUser"
        :key="user.account_id+index"
        table_name="user-table"
        :data="user"
        :index="index+1"
      />
    </TableContainer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TableContainer from "@/shared/components/table-comps/table-container";
import UserTableRow from "@/modules/users/components/profile/user-table-row";

export default {
  name: "UsersTable",

  components: {
    TableContainer,
    UserTableRow,
  },

  computed: {
    ...mapGetters({ getConnectedUsers: "users/getConnectedUsers" }),

    filterQuery() {
      return this.queryStrings(this.$route?.query);
    },

    getPaginatedUser() {
      const { per_page } = this;
      const index = this.page - 1;
      const start_range = per_page * index;
      const end_range = start_range + per_page;
      const users = [...this.getConnectedUsers];
      return users.slice(start_range, end_range);
    },

    getPagination() {
      const users = [...this.getConnectedUsers];
      const { per_page } = this;
      const current_page = this.page;

      const index = this.page - 1;
      const from_page = per_page * index;
      const _from = Math.ceil([...this.getConnectedUsers]?.length / per_page);
      const from = Math.min(from_page, _from);
      const to = Math.min(from + per_page, users.length);

      return {
        current_page,
        per_page,
        last_page: Math.ceil(users.length / per_page),
        from: from + 1,
        to,
        total: users.length,
      };
    },
  },

  data() {
    return {
      table_header: [
        "#",
        "Account ID",
        "Account type",
        "Email",
        "Full name",
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
      empty_message: "No match found",
    };
  },

  mounted() {
    this.fetchUsers(this.page);
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
        this.fetchUsers(this.page);
      },
    },
  },

  methods: {
    ...mapActions({
      fetchConnectedUsers: "users/fetchConnectedUsers",
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

    fetchUsers(page) {
      this.table_loading = true;
      this.page = page;

      // USE PREVIOUSLY SAVED DATA (AVOID UNNECESSARY API CALLS)..
      // WILL BE UN-COMMENTED LATER

      // if (this.getConnectedUsers.length) {
      //   this.table_loading = false;
      //   return;
      // }

      this.fetchConnectedUsers(this.filterQuery)
        .then((response) => {
          if (response.code === 200) {
            this.table_data = response?.data;
            this.table_loading = false;
          }

          // HANDLE NON 200 RESPONSE
          else this.handleErrorResponse();
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
.table-container {
  min-height: 65vh;
  border: toRem(1) solid getColor("grey-100");
}

.user-table {
  &-1 {
    max-width: toRem(60);
  }

  &-2,
  &-3,
  &-6,
  &-7 {
    max-width: toRem(190);
  }

  &-4,
  &-5 {
    max-width: toRem(220);
  }

  .head-data {
    padding: toRem(13) toRem(22) !important;
  }

  .body-data {
    padding: toRem(10) toRem(22) !important;
  }
}
</style>

<style lang="scss">
.user-table {
  .app-chip {
    padding: toRem(2.75) toRem(10) toRem(2) toRem(21);
    font-size: toRem(11.5);
    @include breakpoint-down(md) {
      padding: toRem(2.75) toRem(13) toRem(2) toRem(21);
    }
  }
}
</style>