<template>
  <div class="pdt-30">
    <div class="activity-skeleton skeleton-loader" v-if="loading"></div>
    <ActivityCard :activities="transaction.activities" v-else-if="!loading && transaction" />
  </div>
</template>

<script>
import ActivityCard from "@/modules/escrow/components/activity-card";
export default {
  name: "UserEscrowTransactionActivity",

  props: {
    transaction: {
      type: Object,
      default: () => null,
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    ActivityCard,
  },

  computed: {
    escrowActivities() {
      return [
        {
          description:
            "Kunleafolayan@gmail.com made a payment of $70,000 into escrow",
          created_at: "2023-05-06",
        },
        {
          description:
            "Kunleafolayan@gmail.com made a payment of $70,000 into escrow",
          created_at: "2023-01-26",
        },
        {
          description:
            "Kunleafolayan@gmail.com made a payment of $70,000 into escrow",
          created_at: "2023-05-16",
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.activity-skeleton {
  width: 100%;
  height: toRem(100);
}
</style>