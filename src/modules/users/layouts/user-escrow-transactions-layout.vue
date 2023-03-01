<template>
  <div class="table-container neutral-10-bg mgt-35">
    <TransactionTable />
  </div>
</template>

<script>
import TransactionTable from "@/modules/users/components/escrow-transactions/transaction-table";
export default {
  name: "UserEscrowTransactions",

  components: {
    TransactionTable,
  },
};
</script>

<style lang="scss" scoped>
.table-container {
  border: toRem(1) solid getColor("grey-100");
  min-height: 65vh;
}
</style>