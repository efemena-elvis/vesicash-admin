<template>
  <tr
    @click="
      $router.push(
        `/users/manage-users/${getFormattedData.account_id}/verification?type=mor`
      )
    "
  >
    <td class="body-data" :class="`${table_name}-1`">
      {{ index }}
    </td>

    <td class="body-data" :class="`${table_name}-2`">
      {{ getFormattedData.account_id }}
    </td>

    <td class="body-data text-no-wrap" :class="`${table_name}-3`">
      {{ getFormattedData.email }}
    </td>

    <td class="body-data" :class="`${table_name}-4`">
      {{ getFormattedData.name }}
    </td>

    <td class="body-data" :class="`${table_name}-8`">
      <TagCard
        :card_text="getFormattedData.status"
        :card_type="
          getFormattedData.status !== 'Verified' ? 'progress' : 'success'
        "
      />
    </td>

    <td class="body-data" :class="`${table_name}-7`">
      <button class="btn btn-secondary btn-sm">View</button>
    </td>
  </tr>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";

export default {
  name: "VerificationTableRow",

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
        new Date(this.data?.created_at),
        false
      );

      const date = txn_date?.getSimpleFormatDate();
      const account_id = this.data.account_id;
      const email = this.data.email;
      const status = this.data.is_verified ? "Verified" : "Pending";
      const name = this.data.full_name;

      return {
        date,
        account_id,
        email,
        name,
        status,
      };
    },
  },
};
</script>

<style></style>
