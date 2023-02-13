<template>
  <tr @click="$emit('view')">
    <td class="body-data" :class="`${table_name}-1`">
      <div class="text mgb-6 text-no-wrap">{{ '13434' || data.id }}</div>
    </td>

    <td class="body-data" :class="`${table_name}-2`">{{ '12th Mar 2019' || getCreatedDate }}</td>

    <td class="body-data" :class="`${table_name}-3`">
      <div class="text mgb-6 text-no-wrap">{{ 'Salimadeyemi@gmai.com' || data.email }}</div>
    </td>

    <td class="body-data" :class="`${table_name}-4`">
      <div class="text mgb-6 text-no-wrap">{{ 'Seller' || data.role }}</div>
    </td>

    <td class="body-data" :class="`${table_name}-5`">
      <div class="text mgb-6 text-no-wrap">
        {{ $money.getSign( 'naira' || data.currency)
        }}{{
        $money.addComma( data.totalAmount ? '4000' || data.totalAmount : '4000' || data.amount)
        }}
      </div>
    </td>

    <td class="body-data" :class="`${table_name}-6`">
      <div class="text mgb-6 text-no-wrap">{{'Card' || data.payment_mehtod }}</div>
    </td>

    <td class="body-data" :class="`${table_name}-7`">
      <TagCard :card_text="'Sucessfull'" :card_type="'success'" />
    </td>

    <td class="body-data" :class="`${table_name}-8`">
      <button class="btn btn-secondary btn-sm">View</button>
    </td>
  </tr>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";

export default {
  name: "DisbursementTableRow",

  components: {
    TagCard,
  },

  props: {
    table_name: {
      type: String,
      default: "",
    },

    data: {
      type: [Object, Number],
      default: () => ({}),
    },
  },

  computed: {
    getCreatedDate() {
      let first_milestone_date =
        `${
          this.data?.milestones[0]?.due_date.split(" ")[0] ?? "2022-01-01"
        } 00:00:00` ?? this.data?.due_date_formatted;

      let { d3, m4, y1 } = this.$date.formatDate(first_milestone_date).getAll();

      return `${d3} ${m4}, ${y1}`;
    },
  },

  data() {
    return {};
  },
};
</script>

<style>
</style>