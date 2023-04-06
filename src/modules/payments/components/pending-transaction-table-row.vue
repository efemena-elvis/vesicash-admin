<template>
  <tr @click="toggleTransactionSummaryModal">
    <td class="body-data" :class="`${table_name}-1`">
      <div class="text mgb-6 text-no-wrap">{{ index }}</div>
    </td>

    <td class="body-data" :class="`${table_name}-2`">
      <div class="text mgb-6 text-no-wrap">{{ data.date }}</div>
    </td>

    <td class="body-data" :class="`${table_name}-3`">
      {{ data.sender_account_id }}
    </td>

    <td class="body-data text-capitalize" :class="`${table_name}-4`">
      {{ data.sender_name }}
    </td>

    <td class="body-data text-capitalize" :class="`${table_name}-5`">
      {{ data.type }}
    </td>

    <td class="body-data" :class="`${table_name}-6`">
      {{ data.sender_amount }}
    </td>

    <td class="body-data" :class="`${table_name}-7`">
      <TagCard
        :title="data.status"
        :card_text="
          status_names[data.status ? data.status.toLowerCase() : 'pending']
        "
        :card_type="
          status_colors[data.status ? data.status.toLowerCase() : 'progress']
        "
      />
    </td>

    <td class="body-data" :class="`${table_name}-7`">
      <button class="btn btn-secondary btn-sm d-inline-flex">View</button>
      <button
        class="btn btn-primary btn-sm d-inline-flex mgl-15"
        @click.stop="toggleApprovalModal"
        v-if="data.status === 'pending'"
      >
        Approve
      </button>
    </td>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_transaction_summary_modal">
        <TransactionSummaryModal
          @closeTriggered="toggleTransactionSummaryModal"
          :details="transactionSummary"
        />
      </transition>

      <transition name="fade" v-if="show_approval_modal">
        <WithdrawalApprovalPromptModal
          :id="`${data.id}`"
          @refresh="refresh"
          @closeTriggered="toggleApprovalModal"
          :message="approvalMessage"
        />
      </transition>
    </portal>
  </tr>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";
import TransactionSummaryModal from "@/modules/payments/components/modals/transaction-summary-modal";

export default {
  name: "PendingTransactionTableRow",

  components: {
    TagCard,
    TransactionSummaryModal,
    WithdrawalApprovalPromptModal: () =>
      import(
        /* webpackChunkName: "user-module" */ "@/shared/modals/withdrawal-approval-prompt-modal"
      ),
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
    approvalMessage() {
      const amount = this.data?.sender_amount;
      return `Approve the ${this.data.type} of <b>${amount}</b> by ${this.data?.sender_name}`;
    },

    transactionSummary() {
      return [
        {
          name: "SENDER AMOUNT",
          value: this.data?.sender_amount,
        },
        {
          name: "RECEIVER AMOUNT",
          value: this.data?.receiver_amount,
        },
        {
          name: "SENDER ACCOUNT ID",
          value: this.data?.sender_account_id,
        },
        {
          name: "RECEIVER ACCOUNT ID",
          value: this.data?.receiver_account_id,
        },
        {
          name: "SENDER NAME",
          value: this.data?.sender_name,
        },
        {
          name: "RECEIVER NAME",
          value: this.data?.receiver_name,
        },
        {
          name: "DATE OF TRANSACTION",
          value: this.data?.date,
        },
        {
          name: "PAYMENT TYPE",
          value: this.data?.type,
        },

        {
          name: "STATUS",
          value:
            this.status_names[
              this.data.status ? this.data.status.toLowerCase() : "pending"
            ],
          status:
            this.status_colors[this.data?.status?.toLowerCase() || "progress"],
        },
      ];
    },
  },

  data() {
    return {
      show_transaction_summary_modal: false,
      show_approval_modal: false,
      status: {
        sac: "Sent - Awaiting Confirmation",
        cls: "Closed",
      },

      status_colors: {
        yes: "success",
        pending: "progress",
        no: "error",
      },

      status_names: {
        yes: "Approved",
        pending: "Pending",
        no: "Rejected",
      },
    };
  },

  methods: {
    toggleTransactionSummaryModal() {
      this.show_transaction_summary_modal =
        !this.show_transaction_summary_modal;
    },

    toggleApprovalModal() {
      this.show_approval_modal = !this.show_approval_modal;
    },

    refresh() {
      this.$emit("refresh");
      this.show_approval_modal = false;
    },
  },
};
</script>

<style></style>
