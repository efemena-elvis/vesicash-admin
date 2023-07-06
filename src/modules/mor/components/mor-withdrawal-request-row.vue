<template>
  <tr>
    <td class="body-data" :class="`${table_name}-1`">
      {{ index }}
    </td>

    <td class="body-data" :class="`${table_name}-2`">
      {{ getFormattedData.date }}
    </td>

    <td class="body-data" :class="`${table_name}-4`">
      {{ getFormattedData.name }}
    </td>

    <td class="body-data text-no-wrap" :class="`${table_name}-5`">
      {{ getFormattedData.wallet }}
    </td>

    <td class="body-data" :class="`${table_name}-6`">
      {{ getFormattedData.withdrawal_date }}
    </td>

    <td class="body-data text-no-wrap" :class="`${table_name}-3`">
      {{ getFormattedData.amount }}
    </td>

    <td class="body-data" :class="`${table_name}-8`">
      <TagCard
        :card_text="data.status === 'pending' ? 'Pending' : 'Completed'"
        :card_type="data.status === 'pending' ? 'progress' : 'success'"
      />
    </td>

    <td class="body-data" :class="`${table_name}-7`">
      <button
        class="btn btn-primary btn-sm d-inline-flex approve"
        ref="update"
        :disabled="data.status === ''"
        @click="approveMORWithdrawal"
      >
        Approve
      </button>
      <!-- <button class="btn btn-secondary btn-sm d-inline-flex mgl-15">
        Reject
      </button> -->
    </td>
  </tr>
</template>

<script>
import { mapActions } from "vuex";

import TagCard from "@/shared/components/card-comps/tag-card";

export default {
  name: "MORWithdrawalTableRow",

  components: {
    TagCard,
  },

  props: {
    table_name: {
      type: String,
      default: "",
    },

    index: {
      type: Number,
      default: 1,
    },

    data: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    getFormattedData() {
      const txn_date = this.$date?.formatDate(
        new Date(this.data?.created_at?.split("T")[0]),
        false
      );

      const date = txn_date.getSimpleFormatDate();

      const txn_withdrawal_date = this.$date?.formatDate(
        new Date(this.data?.withdrawal_date?.split("T")[0]),
        false
      );

      const withdrawal_date = txn_withdrawal_date?.getSimpleFormatDate();

      const name = `${this.data?.merchant?.lastname || "-------"} ${
        this.data?.merchant?.firstname || "--------"
      }`;

      const wallet = `${this.data?.currency} wallet`;

      const amount = `${this.$money?.getSign(
        this.data?.currency
      )}${this.$money?.addComma(this.data?.amount)}`;

      const status = this.data?.status;

      return {
        date,
        withdrawal_date,
        name,
        wallet,
        amount,
        status,
      };
    },
  },

  data: () => ({}),

  methods: {
    ...mapActions({ completeMORWithdrawal: "mor/completeMORWithdrawal" }),

    async approveMORWithdrawal() {
      this.handleClick("update");
      try {
        const response = await this.completeMORWithdrawal(this.data?.id);
        this.handleClick("update", "Approve", false);
        const type = response?.code === 200 ? "success" : "warning";
        const message = response?.message;
        this.pushToast(message, type);

        if (response?.code === 200) {
          this.$bus?.$emit("refreshMOR");
        }
      } catch (err) {
        this.handleClick("update", "Approve", false);
        console.log("FAILED TO APPROVE", err);
        this.pushToast("Failed to approve withdrawal", "error");
      }
    },
  },
};
</script>

<style lang="scss">
.btn.approve {
  // padding: 4px 12px;
  .f-size-19 {
    font-size: 0.7rem;
  }

  .icon-spinner {
    position: relative;
    transform: scale(0.7);
  }
}
</style>
