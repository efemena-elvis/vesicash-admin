<template>
  <div>
    <div class="mgt-30">
      <MorWithdrawalRequestTable />
    </div>
  </div>
</template>

<script>
import MorWithdrawalRequestTable from "@/modules/mor/components/mor-withdrawal-request-table";
export default {
  name: "MORWithdrawals",

  components: {
    MorWithdrawalRequestTable,
  },
};
</script>

<style></style>
