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
      {{ getFormattedData.email }}
    </td>

    <td class="body-data" :class="`${table_name}-6`">
      {{ getFormattedData.initial_currency }}
    </td>

    <td class="body-data" :class="`${table_name}-7`">
      {{ getFormattedData.final_currency }}
    </td>

    <!-- <td class="body-data" :class="`${table_name}-5`">
      {{ getFormattedData.rate }}
    </td> -->

    <td class="body-data" :class="`${table_name}-8`">
      <TagCard
        :card_text="data.status === 'failed' ? 'Failed' : 'Completed'"
        :card_type="data.status === 'failed' ? 'error' : 'success'"
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
        />
      </transition>
    </portal>
  </tr>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";
import FxSummaryModal from "@/modules/foreign-exchange/components/modals/fx-summary-modal";

export default {
  name: "FXTableRow",

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
        new Date(this.data?.created_at),
        false
      );

      const date = txn_date?.getSimpleFormatDate();

      const id = this.data?.uid || "---------";

      const email = this.data?.user?.email_address;

      const initial_currency = `${this.$money?.getSign(
        this.data?.rate?.from_currency
      )}${this.$money?.addComma(this.data?.initial_amount)}`;
      const final_currency = `${this.$money?.getSign(
        this.data?.rate?.to_currency
      )}${this.$money?.addComma(this.data?.final_amount)}`;

      return {
        id,
        date,
        name: `${this.data?.rate?.from_currency} to ${this.data?.rate?.to_currency}`,
        email,
        initial_currency,
        final_currency,
        rate: `${this.$money.getSign(
          this.data?.rate?.from_currency
        )}1/${this.$money.getSign(this.data?.rate?.to_currency)}${
          this.data?.rate?.amount
        }`,
        status: this.data?.status,
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
