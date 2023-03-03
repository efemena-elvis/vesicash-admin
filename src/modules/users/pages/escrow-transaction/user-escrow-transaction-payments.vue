<template>
  <div>
    <PaymentsTable
      :loading="loading"
      :payments="getPayments"
      :title="getTxnTitle"
      :type="getTxnType"
      :status="getTxnStatus"
      @view="toggleTransactionSummaryModal"
    />

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_transaction_summary_modal">
        <TransactionSummaryModal
          @closeTriggered="toggleTransactionSummaryModal"
        />
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

  props: {
    loading: {
      type: Boolean,
      default: false,
    },

    payments: {
      type: Array,
      default: () => [],
    },

    transaction: {
      type: Object,
      default: () => null,
    },
  },

  computed: {
    getTxnTitle() {
      if (!this.transaction) return "";
      return this.transaction?.title;
    },

    getTxnType() {
      if (!this.transaction) return "";
      return this.transaction?.type;
    },

    getTxnStatus() {
      if (!this.transaction) return "";
      return this.transaction?.status?.toLowerCase();
    },

    getPayments() {
      return this.payments.map((payment) => {
        const payment_date = this.$date.formatDate(
          new Date(payment?.updated_at),
          false
        );
        const date = payment_date?.getSimpleFormatDate();

        const email = payment?.user_details?.email || "-----";

        const currency = payment?.currency;

        const amount = payment?.total_amount;

        const paid = payment?.is_paid;

        const transaction_id = payment?.transaction_id;

        return {
          date,
          email,
          currency,
          amount,
          paid,
          transaction_id,
        };
      });
    },
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

<style></style>
