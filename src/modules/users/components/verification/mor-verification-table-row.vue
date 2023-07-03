<template>
  <tr @click="toggleMediaPreview">
    <td class="body-data grey-900" :class="`${table_name}-0`">{{ index }}</td>

    <td class="body-data grey-900" :class="`${table_name}-1`">
      {{ data.country_name }}
    </td>

    <!-- <td class="body-data grey-900" :class="`${table_name}-2`">
      {{ "MordocforGhana.pdf" || data.document }}
    </td> -->

    <td class="body-data" :class="`${table_name}-3`">
      <TagCard
        :card_text="data.status === 'approved' ? 'Verified' : 'Pending'"
        :card_type="data.status === 'approved' ? 'success' : 'progress'"
      />
    </td>

    <td class="body-data" :class="`${table_name}-4`">
      <button class="btn btn-sm btn-secondary d-inline-flex">
        <span class="secondary-3-text grey-900">View</span>
      </button>
      <!-- <button class="btn btn-sm btn-primary d-inline-flex mgx-20">
        <span class="secondary-3-text grey-900">Approve</span>
      </button>
      <button class="btn btn-sm btn-alert d-inline-flex">
        <span class="secondary-3-text grey-900">Reject</span>
      </button> -->
    </td>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="preview_doc">
        <MediaPreviewBanner @close="toggleMediaPreview" :content="docContent" />
      </transition>
    </portal>
  </tr>
</template>

<script>
import MediaPreviewBanner from "@/shared/components/media-preview-banner";
import TagCard from "@/shared/components/card-comps/tag-card";
export default {
  name: "MORVerificationTableRow",

  components: {
    MediaPreviewBanner,
    TagCard,
  },

  props: {
    table_name: {
      type: String,
      default: "",
    },

    username: {
      type: String,
      default: "",
    },

    user: {
      type: Object,
      default: () => null,
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
    docContent() {
      return {
        meta:
          "https://cdn.pixabay.com/photo/2017/12/24/21/08/secret-3037639_1280.jpg" ||
          this.data?.document_url,
        username: this.user?.full_name || "MOR Merchant",
        id: `${this.data?.country_name}`,
        type: "MOR Document",
        country_id: this.data?.country_id,
        account_id: this.user?.account_id,
        mor: true,
      };
    },
  },

  data() {
    return {
      preview_doc: false,
      //   test_doc:
      //     "https://cdn.pixabay.com/photo/2023/02/04/09/20/castle-7766794_640.jpg",
      test_doc:
        "https://gradly.s3.eu-west-2.amazonaws.com/dev/files/test/zceojwqfdcffqrrunjhxpppmveleie9qf40kddwqksj7i90w10.pdf",
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
