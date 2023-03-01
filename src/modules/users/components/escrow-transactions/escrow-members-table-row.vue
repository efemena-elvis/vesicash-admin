<template>
  <tr>
    <td class="body-data grey-900" :class="`${table_name}-1`">{{ index }}</td>

    <td class="body-data grey-900" :class="`${table_name}-2`">{{ data.email }}</td>

    <td class="body-data grey-900" :class="`${table_name}-3`">{{ data.phone }}</td>

    <td class="body-data grey-900 text-capitalize" :class="`${table_name}-4`">{{ data.role }}</td>

    <td class="body-data grey-900" :class="`${table_name}-5`">{{ data.access }}</td>

    <td class="body-data grey-900" :class="`${table_name}-6`">{{ data.payout }}</td>

    <!-- <td class="body-data" :class="`${table_name}-7`">
        <button class="btn btn-sm btn-secondary">View</button>
    </td>-->
  </tr>
</template>

<script>
export default {
  name: "UserTableRow",

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