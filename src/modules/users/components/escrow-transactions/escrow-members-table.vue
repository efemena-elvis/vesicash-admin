<template>
  <div class="neutral-10-bg members-table-container">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="escrow-members-table"
      :table_data="members"
      :table_header="table_header"
      :is_loading="loading"
      :empty_message="empty_message"
    >
      <EscrowMembersTableRow
        v-for="(member, index) in members"
        :key="member.email+index"
        table_name="escrow-members-table"
        :data="member"
        :index="index+1"
      />
    </TableContainer>
  </div>
</template>

<script>
import TableContainer from "@/shared/components/table-comps/table-container";
import EscrowMembersTableRow from "@/modules/users/components/escrow-transactions/escrow-members-table-row";

export default {
  name: "TransactionMembersTable",

  components: {
    TableContainer,
    EscrowMembersTableRow,
  },

  props: {
    members: {
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
        "Email address",
        "Phone number",
        "User Role",
        "User Access",
        "Recieves payout",
      ],

      empty_message: "Ooops. Seems this transaction has no members!",
    };
  },
};
</script>

<style lang="scss">
.members-table-container {
  min-height: 35vh;
  border: toRem(1) solid getColor("grey-100");
}

.escrow-members-table {
  &-1 {
    max-width: toRem(60);
  }

  &-2 {
    min-width: toRem(210);
    max-width: toRem(230);
  }

  &-4 {
    min-width: toRem(110);
    max-width: toRem(110);
  }

  &-6 {
    min-width: toRem(150);
    max-width: toRem(150);
  }

  &-3,
  &-5 {
    min-width: toRem(155);
    max-width: toRem(190);
  }

  .head-data {
    padding: toRem(13) toRem(22) !important;
  }

  .body-data {
    padding: toRem(14) toRem(22) !important;
  }
}
</style>
