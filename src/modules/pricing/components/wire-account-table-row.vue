<template>
  <tr>
    <td class="body-data" :class="`${table_name}-1`">
      <div class="text text-no-wrap">{{ index }}</div>
    </td>

    <td class="body-data" :class="`${table_name}-2`">
      <div class="text text-no-wrap">{{ createdDate }}</div>
    </td>

    <td class="body-data" :class="`${table_name}-3`">
      {{ data.currency }}
    </td>

    <td class="body-data text-capitalize" :class="`${table_name}-4`">
      {{ data.bank_name }}
    </td>

    <td class="body-data text-capitalize" :class="`${table_name}-5`">
      {{ data.account_number }}
    </td>

    <td class="body-data" :class="`${table_name}-6`">
      {{ data.beneficiary_name }}
    </td>

    <td class="body-data" :class="`${table_name}-7`">
      {{ amount }}
    </td>

    <td class="body-data" :class="`${table_name}-8`">
      <div class="action-wrapper">
        <button
          class="btn btn-secondary btn-sm"
          @click="$emit('edit', data)"
          key="edit-btn"
        >
          Edit
        </button>
        <button
          class="btn btn-alert btn-sm"
          key="delete-btn"
          ref="delete-btn"
          @click="deleteAccount"
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "WireAccountTableRow",

  props: {
    table_name: {
      type: String,
      default: "",
    },

    index: {
      type: [Number, String],
      default: 1,
    },

    data: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    amount() {
      return `${this.$money.getSign(this.data.currency)}${this.$money.addComma(
        this.data.min_amount_threshold
      )}`;
    },

    createdDate() {
      return this.$date
        .formatDate(new Date(this.data.created_at), false)
        .getSimpleFormatDate();
    },
  },

  methods: {
    ...mapActions({ deleteWireAccount: "transaction/deleteWireAccount" }),

    async deleteAccount() {
      try {
        this.handleClick("delete-btn");
        const _response = await this.deleteWireAccount(this.data.id);
        const response = _response?.data || _response;
        this.handleClick("delete-btn", "Delete", false);
        const type = response?.code === 200 ? "success" : "warning";
        const message = response?.data?.message || response?.message;
        this.pushToast(message, type);
        if (response.code === 200) {
          this.$emit("deleted");
        }
      } catch (e) {
        this.handleClick("delete-btn", "Delete", false);
        this.pushToast("Failed", "error");
        console.log("ERROR DELETING WIRE ACCOUNT", e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.action-wrapper {
  @include flex-row-start-nowrap;
  gap: toRem(10);

  .btn {
    max-height: toRem(50);
  }
}
</style>
