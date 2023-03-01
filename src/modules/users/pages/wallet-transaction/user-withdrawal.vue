<template>
  <div>
    <TransactionWalletWithdrawalTable />
  </div>
</template>

<script>
import TransactionWalletWithdrawalTable from "@/modules/users/components/wallet-transactions/transaction-wallet-withdrawal-table";
export default {
  name: "WalletWithdrawalPage",

  components: {
    TransactionWalletWithdrawalTable,
  },
};
</script>

<style>
</style>