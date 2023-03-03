<template>
  <div class="neutral-10-bg account-table-container">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="user-naira-account-table"
      :table_data="accounts"
      :table_header="table_header"
      :is_loading="loading"
      :empty_message="empty_message"
    >
      <UserNairaAccountTableRow
        v-for="(account, index) in accounts"
        :key="`${account.id}${index}`"
        table_name="user-naira-account-table"
        :data="account"
        :index="index + 1"
        @view="viewAccountDetails"
      />
    </TableContainer>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_account_details_modal">
        <AccountDetailsModal
          :account="active_account"
          @closeTriggered="toggleAccountDetailsModal"
          @close="toggleAccountDetailsModal"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import AccountDetailsModal from "@/modules/users/components/bank/modals/account-details-modal";
import UserNairaAccountTableRow from "@/modules/users/components/bank/user-naira-account-table-row";
import TableContainer from "@/shared/components/table-comps/table-container";

export default {
  name: "UserNairaAccountTable",

  components: {
    TableContainer,
    UserNairaAccountTableRow,
    AccountDetailsModal,
  },

  props: {
    accounts: {
      type: Array,
      default: () => [],
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      table_header: [
        "#",
        "Account name",
        "Account number",
        "Bank name",
        "Action",
      ],

      empty_message: "User has no naira account at the moment",

      show_account_details_modal: false,
      active_account: null,
    };
  },

  methods: {
    viewAccountDetails(account) {
      this.active_account = account;
      this.toggleAccountDetailsModal();
    },

    toggleAccountDetailsModal() {
      this.show_account_details_modal = !this.show_account_details_modal;
    },
  },
};
</script>

<style lang="scss">
.account-table-container {
  min-height: 35vh;
  border: toRem(1) solid getColor("grey-100");
}

.user-naira-account-table {
  &-1 {
    max-width: toRem(80);
  }

  &-5 {
    max-width: toRem(110);
  }

  &-2 {
    max-width: toRem(210);
  }

  &-3 {
    max-width: toRem(190);
  }

  &-4 {
    max-width: toRem(200);
  }

  .head-data {
    padding: toRem(13) toRem(22) !important;
  }

  .body-data {
    padding: toRem(13) toRem(22) !important;
  }
}
</style>
