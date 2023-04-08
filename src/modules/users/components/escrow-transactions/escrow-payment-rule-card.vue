<template>
  <DetailsCard :card_title="payment_rule.title" :metas="ruleMetas">
    <template v-if="payment_rule.multi">
      <div class="slot-wrapper">
        <DetailsCard
          v-for="(user, index) in usersMeta"
          :key="index"
          :metas="user"
        />
      </div>
    </template>
  </DetailsCard>
</template>

<script>
import STATUS_COLORS from "@/utilities/status";
import DetailsCard from "@/shared/components/card-comps/details-card";
export default {
  name: "EscrowPaymentRuleCard",

  components: {
    DetailsCard,
  },

  props: {
    payment_rule: {
      type: Object,
      default: () => ({
        milestone_name: "MILESTONE NAME:  PAYMENT FOR WEB APP",
        user_email: "Salimadeyemi@gmai.com",
        amount: "$23,000",
        due_date: "24th apr 2019",
        inspection_period: "4 days",
        status: "verified",
        multi: true,
        users: [
          {
            email: "Salimadeyemi@gmai.com",
            amount: "$23,000",
          },
          {
            email: "Salimadeyemi@gmai.com",
            amount: "$23,000",
          },
        ],
      }),
    },
  },

  computed: {
    ruleMetas() {
      return [
        {
          name: "USER DETAILS",
          value: this.payment_rule?.user_email,
        },
        {
          name: "AMOUNT TO PAY",
          value: this.payment_rule?.amount,
        },
        {
          name: "PAYMENT DUE DATE",
          value: this.payment_rule?.due_date,
        },
        {
          name: "INSPECTION PERIOD",
          value: this.payment_rule?.inspection_period,
        },
        {
          name: "TRANSACTION STATUS",
          value: this.payment_rule?.status,
          status:
            STATUS_COLORS[this.payment_rule?.status?.toLowerCase()] || "error",
        },
      ];
    },

    usersMeta() {
      return this.payment_rule?.users?.map((user) => {
        return [
          { name: "USER DETAILS", value: user?.email },
          { name: "AMOUNT TO PAY", value: user?.amount },
        ];
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.slot-wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: toRem(30);

  @include breakpoint-down(xl) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}
</style>
