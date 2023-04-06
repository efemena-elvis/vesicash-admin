<template>
  <tr @click="toggleTransactionSummaryModal">
    <td class="body-data" :class="`${table_name}-1`">
      <div class="text mgb-6 text-no-wrap">{{ index }}</div>
    </td>

    <td class="body-data" :class="`${table_name}-2`">
      <div class="text mgb-6 text-no-wrap">{{ data.date }}</div>
    </td>

    <td class="body-data" :class="`${table_name}-3`">{{ data.id }}</td>

    <td class="body-data text-capitalize" :class="`${table_name}-4`">
      {{ data.username }}
    </td>

    <td class="body-data text-capitalize" :class="`${table_name}-5`">
      {{ data.payment_method }}
    </td>

    <td class="body-data" :class="`${table_name}-6`">
      {{ data.amount }}
    </td>

    <td class="body-data" :class="`${table_name}-7`">
      <TagCard
        :title="data.status"
        :card_text="data.status"
        :card_type="
          status_colors[data.status ? data.status.toLowerCase() : 'progress']
        "
      />
    </td>

    <td class="body-data" :class="`${table_name}-7`">
      <button class="btn btn-secondary btn-sm">View</button>
    </td>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_transaction_summary_modal">
        <TransactionSummaryModal
          @closeTriggered="toggleTransactionSummaryModal"
          :details="transactionSummary"
        />
      </transition>
    </portal>
  </tr>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";
import TransactionSummaryModal from "@/modules/payments/components/modals/transaction-summary-modal";

export default {
  name: "TransactionTableRow",

  components: {
    TagCard,
    TransactionSummaryModal,
  },

  props: {
    table_name: {
      type: String,
      default: "",
    },

    index: {
      type: [Number, String],
      default: 1,
    },

    data: {
      type: Object,
      default: () => ({}),
    },
  },

  filters: {
    getStatusColor(status, status_colors) {
      return status_colors[status?.toLowerCase()] || "error";
    },
  },

  computed: {
    transactionSummary() {
      return [
        {
          name: "AMOUNT",
          value: this.data?.amount,
        },
        {
          name: "TRANSACTION REFERENCE",
          value: this.data?.id,
        },
        {
          name: "DATE OF TRANSACTION",
          value: this.data?.date,
        },
        {
          name: "PAYMENT METHOD",
          value: this.data?.payment_method,
        },
        {
          name: "PAID BY",
          value: this.data?.paid_by,
        },
        {
          name: "WALLET FUNDED",
          value: this.$money.getName(this.data?.wallet_funded),
        },

        {
          name: "STATUS",
          value: this.data?.status,
          status:
            this.status_colors[this.data?.status?.toLowerCase() || "progress"],
        },
      ];
    },
  },

  data() {
    return {
      show_transaction_summary_modal: false,
      status: {
        sac: "Sent - Awaiting Confirmation",
        cls: "Closed",
      },

      status_colors: {
        completed: "success",
        pending: "progress",
        failed: "progress",
      },
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
