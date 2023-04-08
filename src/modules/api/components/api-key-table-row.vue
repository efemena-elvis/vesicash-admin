<template>
  <tr>
    <td class="body-data" :class="`${table_name}-1`">
      {{ index }}
    </td>

    <td class="body-data" :class="`${table_name}-2`">
      {{ getFormattedData.date }}
    </td>

    <td class="body-data text-no-wrap" :class="`${table_name}-3`">
      {{ getFormattedData.account_id }}
    </td>

    <td class="body-data" :class="`${table_name}-4`">
      {{ getFormattedData.name }}
    </td>

    <td
      class="body-data text-no-wrap"
      :class="`${table_name}-5 ${getFormattedData.live ? '' : 'revoked'}`"
      :title="
        getFormattedData.live ? getFormattedData.public_key : 'Revoked key'
      "
    >
      {{ getFormattedData.public_key }}
    </td>

    <td
      class="body-data"
      :class="`${table_name}-6 ${getFormattedData.live ? '' : 'revoked'}`"
      :title="
        getFormattedData.live ? getFormattedData.private_key : 'Revoked key'
      "
    >
      {{ getFormattedData.private_key }}
    </td>

    <td class="body-data action-row" :class="`${table_name}-7`">
      <button
        class="btn btn-secondary btn-sm d-inline-flex"
        @click="copyKeys('public_key')"
      >
        {{ copied.public_key ? "Copied" : "Copy public key" }}
      </button>

      <button
        class="btn btn-secondary btn-sm d-inline-flex mgx-15"
        @click="copyKeys('private_key')"
      >
        {{ copied.private_key ? "Copied" : "Copy private key" }}
      </button>

      <button
        class="btn btn-alert btn-sm d-inline-flex"
        v-if="getFormattedData.live"
        ref="revoke"
        @click="revokeKeys"
      >
        Revoke
      </button>

      <button
        class="btn btn-primary btn-sm d-inline-flex"
        ref="generate"
        v-else
        @click="generateFreshKeys"
      >
        Generate
      </button>
    </td>
  </tr>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "APITableRow",

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
      const key_date = this.$date?.formatDate(
        new Date(this.data?.created_at),
        false
      );

      const date = key_date?.getSimpleFormatDate();

      const account_id = this.data?.user?.account_id || "--------";

      const name = this.data?.user?.firstname
        ? `${this.data?.user?.firstname} ${this.data?.user?.lastname}`
        : "-------- ----------";

      const public_key = this.data?.public_key || "-----------";

      const private_key = this.data?.private_key || "-----------";

      const live = this.data?.is_live;

      return {
        date,
        name,
        account_id,
        public_key,
        private_key,
        live,
      };
    },
  },

  data: () => ({
    show_transaction_summary_modal: false,
    updating: false,

    copied: {
      public_key: false,
      private_key: false,
    },
  }),

  methods: {
    ...mapActions({
      generateUserAPIKey: "users/generateUserAPIKey",
      revokeUserAPIKey: "users/revokeUserAPIKey",
    }),

    async copyKeys(type) {
      this.copied[type] = true;
      await navigator.clipboard.writeText(this.getFormattedData[type]);
      setTimeout(() => {
        this.copied[type] = false;
      }, 2000);
    },

    async revokeKeys() {
      this.handleClick("revoke");
      this.updating = true;

      const payload = {
        account_id: this.data?.account_id,
      };

      try {
        const response = await this.revokeUserAPIKey(payload);

        this.updating = false;

        this.handleClick("revoke", "Revoke", false);

        if ([201, 200].includes(response?.code)) {
          this.pushToast(response?.message || "Keys revoked", "success");
          this.$emit("refresh");
        } else
          this.pushToast(
            response?.message || "Failed to revoke API keys",
            "warning"
          );
      } catch (err) {
        this.updating = false;
        this.handleClick("revoke", "Revoke", false);
        this.pushToast("Failed to revoke API keys", "warning");
        console.log("FAILED TO REVOKE TOKEN", err);
      }
    },

    async generateFreshKeys() {
      this.handleClick("generate");
      this.updating = true;

      const payload = {
        account_id: this.data?.account_id,
      };

      try {
        const response = await this.generateUserAPIKey(payload);

        this.updating = false;

        this.handleClick("generate", "Generate", false);

        if ([201, 200].includes(response?.code)) {
          this.pushToast(response?.message || "Keys generated", "success");
          this.$emit("refresh");
        } else
          this.pushToast(response?.message || "Failed to generate API keys");
      } catch (err) {
        this.updating = false;
        this.handleClick("generate", "Generate", false);
        console.log("FAILED TO GENERATE TOKEN", err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.revoked {
  text-decoration: line-through;
  opacity: 0.4;
}

.action-row {
  .btn-secondary {
    min-width: toRem(124.6);
  }
}
</style>

<style lang="scss">
.action-row {
  .btn {
    .f-size-19 {
      font-size: 0.95rem;
    }
  }
}
</style>
