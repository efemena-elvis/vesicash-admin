<template>
  <tr @click="$emit('view',data)">
    <td class="body-data grey-900" :class="`${table_name}-1`">{{ index }}</td>

    <td class="body-data grey-900" :class="`${table_name}-2`">{{ data.account_name }}</td>

    <td class="body-data grey-900" :class="`${table_name}-3`">{{ data.account_no }}</td>

    <td class="body-data grey-900 text-capitalize" :class="`${table_name}-4`">{{ data.bank_name }}</td>

    <td class="body-data" :class="`${table_name}-5`">
      <button class="btn btn-sm btn-secondary">View</button>
    </td>
  </tr>
</template>

<script>
export default {
  name: "UserNairaAccountRow",

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
};
</script>

<style lang="scss" scoped>
</style>