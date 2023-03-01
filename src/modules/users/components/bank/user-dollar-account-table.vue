<template>
  <div class="neutral-10-bg account-table-container">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="user-dollar-account-table"
      :table_data="accounts"
      :table_header="table_header"
      :is_loading="loading"
      :empty_message="empty_message"
    >
      <UserDollarAccountTableRow
        v-for="(account, index) in accounts"
        :key="account.id+index"
        table_name="user-dollar-account-table"
        :data="account"
        :index="index+1"
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
          @edit="toggleDollarEditModal"
        />
      </transition>

      <transition name="fade" v-if="show_dollar_edit_modal">
        <UpdateDollarAccountModal
          :savedDetails="active_account"
          @closeTriggered="toggleDollarEditModal"
          @close="toggleDollarEditModal"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import UserDollarAccountTableRow from "@/modules/users/components/bank/user-dollar-account-table-row";
import TableContainer from "@/shared/components/table-comps/table-container";
import AccountDetailsModal from "@/modules/users/components/bank/modals/account-details-modal";
import UpdateDollarAccountModal from "@/modules/users/components/bank/modals/update-dollar-account-modal";

export default {
  name: "UserAccountTable",

  components: {
    TableContainer,
    UserDollarAccountTableRow,
    AccountDetailsModal,
    UpdateDollarAccountModal,
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
        "Sort code",
        "Bank name",
        "Action",
      ],

      show_account_details_modal: false,
      active_account: null,
      show_dollar_edit_modal: false,

      empty_message: "User has no dollar account at the moment",
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

    toggleDollarEditModal() {
      this.show_account_details_modal = false;
      this.show_dollar_edit_modal = !this.show_dollar_edit_modal;
    },
  },
};
</script>

<style lang="scss">
.account-table-container {
  min-height: 35vh;
  border: toRem(1) solid getColor("grey-100");
}

.user-dollar-account-table {
  &-1,
  &-6 {
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
