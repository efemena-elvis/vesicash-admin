<template>
  <router-link
    :to="`/users/manage-users/${data.account_id}/profile${usersFilter}`"
    v-slot="{ navigate }"
    custom
  >
    <tr @click="navigate">
      <td class="body-data grey-900 text-capitalize" :class="`${table_name}-1`">
        {{ index }}
      </td>

      <td class="body-data grey-900" :class="`${table_name}-2`">
        {{ data.account_id }}
      </td>

      <td class="body-data grey-900 text-capitalize" :class="`${table_name}-3`">
        {{ data.account_type || "--------" }}
      </td>

      <td class="body-data grey-900" :class="`${table_name}-4`">
        {{ data.email_address }}
      </td>

      <td class="body-data grey-900" :class="`${table_name}-5`">
        {{ getName }}
      </td>

      <td class="body-data grey-900" :class="`${table_name}-6`">
        <TagCard
          :card_text="isVerified ? 'verified' : 'pending'"
          :card_type="isVerified ? 'success' : 'progress'"
        />
      </td>

      <td class="body-data" :class="`${table_name}-7`">
        <button class="btn btn-sm btn-secondary">View</button>
      </td>
    </tr>
  </router-link>
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
      return `${
        this.data?.firstname || this.data?.username || this.data?.email_address
      } ${this.data?.lastname || ""}`;
    },

    isVerified() {
      const verifications = this.data?.is_verified || [];
      return ["email", "cac", "bvn"].every((type) => {
        return verifications?.find((item) => item.verification_type === type)
          ?.is_verified;
      });
    },

    usersFilter() {
      const filter = location.search
        ? decodeURIComponent(location.search)?.split("?")[1]
        : "";
      return filter
        ? `?name=${decodeURIComponent(this.getName.trim())}&${filter}`
        : `?name=${decodeURIComponent(this.getName.trim())}`;
    },
  },
};
</script>

<style lang="scss" scoped></style>
