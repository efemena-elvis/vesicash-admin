<template>
  <tr @click="toggleTransactionSummaryModal">
    <td class="body-data" :class="`${table_name}-0`">
      {{ index }}
    </td>

    <td class="body-data" :class="`${table_name}-1`">
      {{ getFormattedData.date }}
    </td>

    <td class="body-data text-no-wrap" :class="`${table_name}-2`">
      {{ getFormattedData.id }}
    </td>

    <td class="body-data" :class="`${table_name}-1`">
      {{ getFormattedData.name }}
    </td>

    <td class="body-data" :class="`${table_name}-3`">
      {{ getFormattedData.rate }}
    </td>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="false"> </transition>
    </portal>
  </tr>
</template>

<script>
export default {
  name: "FXRateTableRow",

  props: {
    table_name: {
      type: String,
      default: "",
    },

    index: {
      type: Number,
      default: 1,
    },

    data: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    getFormattedData() {
      const txn_date = this.$date?.formatDate(
        new Date(this.data?.updated_at),
        false
      );

      const date = txn_date?.getSimpleFormatDate();

      const id = this.data?.uid || "---------";

      const rate = `${this.$money.getSign(
        this.data?.from_currency
      )}1/${this.$money.getSign(this.data?.to_currency)}${this.data?.amount}`;

      return {
        id,
        date,
        name: `${this.data?.from_currency} to ${this.data?.to_currency}`,
        rate,
      };
    },

    details() {
      return [
        {
          name: "TRANSACTION DATE",
          value: this.getFormattedData?.date,
        },
        {
          name: "TRANSACTION REFERENCE",
          value: this.getFormattedData?.id,
        },
        {
          name: "TRANSACTION NAME",
          value: this.getFormattedData?.name,
        },
        {
          name: "EMAIL ADDRESS",
          value: this.getFormattedData?.email,
        },
        {
          name: "INITIAL AMOUNT",
          value: this.getFormattedData?.initial_currency,
        },
        {
          name: "FINAL AMOUNT",
          value: this.getFormattedData?.final_currency,
        },
        {
          name: "STATUS",
          value: this.data.status === "failed" ? "Failed" : "Completed",
          status: this.data.status === "failed" ? "progress" : "success",
        },
      ];
    },
  },

  data: () => ({
    show_transaction_summary_modal: false,
  }),

  methods: {
    toggleTransactionSummaryModal() {
      this.show_transaction_summary_modal =
        !this.show_transaction_summary_modal;
    },
  },
};
</script>

<style></style>
