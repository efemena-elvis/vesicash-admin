<template>
  <div class="pdt-30">
    <EscrowMembersTable :loading="loading" :members="getMembers" />
  </div>
</template>

<script>
import EscrowMembersTable from "@/modules/users/components/escrow-transactions/escrow-members-table";

export default {
  name: "TransactionMembersPage",

  components: {
    EscrowMembersTable,
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
    getMembers() {
      if (!this.transaction) return [];

      const accessMap = {
        can_view: "View",
        can_receive: "",
        mark_as_done: "Mark as done",
        approve: "Approve",
      };

      return this.transaction?.members?.map((member) => {
        const access = Array.isArray(member?.access_level)
          ? member?.access_level
              ?.map((level) => level?.split("_")?.join(" "))
              ?.join("/")
          : Object.entries(member?.access_level)
              ?.map(([k, v]) => (v ? accessMap[k] : ""))
              .filter((item) => item)
              .join("/");

        const email = member?.email || "------";
        const phone = member?.phone_number || "-------";
        const role = member?.role?.split("_")?.join(" ") || "-------";
        const payout = member?.access_level?.can_receive ? "Yes" : "No";

        return {
          access,
          email,
          phone,
          role,
          payout,
        };
      });
    },
  },
};
</script>

<style lang="scss"></style>
