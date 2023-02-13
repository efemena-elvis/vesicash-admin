<template>
  <DetailsCard :card_title="payment_rule.milestone_name" :metas="ruleMetas">
    <template v-if="payment_rule.multi">
      <DetailsCard v-for="(user,index) in usersMeta" :key="index" :metas="user" />
    </template>
  </DetailsCard>
</template>

<script>
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
      return this.payment_rule?.multi
        ? [
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
              status: "success",
            },
          ]
        : [
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
              status: "success",
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
</style>