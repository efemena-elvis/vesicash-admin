<template>
  <div class="neutral-10-bg users-access-table">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="users-table"
      :table_data="getUserAccess"
      :table_header="table_header"
      :is_loading="table_loading"
      :empty_message="empty_message"
      @goToPage="page = $event"
      :pagination="getPagination"
    >
      <template v-for="(access, index) in getUserAccess">
        <UserAccesssTableRow
          :key="access.name + index"
          table_name="users-table"
          :data="access"
          :index="
            index +
            1 +
            (getPagination.current_page - 1) * getPagination.per_page
          "
        />
      </template>

      <template slot="emptyIconSlot">
        <UserIcon big />
      </template>
    </TableContainer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TableContainer from "@/shared/components/table-comps/table-container";
import UserAccesssTableRow from "@/modules/users/components/users/user-access-table-row";
import UserIcon from "@/shared/components/icon-comps/user-icon";

export default {
  name: "UserAccessTable",

  components: {
    TableContainer,
    UserAccesssTableRow,
    UserIcon,
  },

  computed: {
    ...mapGetters({ getUserProfile: "users/getUserProfile" }),

    getUserAccess() {
      const user = this.getUserProfile?.user;
      if (!user) return [];

      const ACCESS_FIELDS = [
        {
          name: "Funding",
          slug: "funding",
          field: "can_fund",
        },
        {
          name: "Withdrawal",
          slug: "withdrawal",
          field: "can_make_withdrawal",
        },
        {
          name: "Escrow transaction",
          slug: "escrow",
          field: "is_escrow_enabled",
        },
        {
          name: "Fx transaction",
          slug: "fx-transfer",
          field: "can_exchange",
        },
        {
          name: "Mor transaction",
          slug: "mor-transaction",
          field: "is_mor_enabled",
        },
      ];

      return ACCESS_FIELDS.map(({ name, field, slug }) => {
        return {
          name,
          access: name,
          slug,
          field,
          status: user[field] ? "Enabled" : "Disabled",
        };
      });
    },

    getPaginatedUser() {
      const users = this.getConnectedUsers?.data
        ? [...this.getConnectedUsers?.data]
        : [];

      return users;
    },

    // getPaginatedUser() {
    //   const { per_page } = this;
    //   const index = this.page - 1;
    //   const start_range = per_page * index;
    //   const end_range = start_range + per_page;
    //   const users = [...this.getConnectedUsers];
    //   return users.slice(start_range, end_range);
    // },

    // getPagination() {
    //   return {
    //     current_page: this.getConnectedUsers?.current_page,
    //     per_page: this.getConnectedUsers?.per_page,
    //     last_page: this.getConnectedUsers?.last_page,
    //     from: this.getConnectedUsers?.from,
    //     to: this.getConnectedUsers?.to,
    //     total: this.getConnectedUsers?.total,
    //   };
    // },

    getPagination() {
      const access = [...this.getUserAccess];
      const { per_page } = this;
      const current_page = this.page;

      const index = this.page - 1;
      const from = per_page * index;
      const to = Math.min(from + per_page, access.length);

      return {
        current_page,
        per_page,
        last_page: Math.ceil(access.length / per_page),
        from: from + 1,
        to,
        total: access.length,
      };
    },
  },

  data() {
    return {
      table_header: ["#", "Access", "Status", "Actions"],

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
      empty_message: "No Access",
    };
  },

  methods: {},
};
</script>

<style lang="scss">
.users-access-table {
  min-height: 35vh;
  border: toRem(1) solid getColor("grey-100");

  .users-table {
    &-1 {
      max-width: toRem(50);
    }

    &-2,
    &-3 {
      min-width: toRem(200);
      max-width: toRem(210);
    }

    &-4 {
      min-width: toRem(200);
    }

    .head-data {
      padding: toRem(14) toRem(32) !important;
    }

    .body-data {
      padding: toRem(13) toRem(32) !important;
    }
  }
}
</style>
