<template>
  <tr @click="toggleTransactionSummaryModal">
    <td class="body-data" :class="`${table_name}-0`">{{ index }}</td>

    <td class="body-data" :class="`${table_name}-1`">{{ getCreatedDate }}</td>

    <td class="body-data text-no-wrap" :class="`${table_name}-2`">{{ data.reference }}</td>

    <td class="body-data" :class="`${table_name}-3`">{{ data.beneficiary_name || '-----' }}</td>

    <td
      class="body-data"
      :class="`${table_name}-4`"
    >{{ $money.getSign(data.currency) }}{{ $money.addComma(data.amount) }}</td>

    <td class="body-data" :class="`${table_name}-5`">
      <TagCard :card_text="data.status" :card_type="STATUS_COLOR[data.status]" />
    </td>

    <td class="body-data" :class="`${table_name}-6`">
      <button class="btn btn-secondary btn-sm">View</button>
    </td>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_transaction_summary_modal">
        <TransactionSummaryModal
          :summary="getSummaryData"
          :modal_style="modal_style"
          @closeTriggered="toggleTransactionSummaryModal"
        />
      </transition>
    </portal>
  </tr>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";
import STATUS_COLOR from "@/utilities/status";

export default {
  name: "TransactionWalletFundingTableRow",

  components: {
    TagCard,

    TransactionSummaryModal: () =>
      import(
        /* webpackChunkName: "dashboard-table-module" */ "@/modules/users/components/escrow-transactions/modals/transaction-summary-modal"
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
            value: this.data?.reference,
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
            name: "BENEFICIARY NAME",
            value: this.data?.beneficiary_name,
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
          {
            name: "BANK NAME",
            value: this.data.bank_name,
          },
          {
            name: "ACCOUNT NUMBER",
            value: this.data.bank_account_number,
          },
          {
            name: "TRANSACTION STATUS",
            value: this.data.status,
            status: this.STATUS_COLOR[this.data?.status],
          },
        ],
      };
    },
  },

  data: () => ({
    show_transaction_summary_modal: false,
    STATUS_COLOR,
    modal_style: { size: "modal-md" },
  }),

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