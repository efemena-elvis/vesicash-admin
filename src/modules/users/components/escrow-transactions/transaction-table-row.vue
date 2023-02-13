<template>
  <router-link
    v-slot="{ navigate }"
    custom
    :to="`/users/manage-users/${$route.params.userID}/escrow-transaction/13459/payment-rules`"
  >
    <tr @click="navigate">
      <td class="body-data" :class="`${table_name}-1`">
        <div class="text mgb-6 text-no-wrap">{{ '13434' || data.id }}</div>
      </td>

      <td class="body-data" :class="`${table_name}-2`">
        <div class="text mgb-6 text-no-wrap">{{ 'Payment for web app page' || data.title }}</div>
      </td>

      <td class="body-data" :class="`${table_name}-3`">{{ '12th Mar 2019' || getCreatedDate }}</td>

      <td class="body-data" :class="`${table_name}-4`">
        <div class="text mgb-6 text-no-wrap">
          {{ $money.getSign( 'dollar' || data.currency)
          }}{{
          $money.addComma( data.totalAmount ? '4000' || data.totalAmount : '4000' || data.amount)
          }}
        </div>
        <div class="meta tertiary-3-text grey-600">
          {{ $money.getSign( 'dollar' || data.currency)
          }}{{ $money.addComma('0' || getTotalAmountPaid || 0) }} paid
        </div>
      </td>

      <td class="body-data" :class="`${table_name}-5`">
        <div class="text mgb-6 text-no-wrap">{{'Milestone type' || getTransactionType }}</div>
        <div class="meta tertiary-3-text grey-600">{{ 'Multiple parties' || getPartyType }}</div>
      </td>

      <td class="body-data" :class="`${table_name}-6`">
        <TagCard
          :card_text="'Created ' ||getCurrentTransactionStatus"
          :card_type="'progress' || getCurrentTransactionStatus | getStatusColor(status_colors)"
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
    getCreatedDate() {
      let first_milestone_date =
        `${
          this.data?.milestones[0]?.due_date.split(" ")[0] ?? "2022-01-01"
        } 00:00:00` ?? this.data?.due_date_formatted;

      let { d3, m4, y1 } = this.$date.formatDate(first_milestone_date).getAll();

      return `${d3} ${m4}, ${y1}`;
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

<style>
</style>