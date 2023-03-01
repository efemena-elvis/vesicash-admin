<template>
  <div>
    <TransactionWalletFundingTable />
  </div>
</template>

<script>
import TransactionWalletFundingTable from "@/modules/users/components/wallet-transactions/transaction-wallet-funding-table";

export default {
  name: "WalletFundingPage",

  components: {
    TransactionWalletFundingTable,
  },
};
</script>

<style>
</style>