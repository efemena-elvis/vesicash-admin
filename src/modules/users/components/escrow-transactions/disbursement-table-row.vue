<template>
  <tr @click="toggleTransactionSummaryModal">
    <td class="body-data" :class="`${table_name}-1`">
      <div class="text mgb-6 text-no-wrap">{{ index }}</div>
    </td>

    <!-- <td class="body-data" :class="`${table_name}-2`">{{ '12th Mar 2019' || getCreatedDate }}</td> -->

    <td class="body-data" :class="`${table_name}-3`">
      <div class="text mgb-6 text-no-wrap">{{ data.email || '------' }}</div>
    </td>

    <td class="body-data" :class="`${table_name}-4`">
      <div class="text mgb-6 text-no-wrap text-capitalize">{{ data.role || '-----' }}</div>
    </td>

    <td class="body-data" :class="`${table_name}-5`">
      <div class="text mgb-6 text-no-wrap">
        {{ $money.getSign(currency || 'NGN')
        }}{{
        $money.addComma(data.amount || '0.00')
        }}
      </div>
    </td>
    <!-- 
    <td class="body-data" :class="`${table_name}-6`">
      <div class="text mgb-6 text-no-wrap">{{'Card' || data.payment_mehtod }}</div>
    </td>-->

    <!-- <td class="body-data" :class="`${table_name}-7`">
      <TagCard :card_text="'Sucessfull'" :card_type="'success'" />
    </td>-->

    <td class="body-data" :class="`${table_name}-8`">
      <button class="btn btn-secondary btn-sm">View</button>
    </td>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_transaction_summary_modal">
        <TransactionSummaryModal
          :summary="disbursementDetails"
          @closeTriggered="toggleTransactionSummaryModal"
        />
      </transition>
    </portal>
  </tr>
</template>

<script>
import TransactionSummaryModal from "@/modules/users/components/escrow-transactions/modals/transaction-summary-modal";
// import TagCard from "@/shared/components/card-comps/tag-card";

export default {
  name: "DisbursementTableRow",

  components: {
    TransactionSummaryModal,
    // TagCard,
  },

  props: {
    table_name: {
      type: String,
      default: "",
    },

    data: {
      type: [Object, Number],
      default: () => ({}),
    },

    index: {
      type: Number,
      default: 1,
    },

    currency: {
      type: String,
      default: "NGN",
    },

    reference: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      default: "",
    },

    transaction: {
      type: Object,
      default: () => null,
    },
  },

  computed: {
    getCreatedDate() {
      let first_milestone_date =
        `${
          this.data?.milestones[0]?.due_date.split(" ")[0] ?? "2022-01-01"
        } 00:00:00` ?? this.data?.due_date_formatted;

      let { d3, m4, y1 } = this.$date.formatDate(first_milestone_date).getAll();

      return `${d3} ${m4}, ${y1}`;
    },

    disbursementDetails() {
      return {
        title: "Transaction Summary",
        metas: [
          {
            name: "AMOUNT PAID",
            value: `${this.$money.getSign(
              this.currency || "NGN"
            )}${this.$money.addComma(this.data?.amount || "0.00")}`,
          },

          {
            name: "DISBURSEMENT NAME",
            value: this.title,
          },

          {
            name: "DISBURSEMENT TYPE",
            value: this.type,
          },

          {
            name: "TRANSACTION REFERENCE",
            value: this.reference,
          },

          {
            name: "STATUS",
            value: "Completed",
            status: "success",
          },
        ],
      };
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

<style>
</style>