<template>
  <tr
    @click="
      $router.push('/users/manage-users/6705437381/verification?type=mor')
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
        :card_text="data.status === 'failed' ? 'Failed' : 'Completed'"
        :card_type="data.status === 'failed' ? 'error' : 'success'"
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
      //   const txn_date = this.$date?.formatDate(
      //     new Date(this.data?.created_at),
      //     false
      //   );

      //   const date = txn_date?.getSimpleFormatDate();

      //   const id = this.data?.uid || "---------";

      //   const email = this.data?.user?.email_address;

      //   const initial_currency = `${this.$money?.getSign(
      //     this.data?.rate?.from_currency
      //   )}${this.$money?.addComma(this.data?.initial_amount)}`;
      //   const final_currency = `${this.$money?.getSign(
      //     this.data?.rate?.to_currency
      //   )}${this.$money?.addComma(this.data?.final_amount)}`;

      return {
        account_id: "112450701",
        email: "adekunle@gmail.com",
        name: `Ajiboye Nathaniel`,
        status: "Passed",
      };
    },
  },
};
</script>

<style></style>
