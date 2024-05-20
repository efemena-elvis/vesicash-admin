<template>
  <tr>
    <td class="body-data" :class="`${table_name}-1`">
      {{ index }}
    </td>

    <td class="body-data" :class="`${table_name}-2`">
      {{ getFormattedData.account_id }}
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
      <button class="btn btn-secondary btn-sm" @click="toggleMediaPreview">
        View
      </button>
    </td>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="preview_doc">
        <MediaPreviewBanner
          @close="toggleMediaPreview"
          :content="docContent"
          type="business"
        />
      </transition>
    </portal>
  </tr>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";
import MediaPreviewBanner from "@/shared/components/media-preview-banner";

export default {
  name: "BusinessVerificationTableRow",

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
        new Date(this.data?.verification?.created_at),
        false
      );

      const date = txn_date?.getSimpleFormatDate();
      const account_id = this.data?.verification?.account_id;
      const email = "";
      const status = this.data?.verification?.is_verified
        ? "Verified"
        : "Pending";
      const name = this.data.verification_doc?.business_extra?.business_name;

      return {
        date,
        account_id,
        email,
        name,
        status,
      };
    },

    docContent() {
      const approved = this.data?.verification?.is_verified;
      const { drivers_license, id_card } =
        this.data.verification_doc?.business_extra;
      return {
        meta: [drivers_license, id_card],
        username:
          this.data.verification_doc?.business_extra?.business_name ||
          "MOR Merchant",
        id: this.data?.verification?.id,
        setting_id: this.data?.verification?.id,
        type: "Verification ID",
        country_id: "",
        account_id: this.data?.verification?.account_id,
        mor: false,
        approved,
      };
    },
  },

  data() {
    return {
      preview_doc: false,
    };
  },

  methods: {
    toggleMediaPreview() {
      this.preview_doc = !this.preview_doc;
    },
  },
};
</script>

<style></style>
