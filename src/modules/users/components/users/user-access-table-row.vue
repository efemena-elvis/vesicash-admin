<template>
  <tr>
    <td class="body-data grey-900" :class="`${table_name}-1`">{{ index }}</td>

    <td class="body-data grey-900" :class="`${table_name}-2`">
      {{ data.access }}
    </td>

    <td class="body-data grey-900" :class="`${table_name}-3`">
      <TagCard
        :title="data.status"
        :card_text="data.status"
        :card_type="getStatus"
      />
    </td>

    <td class="body-data" :class="`${table_name}-4`">
      <button
        :class="[
          'btn btn-sm',
          data.status === 'Enabled' ? 'btn-alert' : 'btn-primary',
        ]"
        ref="update"
        @click="updateAccess"
      >
        {{ data.status === "Enabled" ? "Disable" : "Enable" }} {{ data.access }}
      </button>
    </td>
  </tr>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TagCard from "@/shared/components/card-comps/tag-card";

export default {
  name: "UserAccessTableRow",

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
    ...mapGetters({ getUserProfile: "users/getUserProfile" }),

    getStatus() {
      return this.data?.status === "Enabled" ? "success" : "error";
    },

    buttonText() {
      return this.data.status === "Enabled"
        ? `Disable ${this.data.access}`
        : `Enable ${this.data.access}`;
    },

    updatePayload() {
      const ACCESS_FIELDS = [
        {
          name: "Funding",
          slug: "funding",
          field: "can_fund",
        },
        {
          name: "Withdrawal",
          slug: "withdrawal",
          field: "can_make_withdrawal",
        },
        {
          name: "Escrow transaction",
          slug: "escrow",
          field: "is_escrow_enabled",
        },
        {
          name: "Fx transaction",
          slug: "fx-transfer",
          field: "can_exchange",
        },
        {
          name: "Mor transaction",
          slug: "mor-transaction",
          field: "is_mor_enabled",
        },
      ]?.filter((item) => item.slug !== this.data?.slug);

      const user = this.getUserProfile?.user || {};

      const rest = [...ACCESS_FIELDS].reduce((result, item) => {
        result[item.slug] = user[item.field] ? "enable" : "disable";
        return result;
      }, {});

      const status = this.data?.status === "Enabled" ? "disable" : "enable";
      const authStatus = this.data?.status !== "Enabled";
      const authField = this.data?.field;

      return {
        account_id: this.$route?.params?.userID,
        authStatus,
        authField,
        payload: {
          [this.data?.slug]: status,
          ...rest,
        },
      };
    },
  },

  data() {
    return {
      show_delete_user_modal: false,
    };
  },

  methods: {
    ...mapActions({ updateUserAccess: "users/updateUserAccess" }),

    async updateAccess() {
      this.handleClick("update");

      try {
        const response = await this.updateUserAccess(this.updatePayload);

        this.handleClick("update", this.buttonText, false);
        const type = response?.code === 200 ? "success" : "warning";
        this.pushToast(response?.message, type);
      } catch (err) {
        this.pushToast("FAILED TO UPDATE ACCESS", "error");
        this.handleClick("update", this.buttonText, false);
      }
    },

    toggleDeleteModal() {
      this.show_delete_user_modal = !this.show_delete_user_modal;
    },
  },
};
</script>

<style></style>
