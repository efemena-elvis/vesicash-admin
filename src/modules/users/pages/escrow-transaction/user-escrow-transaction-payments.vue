<template>
  <div>
    <PaymentsTable @view="toggleTransactionSummaryModal" />

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_transaction_summary_modal">
        <TransactionSummaryModal @closeTriggered="toggleTransactionSummaryModal" />
      </transition>
    </portal>
  </div>
</template>

<script>
import PaymentsTable from "@/modules/users/components/escrow-transactions/payments-table";
import TransactionSummaryModal from "@/modules/users/components/escrow-transactions/modals/transaction-summary-modal";

export default {
  name: "UserEscrowTransactionPayments",

  components: {
    PaymentsTable,
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