<template>
  <tr>
    <td class="body-data" :class="`${table_name}-1`">
      <div class="text mgb-6 text-no-wrap">{{ index }}</div>
    </td>

    <td class="body-data" :class="`${table_name}-2`">
      {{ data.range }}
    </td>

    <td class="body-data" :class="`${table_name}-3`">
      <div class="text mgb-6 text-no-wrap">
        {{ data.card_fee }}
      </div>
    </td>

    <td class="body-data" :class="`${table_name}-4`">
      <div class="text mgb-6 text-no-wrap">
        {{ data.bank_fee }}
      </div>
    </td>

    <td class="body-data" :class="`${table_name}-5`">
      <button class="btn btn-secondary btn-sm" @click="$emit('action', data)">
        Edit
      </button>
    </td>
  </tr>
</template>

<script>
export default {
  name: "ChargeTableRow",

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

  computed: {},
};
</script>

<style></style>
