<template>
  <div class="rules-container mgt-25">
    <template v-if="loading">
      <div class="rule-skeleton skeleton-loader"></div>
      <div class="rule-skeleton skeleton-loader"></div>
    </template>

    <template v-else>
      <EscrowPaymentRuleCard
        v-for="(milestone, index) in getTransactionMilestones"
        :key="index"
        :payment_rule="milestone"
      />
    </template>
  </div>
</template>

<script>
import EscrowPaymentRuleCard from "@/modules/users/components/escrow-transactions/escrow-payment-rule-card";
export default {
  name: "UserEscrowTransactionPaymentRules",

  components: {
    EscrowPaymentRuleCard,
  },

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

  computed: {
    getTransactionMilestones() {
      if (!this.transaction || !this.transaction?.milestones?.length) return [];
      const milestones = [...this.transaction?.milestones];
      const currency = this.transaction?.currency;

      return milestones?.map((milestone, index) => {
        const title =
          milestones?.length > 1
            ? milestone?.title || `Milestone ${index + 1}`
            : "";

        const user_email =
          milestone?.recipients?.length < 2
            ? milestone?.recipients[0]?.email || "------"
            : "";

        const amount =
          milestone?.recipients?.length < 2
            ? this.formatMoney(currency, `${milestone?.amount}`)
            : "";

        const due_date = this.$date
          ?.formatDate(new Date(milestone?.due_date * 1000), false)
          ?.getSimpleFormatDate();

        const inspection_period = `${
          milestone?.inspection_period || "----"
        } days`;

        const status = milestone?.status || "----";

        const multi = milestone?.recipients?.length > 1;

        const users = milestone?.recipients?.length
          ? milestone?.recipients?.map((user) => {
              const amount = this.formatMoney(currency, user?.amount);
              const email = user?.email;
              return { amount, email };
            })
          : [];

        return {
          title,
          user_email,
          amount,
          due_date,
          inspection_period,
          status,
          multi,
          users,
        };
      });
    },
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

  methods: {
    formatMoney(currency, amount) {
      return `${this.$money?.getSign(currency || "NGN")}${this.$money?.addComma(
        amount || "0.00"
      )}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.rules-container {
  display: grid;
  gap: toRem(40);
  padding-bottom: toRem(120);
}

.rule-skeleton {
  width: 100%;
  height: toRem(70);
}
</style>
