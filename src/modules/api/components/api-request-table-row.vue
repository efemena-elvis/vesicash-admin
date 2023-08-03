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

    <!-- <td class="body-data" :class="`${table_name}-4`">
      {{ getFormattedData.name }}
    </td> -->

    <!-- <td class="body-data" :class="`${table_name}-4`">
      {{ getFormattedData.email }}
    </td> -->

    <td class="body-data text-capitalize" :class="`${table_name}-4`">
      {{ getFormattedData.type }}
    </td>

    <td class="body-data" :class="`${table_name}-4`">
      <TagCard
        :title="getFormattedData.status"
        :card_text="getFormattedData.status"
        :card_type="getFormattedData.status | getStatusColor"
      />
    </td>

    <td class="body-data action-row" :class="`${table_name}-7`">
      <button
        class="btn btn-primary btn-sm d-inline-flex mgr-20"
        v-if="['pending', 'declined'].includes(data.status)"
        ref="approved"
        @click="updateRequest('approved')"
      >
        Approve
      </button>

      <button
        class="btn btn-alert btn-sm d-inline-flex"
        v-if="['pending', 'approved'].includes(data.status)"
        ref="declined"
        @click="updateRequest('declined')"
      >
        Reject
      </button>
    </td>
  </tr>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";
import { mapActions } from "vuex";
export default {
  name: "APIRequestTableRow",

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

  filters: {
    getStatusColor(status) {
      const status_colors = {
        pending: "progress",
        approved: "success",
        rejected: "error",
      };
      return status_colors[status?.toLowerCase()] || "error";
    },
  },

  computed: {
    getFormattedData() {
      const key_date = this.$date?.formatDate(
        new Date(this.data?.created_at),
        false
      );

      const date = key_date?.getSimpleFormatDate();

      const account_id = this.data?.account_id || "--------";

      const name = this.data?.user?.firstname
        ? `${this.data?.user?.firstname} ${this.data?.user?.lastname}`
        : "-------- ----------";
      const type = this.data?.feature;
      const status = this.data?.status;

      return {
        date,
        name,
        account_id,
        type,
        status,
      };
    },
  },

  data: () => ({}),

  methods: {
    ...mapActions({
      updateAPIRequests: "api/updateAPIRequests",
    }),

    async updateRequest(status = "approved") {
      const ref_text = status === "approved" ? "Approve" : "Reject";
      const message =
        status === "approved" ? "Request Approved" : "Request Declined";
      this.handleClick(status);

      const payload = {
        account_id: this.data?.account_id,
        id: this.data.id,
        status,
      };

      try {
        const response = await this.updateAPIRequests(payload);

        this.handleClick(status, ref_text, false);

        if ([201, 200].includes(response?.code) || response.status == "ok") {
          this.pushToast(message, "success");
          this.$emit("refresh");
        } else
          this.pushToast(
            response?.message || "Failed to update API request",
            "warning"
          );
      } catch (err) {
        this.handleClick(status, ref_text, false);
        this.pushToast("Failed to update API request", "warning");
        console.log("FAILED TO UPDATE REQUEST", err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
