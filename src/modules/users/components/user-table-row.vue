<template>
  <tr>
    <td class="body-data grey-900" :class="`${table_name}-1`">{{ index }}</td>

    <td class="body-data grey-900" :class="`${table_name}-2`">{{ data.account_id }}</td>

    <td class="body-data grey-900" :class="`${table_name}-3`">{{ data.account_type }}</td>

    <td class="body-data grey-900" :class="`${table_name}-4`">{{ data.email }}</td>

    <td class="body-data grey-900" :class="`${table_name}-5`">{{ getName }}</td>

    <td class="body-data grey-900" :class="`${table_name}-6`">
      <TagCard :card_text="data.status" :card_type="data.status==='verified'?'success':'progress'" />
    </td>

    <td class="body-data" :class="`${table_name}-7`">
      <button class="btn btn-sm btn-secondary">View</button>
    </td>
  </tr>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";
export default {
  name: "UserTableRow",

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
    getName() {
      return `${this.data.first_name} ${this.data.last_name}`;
    },
  },
};
</script>

<style>
</style>