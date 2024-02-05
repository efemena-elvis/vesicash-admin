<template>
  <tr @click="toggleTransactionSummaryModal">
    <td class="body-data" :class="`${table_name}-0`">{{ index }}</td>

    <td class="body-data" :class="`${table_name}-1`">{{ getCreatedDate }}</td>

    <td class="body-data text-no-wrap" :class="`${table_name}-2`">
      {{ data.reference }}
    </td>

    <td class="body-data" :class="`${table_name}-3`">
      {{ data.user.email_address }}
    </td>

    <td class="body-data" :class="`${table_name}-4`">
      {{ $money.getSign(data.currency) }}{{ $money.addComma(data.amount) }}
    </td>

    <td class="body-data" :class="`${table_name}-5`">
      <TagCard
        :card_text="data.status"
        :card_type="STATUS_COLOR[data.status]"
      />
    </td>

    <td class="body-data" :class="`${table_name}-6`">
      <button class="btn btn-secondary btn-sm">View</button>
      <button
        class="btn btn-secondary btn-sm"
        @click.stop="toggleApprovalModal"
        v-if="false"
      >
        Approve
      </button>
    </td>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_transaction_summary_modal">
        <TransactionSummaryModal
          :summary="getSummaryData"
          @closeTriggered="toggleTransactionSummaryModal"
        />
      </transition>

      <transition name="fade" v-if="show_approval_modal">
        <WithdrawalApprovalPromptModal
          :id="data.payment_id"
          @refresh="$emit('refresh')"
          @closeTriggered="toggleApprovalModal"
          :message="approvalMessage"
        />
      </transition>
    </portal>
  </tr>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";
import STATUS_COLOR from "@/utilities/status";

export default {
  name: "TransactionWalletWthdrawalTableRow",

  components: {
    TagCard,

    TransactionSummaryModal: () =>
      import(
        /* webpackChunkName: "user-module" */ "@/modules/users/components/escrow-transactions/modals/transaction-summary-modal"
      ),

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

    data: {
      type: Object,
      default: () => ({}),
    },

    index: {
      type: Number,
      default: 1,
    },
  },

  computed: {
    getCreatedDate() {
      return this.$date
        .formatDate(new Date(this.data?.created_at), false)
        .getSimpleFormatDate();
    },

    approvalMessage() {
      const amount = `${this.$money.getSign(
        this.data?.currency
      )}${this.$money.addComma(this.data?.total_amount)}`;
      const wallet = this.$money?.getName(this.data?.currency);
      return `Approve the withdrawal of <b>${amount}</b> from ${this.data?.user?.email_address} ${wallet} wallet`;
    },

    getSummaryData() {
      return {
        title: "Transaction Summary",
        metas: [
          {
            name: "TRANSACTION DATE",
            value: this.getCreatedDate,
          },
          {
            name: "REFERENCE ID",
            value: this.data?.payment_id,
          },
          {
            name: "CURRENCY",
            value: this.data?.currency,
          },
          {
            name: "TOTAL AMOUNT",
            value: `${this.$money.getSign(
              this.data?.currency
            )}${this.$money.addComma(this.data.amount)}`,
          },

          {
            name: "BENEFICIARY EMAIL",
            value: this.data?.user?.email_address || "------",
          },

          {
            name: "WALLET USED",
            value: this.data?.currency + " WALLET",
          },

          // {
          //   name: "Amount received",
          //   value: `${this.$money.getSign(
          //     this.data.currency
          //   )}${this.$money.addComma(this.data.amount)}`,
          // },
          // {
          //   title: "Withdraw charge",
          //   value: `${this.$money.getSign(
          //     this.data.currency
          //   )}${this.$money.addComma(this.data.fee)}`,
          // },
          // {
          //   title: "Baneficiary name",
          //   value: this.data.beneficiary_name,
          // },
          // {
          //   title: "Bank name",
          //   value: this.data.bank_name,
          // },
          // {
          //   title: "Account number",
          //   value: this.data.bank_account_number,
          // },
          {
            name: "TRANSACTION STATUS",
            value: this.data.is_paid ? "Completed" : "Failed",
            status: this.data.is_paid ? "success" : "error",
          },
        ],
      };
    },
  },

  data: () => ({
    show_transaction_summary_modal: false,
    show_approval_modal: false,
    STATUS_COLOR,
  }),

  methods: {
    toggleTransactionSummaryModal() {
      this.show_transaction_summary_modal =
        !this.show_transaction_summary_modal;
    },

    toggleApprovalModal() {
      this.show_approval_modal = !this.show_approval_modal;
    },
  },
};
</script>

<style></style>
