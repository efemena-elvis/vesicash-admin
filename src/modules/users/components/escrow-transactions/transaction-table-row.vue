<template>
  <router-link
    v-slot="{ navigate }"
    custom
    :to="`/users/manage-users/${$route.params.userID}/escrow-transaction/${data.transaction_id}/payment-rules`"
  >
    <tr @click="navigate">
      <td class="body-data" :class="`${table_name}-1`">
        <div class="text mgb-6 text-no-wrap">{{ data.id }}</div>
      </td>

      <td class="body-data" :class="`${table_name}-2`">
        <div class="text mgb-6 text-no-wrap">{{ data.description }}</div>
      </td>

      <td class="body-data" :class="`${table_name}-3`">{{ getDueDate }}</td>

      <td class="body-data" :class="`${table_name}-4`">
        <div class="text mgb-6 text-no-wrap">
          {{ $money.getSign(data.currency)
          }}{{ $money.addComma(data.amount || data.totalAmount) }}
        </div>
        <div class="meta tertiary-3-text grey-600">
          {{ $money.getSign("dollar" || data.currency)
          }}{{ $money.addComma(getTotalAmountPaid || 0) }} paid
        </div>
      </td>

      <td class="body-data" :class="`${table_name}-5`">
        <div class="text mgb-6 text-no-wrap">{{ getTransactionType }}</div>
        <div class="meta tertiary-3-text grey-600">{{ getPartyType }}</div>
      </td>

      <td class="body-data" :class="`${table_name}-6`">
        <TagCard
          :title="data.status"
          :card_text="data.status"
          :card_type="data.status | getStatusColor(status_colors)"
        />
      </td>

      <td class="body-data" :class="`${table_name}-7`">
        <button class="btn btn-secondary btn-sm">View</button>
      </td>
    </tr>
  </router-link>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";

export default {
  name: "TransactionTableRow",

  components: {
    TagCard,
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
  },

  computed: {
    getDueDate() {
      const due_date = this.$date?.formatDate(
        new Date(this.data?.due_date * 1000),
        false
      );

      return due_date.getSimpleFormatDate();
    },

    getTransactionType() {
      return this.data.type === "oneoff" ? "One-off type" : "Milestone type";
    },

    getPartyType() {
      return this.data?.members?.length === 2
        ? "1 on 1 party"
        : "Multiple parties";
    },

    getPartyCount() {
      return this.data?.members?.length ?? 0;
    },

    getTotalTransactionAmount() {
      return this.data.milestones.length
        ? this.data.milestones.reduce(
            (total, count) => (total += Number(count.amount)),
            0
          )
        : this.data.amount;
    },

    getTotalAmountPaid() {
      let amount_paid = Number(this.data?.amount_paid);
      let escrow_charge = Number(this.data?.escrow_charge);
      return amount_paid > 0 ? amount_paid + escrow_charge : amount_paid;
    },
  },

  filters: {
    getStatusColor(status, status_colors) {
      return status_colors[status?.toLowerCase()] || "error";
    },
  },

  data() {
    return {
      status: {
        sac: "Sent - Awaiting Confirmation",
        cls: "Closed",
      },

      status_colors: {
        "sent - awaiting confirmation": "progress",
        "sent - Rejected": "error",
        "accepted - not funded": "error",
        "accepted - funded": "okay",
        draft: "okay",
        "in progress": "progress",
        delivered: "okay",
        "delivered - accepted": "success",
        "delivered - rejected": "error",
        "closed - disbursement complete": "success",
        completed: "success",
        "closed - refunded": "error",
        "closed - not funded": "error",
        closed: "error",
      },
    };
  },
};
</script>

<style></style>
