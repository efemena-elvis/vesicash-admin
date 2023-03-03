<template>
  <tr @click="toggleTransactionSummaryModal">
    <td class="body-data" :class="`${table_name}-1`">
      <div class="text mgb-6 text-no-wrap">{{ index }}</div>
    </td>

    <td class="body-data" :class="`${table_name}-2`">{{ data.date }}</td>

    <td class="body-data" :class="`${table_name}-3`">
      <div class="text mgb-6 text-no-wrap">{{ data.email }}</div>
    </td>

    <td class="body-data" :class="`${table_name}-4`">
      <div class="text mgb-6 text-no-wrap">
        {{ $money.getSign(data.currency || 'NGN')
        }}{{
        $money.addComma(data.amount || '0.00')
        }}
      </div>
    </td>

    <!-- <td class="body-data" :class="`${table_name}-5`">
      <div class="text mgb-6 text-no-wrap">{{data.payment_method }}</div>
    </td>-->

    <td class="body-data" :class="`${table_name}-6`">
      <TagCard
        :card_text="data.paid ? 'Successfull': 'Pending'"
        :card_type="data.paid ? 'success':'progress'"
      />
    </td>

    <td class="body-data" :class="`${table_name}-7`">
      <button class="btn btn-secondary btn-sm">View</button>
    </td>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_transaction_summary_modal">
        <TransactionSummaryModal
          :summary="paymentDetails"
          @closeTriggered="toggleTransactionSummaryModal"
        />
      </transition>
    </portal>
  </tr>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";
import TransactionSummaryModal from "@/modules/users/components/escrow-transactions/modals/transaction-summary-modal";

export default {
  name: "PaymentTableRow",

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
      type: Number,
      default: 1,
    },

    data: {
      type: Object,
      default: () => ({}),
    },

    title: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "",
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

    paymentDetails() {
      return {
        title: "Transaction Summary",
        metas: [
          {
            name: "AMOUNT PAID",
            value: `${this.$money.getSign(
              this.data?.currency || "NGN"
            )}${this.$money.addComma(this.data?.amount || "0.00")}`,
          },

          {
            name: "DISBURSEMENT NAME",
            value: this.title,
          },

          {
            name: "TRANSACTION DATE",
            value: this.data?.date,
          },

          {
            name: "TRANSACTION REFERENCE",
            value: this.data?.transaction_id,
          },

          {
            name: "DISBURSEMENT TYPE",
            value: this.type,
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