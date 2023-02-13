<template>
  <div class="rules-container mgt-25">
    <EscrowPaymentRuleCard :payment_rule="sample_rule_one" />
    <EscrowPaymentRuleCard />
    <EscrowPaymentRuleCard :payment_rule="sample_rule_two" />
    <EscrowPaymentRuleCard :payment_rule="sample_rule_three" />
  </div>
</template>

<script>
import EscrowPaymentRuleCard from "@/modules/users/components/escrow-transactions/escrow-payment-rule-card";
export default {
  name: "UserEscrowTransactionPaymentRules",

  components: {
    EscrowPaymentRuleCard,
  },

  data() {
    return {
      sample_rule_one: {
        milestone_name: "MILESTONE NAME:  PAYMENT FOR WEB APP",
        user_email: "Salimadeyemi@gmai.com",
        amount: "$23,000",
        due_date: "24th apr 2019",
        inspection_period: "4 days",
        status: "verified",
        multi: false,
        users: [
          {
            email: "Salimadeyemi@gmai.com",
            amount: "$23,000",
          },
        ],
      },

      sample_rule_two: {
        milestone_name: "",
        user_email: "Salimadeyemi@gmai.com",
        amount: "$23,000",
        due_date: "24th apr 2019",
        inspection_period: "4 days",
        status: "verified",
        multi: false,
        users: [
          {
            email: "Salimadeyemi@gmai.com",
            amount: "$23,000",
          },
        ],
      },

      sample_rule_three: {
        milestone_name: "",
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
        ],
      },
    };
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.rules-container {
  display: grid;
  gap: toRem(40);
  padding-bottom: toRem(120);
}
</style>