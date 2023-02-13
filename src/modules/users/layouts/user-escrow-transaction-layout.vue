<template>
  <div>
    <PageBackBtn :back_link="`user/${$route.params.userID}/escrow-transactions`" />

    <div class="d-flex justify-content-between align-items-center">
      <div class="page-title">Payment for web page</div>

      <select name="status" id="status" class="form-control">
        <option value="0">Change status</option>
        <option value="1">Renew date</option>
        <option value="2">Reject</option>
        <option value="3">Approve</option>
      </select>
    </div>

    <div class="details-row mgy-40">
      <DetailsCard :card_title="disbursement_title" :metas="disbursementDetails" />

      <DetailsCard :card_title="payment_title" :metas="paymentDetails" />
    </div>

    <RouteTabSwitcher :tabs="transactionTabs" />

    <router-view />
  </div>
</template>

<script>
import PageBackBtn from "@/shared/components/page-back-btn";
import DetailsCard from "@/shared/components/card-comps/details-card";
import RouteTabSwitcher from "@/shared/components/route-tab-switcher";
export default {
  name: "TransactionDetailsPage",

  components: {
    PageBackBtn,
    DetailsCard,
    RouteTabSwitcher,
  },

  computed: {
    transactionTabs() {
      const { userID, transactionID } = this.$route?.params;

      return [
        {
          name: "PAYMENT RULES",
          route: `/users/manage-users/${userID}/escrow-transaction/${transactionID}/payment-rules`,
        },
        {
          name: "PAYMENT",
          route: `/users/manage-users/${userID}/escrow-transaction/${transactionID}/payments`,
        },
        {
          name: "ACTIVITY",
          route: `/users/manage-users/${userID}/escrow-transaction/${transactionID}/activity`,
        },
      ];
    },

    disbursementDetails() {
      return [
        {
          name: "#",
          value: "1120331",
        },
        {
          name: "PAYMENT CREATION DATE",
          value: "24th Apr 2023",
        },
        {
          name: "PAYMENT DUE DATE",
          value: "1120331",
        },
        {
          name: "DISBURSMENT TYPE",
          value: "Multiple disbursment",
        },
        {
          name: "NO OF PARTIES",
          value: "Multiple parties",
        },
        {
          name: "TRANSACTION STATUS",
          value: "Verified",
          status: "success",
        },
      ];
    },

    paymentDetails() {
      return [
        {
          name: "AMOUNT TO PAY",
          value: "$34,000",
        },
        {
          name: "AMOUNT PAID",
          value: "$0",
        },
        {
          name: "PAYMENT CURRENCY",
          value: "Dollar",
        },
        {
          name: "DISPUTE TYPE",
          value: "Vesicash handles",
        },
        {
          name: "ATTACHMENT FILE",
          value: "imge001.jpg",
        },
      ];
    },
  },

  data() {
    return {
      disbursement_title: "DISBURSMENT DETAILS",
      payment_title: "PAYMENT DETAILS",

      transaction_tabs: [
        {
          name: "PAYMENT RULES",
          routeName: "UserEscrowTransactionPaymentRules",
        },
        {
          name: "PAYMENT",
          routeName: "UserEscrowTransactionPaymentTabs",
        },
        {
          name: "ACTIVITY",
          routeName: "UserEscrowTransactionActivity",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
select.form-control {
  max-width: toRem(180);
}

.details-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: toRem(40) toRem(30);
}
</style>