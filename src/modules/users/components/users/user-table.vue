<template>
  <div class="neutral-10-bg connected-users-table">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="users-table"
      :table_data="getPaginatedUser"
      :table_header="table_header"
      :is_loading="table_loading"
      :empty_message="empty_message"
      @goToPage="page = $event"
      :pagination="getPagination"
      show_paging
    >
      <template v-for="(user, index) in getPaginatedUser">
        <UserTableRow
          :key="user.account_id + index"
          table_name="users-table"
          :data="user"
          :index="index + 1"
        />
      </template>

      <template slot="emptyIconSlot">
        <UserIcon big />
      </template>
    </TableContainer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TableContainer from "@/shared/components/table-comps/table-container";
import UserTableRow from "@/modules/users/components/users/user-table-row";
import UserIcon from "@/shared/components/icon-comps/user-icon";

export default {
  name: "ConnectedUserTable",

  components: {
    TableContainer,
    UserTableRow,
    UserIcon,
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
        "Full name",
        "Email address",
        "Phone number",
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
      empty_message: "User has no connected users at the moment.",
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

      const payload = {
        page,
        business_id: this.getAccountId,
      };

      this.fetchConnectedUsers(payload)
        .then((response) => {
          if (response.code === 200) {
            this.table_data = response?.data;
            this.table_loading = false;

            // this.paginationPages[page] = this.pagination;
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
.connected-users-table {
  min-height: 35vh;
  border: toRem(1) solid getColor("grey-100");
}

.users-table {
  &-0 {
    max-width: toRem(50);
  }

  &-2,
  &-3,
  &-4 {
    max-width: toRem(190);
  }

  &-1 {
    max-width: toRem(230);
  }

  .head-data {
    padding: toRem(14) toRem(32) !important;
  }

  .body-data {
    padding: toRem(13) toRem(32) !important;
  }
}
</style>
