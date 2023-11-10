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
        {{ data.fee }}
      </div>
    </td>

    <td
      class="body-data"
      :class="`${table_name}-4`"
      @click="$emit('action', data)"
    >
      <button class="btn btn-secondary btn-sm">Edit</button>
    </td>
  </tr>
</template>

<script>
export default {
  name: "ProcessingFeeTableRow",

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
