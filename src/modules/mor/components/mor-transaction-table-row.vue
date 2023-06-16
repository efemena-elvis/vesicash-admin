<template>
  <tr @click="toggleTransactionSummaryModal">
    <td class="body-data" :class="`${table_name}-1`">
      {{ index }}
    </td>

    <td class="body-data" :class="`${table_name}-2`">
      {{ getFormattedData.date }}
    </td>

    <td class="body-data text-no-wrap" :class="`${table_name}-3`">
      {{ getFormattedData.id }}
    </td>

    <td class="body-data" :class="`${table_name}-4`">
      {{ getFormattedData.name }}
    </td>

    <td class="body-data text-no-wrap" :class="`${table_name}-5`">
      {{ getFormattedData.currency }}
    </td>

    <td class="body-data" :class="`${table_name}-6`">
      {{ getFormattedData.amount }}
    </td>

    <td class="body-data" :class="`${table_name}-8`">
      <TagCard
        :card_text="data.status !== 'successful' ? 'Failed' : 'Completed'"
        :card_type="data.status !== 'successful' ? 'error' : 'success'"
      />
    </td>

    <td class="body-data" :class="`${table_name}-7`">
      <button class="btn btn-secondary btn-sm">View</button>
    </td>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_transaction_summary_modal">
        <FxSummaryModal
          @closeTriggered="toggleTransactionSummaryModal"
          :details="details"
          title="MOR transaction summary"
        />
      </transition>
    </portal>
  </tr>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";
import FxSummaryModal from "@/modules/foreign-exchange/components/modals/fx-summary-modal";

export default {
  name: "MORTxnTableRow",

  components: {
    TagCard,
    FxSummaryModal,
  },

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
        new Date(this.data?.transaction_date?.split("T")[0]),
        false
      );

      const txn_posted_date = this.$date?.formatDate(
        new Date(this.data?.created_at?.split("T")[0]),
        false
      );

      const posted_date = txn_posted_date?.getSimpleFormatDate();

      const date =
        new Date(
          this.data?.transaction_date?.split("T")[0]
        ).toLocaleDateString() || txn_date.getSimpleFormatDate();

      const id = this.data?.reference || "---------";

      const amount = `${this.$money?.getSign(
        this.data?.currency
      )}${this.$money?.addComma(this.data?.amount)}`;

      const name = this.data?.merchant_name;

      const currency = this.data?.currency;

      const status = this.data?.status;

      return {
        id,
        date,
        posted_date,
        name,
        currency,
        amount,
        status,
      };
    },

    details() {
      return [
        {
          name: "AMOUNT",
          value: this.getFormattedData?.amount,
        },
        {
          name: "TRANSACTION DATE",
          value: this.getFormattedData?.date,
        },
        {
          name: "TRANSACTION REFERENCE",
          value: this.getFormattedData?.id,
        },
        {
          name: "MERCHANT NAME",
          value: this.getFormattedData?.name,
        },
        {
          name: "WALLET",
          value: this.getFormattedData?.currency,
        },
        {
          name: "DATE POSTED",
          value: this.getFormattedData?.posted_date,
        },
        {
          name: "STATUS",
          value:
            this.getFormattedData?.status !== "successful"
              ? "Failed"
              : "Completed",
          status:
            this.getFormattedData?.status !== "successful"
              ? "error"
              : "success",
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
