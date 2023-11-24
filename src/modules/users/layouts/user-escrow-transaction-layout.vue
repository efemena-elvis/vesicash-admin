<template>
  <div class="pdb-40">
    <PageBackBtn :back_link="getBackLink" />

    <div class="d-flex justify-content-between align-items-center">
      <div
        class="skeleton-loader txn-name-skeleton"
        v-if="loading_transaction || !transaction_details"
      ></div>
      <div class="page-title" v-else>{{ transaction_details.title }}</div>

      <select name="status" id="status" class="form-control" v-if="false">
        <option value="0">Change status</option>
        <option value="1">Renew date</option>
        <option value="2">Reject</option>
        <option value="3">Approve</option>
      </select>
    </div>

    <div class="details-row mgy-40">
      <template v-if="loading_transaction">
        <div class="card-skeleton skeleton-loader"></div>
        <div class="card-skeleton skeleton-loader"></div>
      </template>

      <template v-else>
        <DetailsCard
          :card_title="disbursement_title"
          :metas="disbursementDetails"
        />

        <DetailsCard :card_title="payment_title" :metas="paymentDetails" />
      </template>
    </div>

    <RouteTabSwitcher :tabs="transactionTabs" />

    <router-view
      :loading="loading_transaction"
      :payments="payments"
      :transaction="transaction_details"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
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

  mounted() {
    this.fetchTransaction();
  },

  computed: {
    getBackLink() {
      const { userID } = this.$route?.params;
      return userID
        ? `/users/manage-users/${userID}/escrow-transaction`
        : `/escrow-transactions`;
    },

    transactionTabs() {
      const { userID, transactionID } = this.$route?.params;

      return userID
        ? [
            {
              name: "PAYMENT RULES",
              route: `/users/manage-users/${userID}/escrow-transaction/${transactionID}/payment-rules`,
            },
            {
              name: "PAYMENT",
              route: `/users/manage-users/${userID}/escrow-transaction/${transactionID}/payments`,
            },
            {
              name: "PARTIES",
              route: `/users/manage-users/${userID}/escrow-transaction/${transactionID}/parties`,
            },
            {
              name: "ACTIVITY",
              route: `/users/manage-users/${userID}/escrow-transaction/${transactionID}/activity`,
            },
          ]
        : [
            {
              name: "PAYMENT RULES",
              route: `/escrow-transactions/${transactionID}/payment-rules`,
            },
            {
              name: "PAYMENT",
              route: `/escrow-transactions/${transactionID}/payments`,
            },
            {
              name: "PARTIES",
              route: `/escrow-transactions/${transactionID}/parties`,
            },
            {
              name: "ACTIVITY",
              route: `/escrow-transactions/${transactionID}/activity`,
            },
          ];
    },

    disbursementDetails() {
      const active_status = [
        // "Sent - Awaiting Confirmation",
        // "Accepted - Not Funded",
        "In Progress",
        // "Draft",
        "Active",
        "Delivered - Accepted",
        "Closed - Disbursement Pending",
        "Accepted - Funded",
        "Delivered - Rejected",
      ];

      const last_milestone_index =
        (this.transaction_details?.milestones?.length || 1) - 1;

      const active_milestone = this.transaction_details?.milestones?.find(
        (milestone, index) => {
          return (
            active_status.includes(milestone?.status) ||
            last_milestone_index === index
          );
        }
      );

      const active_due_date = this.formattedDate(
        active_milestone?.due_date?.split(" "),
        true
      );
      const status = active_milestone?.status;

      return [
        {
          name: "#",
          value: this.transaction_details?.id,
        },
        {
          name: "PAYMENT CREATION DATE",
          value: this.formattedDate(this.transaction_details?.created_at),
        },
        {
          name: "DUE DATE",
          value: active_due_date,
        },
        {
          name: "DISBURSMENT TYPE",
          value:
            this.transaction_details?.type === "oneoff"
              ? "One-off disbursement"
              : "Multiple disbursment",
        },
        {
          name: "NO. OF PARTIES",
          value:
            this.transaction_details?.members?.length > 2
              ? "Multiple parties"
              : "Two parties",
        },
        {
          name: "TRANSACTION STATUS",
          value: status,
          status: this.status_colors[status?.toLowerCase()] || "error",
        },
      ];
    },

    paymentDetails() {
      const amount = this.transaction_details?.milestones?.reduce(
        (sum, milestone) => {
          sum += Number(milestone?.amount || 0);
          return sum;
        },
        0
      );

      return [
        {
          name: "AMOUNT TO PAY",
          value: `${this.$money?.getSign(
            this.transaction_details?.currency
          )}${this.$money?.addComma(
            this.transaction_details?.amount || "0.00"
          )}`,
        },
        {
          name: "AMOUNT PAID",
          value: `${this.$money?.getSign(
            this.transaction_details?.currency
          )}${this.$money?.addComma(amount || "0.00")}`,
        },
        // {
        //   name: "PAYMENT CURRENCY",
        //   value: "Dollar",
        // },
        {
          name: "DISPUTE HANDLER",
          value: this.transaction_details?.dispute_handler || "Vesicash",
        },
        // {
        //   name: "ATTACHMENT FILE",
        //   value: "imge001.jpg",
        // },
      ];
    },
  },

  filters: {
    getStatusColor(status, status_colors) {
      return status_colors[status?.toLowerCase()] || "error";
    },
  },

  data() {
    return {
      disbursement_title: "DISBURSMENT DETAILS",
      payment_title: "PAYMENT DETAILS",

      transaction_details: null,
      payments: [],
      loading_transaction: false,

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

  methods: {
    ...mapActions({ fetchTransactionDetails: "users/fetchTransactionDetails" }),

    formattedDate(date, timestamp = false) {
      if (!date) return "";
      const _data = timestamp ? date * 1000 : date;
      const _date = this.$date?.formatDate(new Date(_data), false);
      return _date.getSimpleFormatDate();
    },

    async fetchTransaction() {
      this.loading_transaction = true;
      try {
        const response = await this.fetchTransactionDetails(
          this.$route?.params?.transactionID
        );

        this.loading_transaction = false;

        if (response?.code === 200) {
          this.transaction_details = response?.data?.transactions;
          this.payments = response?.data?.payments;
        } else
          this.pushToast(
            response?.message || "Failed to load transaction",
            "warning"
          );
      } catch (err) {
        this.loading_transaction = false;
        console.log("ERROR FETCHING TRANSACTIONS", err);
        this.pushToast("Failed to load transaction", "error");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
select.form-control {
  max-width: toRem(180);
}

.txn-name-skeleton {
  @include draw-shape(300, 35);
}

.card-skeleton {
  height: toRem(110);
}

.details-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: toRem(40) toRem(30);
}
</style>
