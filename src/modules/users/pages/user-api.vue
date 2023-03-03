<template>
  <div class="mgt-30">
    <div class="key-wrapper">
      <div class="key-loader skeleton-loader" v-if="loading || updating"></div>
      <div
        class="keys tertiary-2-text"
        :class="!isKeyLive ? 'keys--revoked' : ''"
        v-else
      >
        {{ getAPIKeys }}
      </div>

      <button
        class="btn btn-sm btn-secondary"
        :class="[copied && 'copied-btn']"
        @click="copyAPIkeys"
      >
        <span v-if="copied">Keys Copied!</span>

        <template v-else>
          <span class="mgr-4">
            <CopyIcon />
          </span>
          <span>Copy keys</span>
        </template>
      </button>
    </div>

    <div class="actions-row">
      <button
        class="btn btn-md btn-primary generate-key-btn"
        ref="generate"
        :disabled="loading || updating"
        @click="generateFreshKeys"
      >
        Generate API key
      </button>

      <button
        class="btn btn-md btn-alert generate-key-btn"
        ref="revoke"
        :disabled="loading || updating || !isKeyLive"
        @click="revokeKeys"
      >
        Revoke API key
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import CopyIcon from "@/shared/components/icon-comps/copy-icon";

export default {
  name: "userAPI",

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    CopyIcon,
  },

  computed: {
    ...mapGetters({ getUserProfile: "users/getUserProfile" }),

    getAPIKeys() {
      if (!this.getUserProfile?.user) return "";
      return this.getUserProfile?.user?.access_token?.public_key;
    },

    isKeyLive() {
      if (!this.getUserProfile?.user) return false;
      return this.getUserProfile?.user?.access_token?.is_live;
    },
  },

  data() {
    return {
      copied: false,
      updating: false,
    };
  },

  methods: {
    ...mapActions({
      generateUserAPIKey: "users/generateUserAPIKey",
      revokeUserAPIKey: "users/revokeUserAPIKey",
    }),

    async revokeKeys() {
      this.handleClick("revoke");
      this.updating = true;

      const payload = {
        account_id: this.$route?.params?.userID,
      };

      try {
        const response = await this.revokeUserAPIKey(payload);

        this.updating = false;

        this.handleClick("revoke", "Revoke API key", false);

        if ([201, 200].includes(response?.code)) {
          this.pushToast(response?.message || "Keys revoked", "success");
          this.$bus?.$emit("refresh_users");
        } else
          this.pushToast(
            response?.message || "Failed to revoke API keys",
            "warning"
          );
      } catch (err) {
        this.updating = false;
        this.pushToast("Failed to revoke API keys", "warning");
        console.log("FAILED TO REVOKE TOKEN", err);
      }
    },

    async generateFreshKeys() {
      this.handleClick("generate");
      this.updating = true;

      const payload = {
        account_id: this.$route?.params?.userID,
      };

      try {
        const response = await this.generateUserAPIKey(payload);

        this.updating = false;

        this.handleClick("generate", "Generate API key", false);

        if ([201, 200].includes(response?.code)) {
          this.pushToast(response?.message || "Keys generated", "success");
          this.$bus?.$emit("refresh_users");
        } else
          this.pushToast(response?.message || "Failed to generate API keys");
      } catch (err) {
        this.updating = false;
        this.handleClick("generate", "Generate API key", false);
        console.log("FAILED TO GENERATE TOKEN", err);
      }
    },

    async copyAPIkeys() {
      await navigator.clipboard.writeText(this.getAPIKeys);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2500);
    },
  },
};
</script>

<style lang="scss" scoped>
.key-wrapper {
  @include flex-row-start-nowrap;
  gap: toRem(16);
  margin-bottom: toRem(48);

  @include breakpoint-custom-down(787) {
    @include flex-row-start-wrap;
  }

  .keys {
    min-width: toRem(368);
    max-width: toRem(368);
    min-height: toRem(42);
    padding: toRem(12) toRem(16);
    border: toRem(1) dashed getColor("green-500");
    border-radius: toRem(12);
    background: getColor("green-10");
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    @include breakpoint-custom-down(787) {
      min-width: 100%;
      max-width: auto;
      width: 100%;
    }
  }

  .key-loader {
    width: toRem(350);
    height: toRem(42);
    border-radius: toRem(8);
  }

  .keys--revoked {
    filter: brightness(0.8);
    text-decoration: line-through;
  }

  .copied-btn {
    background-color: getColor("green-50") !important;
    border: toRem(1) dashed getColor("green-500");
    min-height: toRem(42);
    min-width: toRem(121.69);

    &:focus {
      background-color: getColor("green-50") !important;
    }
  }
}

.actions-row {
  @include flex-row-start-wrap;
  gap: toRem(20);
}

.generate-key-btn {
  @include breakpoint-custom-down(787) {
    width: 100%;
  }
}
</style>
