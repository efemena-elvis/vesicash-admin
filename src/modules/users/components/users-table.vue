<template>
  <div class="neutral-10-bg table-container">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="user-table"
      :table_data="getPaginatedUser"
      :table_header="table_header"
      :is_loading="table_loading"
      :empty_message="empty_message"
      empty_action_name="Add new user"
      @emptyAction="$emit('emptyAction')"
      @goToPage="page=$event"
      :pagination="getPagination"
      show_paging
    >
      <template v-for="(user, index) in getPaginatedUser">
        <UserTableRow
          :key="user.account_id+index"
          table_name="user-table"
          :data="user"
          :index="index+1"
        />
      </template>
    </TableContainer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TableContainer from "@/shared/components/table-comps/table-container";
import UserTableRow from "@/modules/users/components/user-table-row";

export default {
  name: "UsersTable",

  components: {
    TableContainer,
    UserTableRow,
  },

  computed: {
    ...mapGetters({ getConnectedUsers: "users/getConnectedUsers" }),

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
      const from = per_page * index;
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
      empty_message:
        "You currently don't have any user, click the add new user button to add users.",
    };
  },

  mounted() {
    this.fetchUsers(1);
  },

  methods: {
    ...mapActions({
      fetchConnectedUsers: "users/fetchConnectedUsers",
    }),

    fetchUsers(page) {
      this.table_loading = true;
      this.page = page;

      // USE PREVIOUSLY SAVED DATA (AVOID UNNECESSARY API CALLS)
      if (this.getConnectedUsers.length) {
        this.table_loading = false;
        return;
      }

      this.fetchConnectedUsers()
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
    padding: toRem(10) toRem(22) !important;
  }

  .body-data {
    padding: toRem(10) toRem(22) !important;
  }
}
</style>