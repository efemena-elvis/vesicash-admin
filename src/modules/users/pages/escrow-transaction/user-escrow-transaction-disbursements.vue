<template>
  <div class="pdb-40">
    <DisbursementTable
      :currency="getTxnCurrency"
      :reference="getTxnReference"
      :disbursements="getTxnDisbursements"
      :loading="loading"
      :type="getTxnType"
      :title="getTxnTitle"
      :transaction="transaction"
    />
  </div>
</template>

<script>
import DisbursementTable from "@/modules/users/components/escrow-transactions/disbursement-table";
export default {
  name: "UserEscrowTransactionDisbursement",

  components: {
    DisbursementTable,
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },

    transaction: {
      type: Object,
      default: () => null,
    },
  },

  computed: {
    getTxnReference() {
      if (!this.transaction) return "";
      return this.transaction?.transaction_id;
    },

    getTxnCurrency() {
      if (!this.transaction) return "NGN";
      return this.transaction?.currency;
    },

    getTxnType() {
      if (!this.transaction) return "";
      return this.transaction?.type;
    },

    getTxnTitle() {
      if (!this.transaction) return "";
      return this.transaction?.title;
    },

    getTxnDisbursements() {
      if (
        !this.transaction ||
        this?.transaction?.status !== "Closed - Disbursement Complete"
      )
        return [];
      const members = this.transaction?.members;
      return this.transaction?.milestones?.flatMap((milestone) => {
        if (members?.length)
          return this.updateRecipients(milestone?.recipients, members);
        return milestone?.recipients;
      });
    },
  },

  methods: {
    findMember(members, account_id) {
      return members?.find((member) => member?.account_id === account_id);
    },

    updateRecipients(recipients, members) {
      return recipients.map((recipient) => {
        const member = this.findMember(members, recipient?.account_id);
        if (member) return { ...recipient, ...member };
        return recipient;
      });
    },
  },
};
</script>

<style></style>
