<template>
  <tr @click="togglePreview">
    <td class="body-data" :class="`${table_name}-1`">
      <div class="text mgb-6 text-no-wrap">{{ index }}</div>
    </td>

    <td class="body-data" :class="`${table_name}-2`">
      <div class="text mgb-6 text-no-wrap">{{ data.date }}</div>
    </td>

    <td class="body-data" :class="`${table_name}-3`" :title="data.reference">
      {{ data.reference }}
    </td>

    <td class="body-data text-capitalize" :class="`${table_name}-4`">
      {{ data.account_name }}
    </td>

    <td class="body-data text-capitalize" :class="`${table_name}-5`">
      {{ data.account_number }}
    </td>

    <td class="body-data" :class="`${table_name}-6`">
      {{ data.amount }}
    </td>

    <td class="body-data" :class="`${table_name}-7`">
      <TagCard
        :title="data.status"
        :card_text="data.status"
        :card_type="
          data.status === 'failed'
            ? 'error'
            : data.status === 'pending'
            ? 'progress'
            : 'success'
        "
      />
    </td>

    <td class="body-data" :class="`${table_name}-7`">
      <button class="btn btn-secondary btn-sm">View</button>
    </td>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_preview">
        <MediaPreviewBanner :content="docContent" @close="togglePreview">
          <button
            class="btn btn-sm btn-primary"
            ref="Approve"
            @click="updatePayment(true)"
          >
            Approve
          </button>
          <button
            class="btn btn-sm btn-alert"
            ref="Reject"
            @click="updatePayment(false)"
          >
            Decline
          </button>
        </MediaPreviewBanner>
      </transition>
    </portal>
  </tr>
</template>

<script>
import { mapActions } from "vuex";
import TagCard from "@/shared/components/card-comps/tag-card";
import MediaPreviewBanner from "../../../shared/components/media-preview-banner.vue";

export default {
  name: "PendingWireTransferTableRow",

  components: {
    TagCard,
    MediaPreviewBanner,
  },

  props: {
    table_name: {
      type: String,
      default: "",
    },

    index: {
      type: [Number, String],
      default: 1,
    },

    data: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    docContent() {
      return {
        meta: [this.data.receipt_url],
        username: this.data.account_name,
        id: this.data.reference,
        setting_id: this.data.reference,
        type: "Wire Transfer",
        country_id: this.data?.currency,
        account_id: this.data.account_number,
        mor: false,
        approved: this.status === "successful",
      };
    },
  },

  data() {
    return {
      show_preview: false,
    };
  },

  methods: {
    ...mapActions({
      updateWirePayment: "transaction/updateWirePayment",
    }),

    togglePreview() {
      this.show_preview = !this.show_preview;
    },

    async updatePayment(approve = true) {
      const button = approve ? "Approve" : "Reject";

      try {
        this.handleClick(button);

        const payload = {
          ref: this.data.reference,
          action: approve ? "completed" : "failed",
        };

        const response = await this.updateWirePayment(payload);

        this.handleClick(button, button, false);

        const type = [200, 201].includes(response?.code)
          ? "success"
          : "warning";

        const message = response?.message;

        this.pushToast(message, type);

        if ([200, 201].includes(response?.code)) {
          this.$emit("refresh");
        }
      } catch (err) {
        console.log("ERROR DOC", err);
        this.handleClick(button, button, false);
        this.pushToast("Failed", "error");
      }
    },
  },
};
</script>

<style></style>
