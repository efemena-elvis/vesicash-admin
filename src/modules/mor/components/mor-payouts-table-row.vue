<template>
  <tr @click="toggleTransactionSummaryModal">
    <td class="body-data" :class="`${table_name}-1`">
      {{ index }}
    </td>

    <td class="body-data" :class="`${table_name}-2`">
      {{ "23rd July, 2021" || getFormattedData.date }}
    </td>

    <td class="body-data text-no-wrap" :class="`${table_name}-3`">
      {{ "yuiro908p0" || getFormattedData.id }}
    </td>

    <td class="body-data" :class="`${table_name}-4`">
      {{ "Naira wallet" || getFormattedData.wallet }}
    </td>

    <td class="body-data text-no-wrap" :class="`${table_name}-5`">
      {{ "$45,000" || getFormattedData.amount }}
    </td>

    <td class="body-data" :class="`${table_name}-8`">
      <TagCard
        :card_text="
          'successful' || data.status !== 'successful' ? 'Failed' : 'Completed'
        "
        :card_type="
          'successful' || data.status !== 'successful' ? 'error' : 'success'
        "
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
          title="Payout summary"
        />
      </transition>
    </portal>
  </tr>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";
import FxSummaryModal from "@/modules/foreign-exchange/components/modals/fx-summary-modal";

export default {
  name: "MORPayoutTableRow",

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

      const date = txn_date?.getSimpleFormatDate();

      const id = this.data?.reference || "---------";

      //   const email = this.data?.user?.email_address;

      //   const initial_currency = `${this.$money?.getSign(
      //     this.data?.rate?.from_currency
      //   )}${this.$money?.addComma(this.data?.initial_amount)}`;
      const amount = `${this.$money?.getSign(
        this.data?.currency
      )}${this.$money?.addComma(this.data?.amount)}`;

      return {
        id,
        date,
        wallet: `${this.data.currency} wallet`,
        amount,
        status: this.data.status,
      };
    },

    details() {
      return [
        {
          name: "AMOUNT",
          value: "N45,000" || this.getFormattedData?.date,
        },
        {
          name: "TRANSACTION DATE",
          value: "21st Apr 2022" || this.getFormattedData?.date,
        },
        {
          name: "TRANSACTION REFERENCE",
          value: "112450701" || this.getFormattedData?.id,
        },
        {
          name: "MERCHANT NAME",
          value: "UBER Ride" || this.getFormattedData?.name,
        },
        {
          name: "WALLET",
          value: "Dollar" || this.getFormattedData?.email,
        },
        {
          name: "STATUS",
          value: "Completed",
          status: "success",
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
