<template>
  <div>
    <DisbursementTable @view="toggleTransactionSummaryModal" />

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_transaction_summary_modal">
        <TransactionSummaryModal @closeTriggered="toggleTransactionSummaryModal" />
      </transition>
    </portal>
  </div>
</template>

<script>
import DisbursementTable from "@/modules/users/components/escrow-transactions/disbursement-table";
import TransactionSummaryModal from "@/modules/users/components/escrow-transactions/modals/transaction-summary-modal";

export default {
  name: "UserEscrowTransactionDisbursement",

  components: {
    DisbursementTable,
    TransactionSummaryModal,
  },

  data() {
    return {
      show_transaction_summary_modal: false,
    };
  },

  methods: {
    toggleTransactionSummaryModal() {
      this.show_transaction_summary_modal =
        !this.show_transaction_summary_modal;
    },
  },
};
</script>

<style>
</style>