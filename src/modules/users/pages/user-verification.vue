<template>
  <div class="mgt-30 verification-container">
    <template v-if="loading">
      <div class="skeleton-loader"></div>
      <div class="skeleton-loader"></div>
    </template>

    <template v-else>
      <DetailsCard
        v-for="(verification, index) in userVerifications"
        :key="index"
        :metas="verification"
      />

      <DetailsCard :metas="docMetas">
        <div class="doc-actions" v-if="docType">
          <button class="btn btn-sm btn-alert" ref="reject" @click="rejectDoc">
            Reject
          </button>

          <button
            class="btn btn-sm btn-tertiary"
            :content="docContent"
            v-if="docMeta"
            @click="toggleMediaPreview"
          >
            View
          </button>

          <button
            class="btn btn-sm btn-primary"
            ref="approve"
            @click="approveDoc"
          >
            Approve
          </button>
        </div>
      </DetailsCard>
    </template>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade">
        <MediaPreviewBanner
          @close="toggleMediaPreview"
          v-if="preview_doc"
          :content="docContent"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DetailsCard from "@/shared/components/card-comps/details-card";
import MediaPreviewBanner from "@/shared/components/media-preview-banner";

export default {
  name: "UserVerification",

  components: {
    DetailsCard,
    MediaPreviewBanner,
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters({ getUserProfile: "users/getUserProfile" }),

    username() {
      return `${this.getUserProfile?.user?.firstname} ${this.getUserProfile?.user?.lastname}`;
    },

    docContent() {
      return {
        meta: this.docMeta,
        username: this.username,
        id: this.docID,
        type: this.docType,
      };
    },

    docMeta() {
      return this.docVerification?.verification_doc?.meta;
    },

    docID() {
      return this.docVerification?.verification_doc_id || "----------";
    },

    verifications() {
      return this.getUserProfile?.profile?.verifications?.length
        ? this.getUserProfile?.profile?.verifications
        : [];
    },

    phoneVerification() {
      return [...this.verifications].find(
        (item) => item.verification_type === "phone"
      );
    },

    emailVerification() {
      return [...this.verifications].find(
        (item) => item.verification_type === "email"
      );
    },

    bvnVerification() {
      return [...this.verifications].find(
        (item) => item.verification_type === "bvn"
      );
    },

    docVerification() {
      return [...this.verifications]
        ?.reverse()
        .find(
          (item) =>
            item.verification_doc_id ||
            this.doc_types?.includes(item?.verification_type)
        );
    },

    isDocVerified() {
      return [...this.verifications]
        .filter(
          (item) =>
            item.verification_doc_id ||
            this.doc_types?.includes(item?.verification_type)
        )
        .some((item) => item.is_verified);
    },

    docType() {
      return this.docVerification
        ? this.docVerification?.verification_type?.split("_").join(" ")
        : "";
    },

    docMetas() {
      return [
        {
          name: "DOCUMENT TYPE",
          value: this.docType || "----------",
        },
        {
          name: "STATUS",
          value: this.isDocVerified
            ? "Verified"
            : this.docType
            ? "Pending"
            : "Yet To upload",
          status: this.isDocVerified ? "success" : "progress",
        },
        {
          name: "DOCUMENT ID",
          value: this.docID,
        },
      ];
    },

    userVerifications() {
      return [
        [
          {
            name: "PHONE NUMBER",
            value: this.getUserProfile?.user?.phone_number || "----------",
          },

          {
            name: "STATUS",
            value: this.phoneVerification?.is_verified
              ? "Verified"
              : this.getUserProfile?.user?.phone_number
              ? "Pending"
              : "No phone",
            status: this.phoneVerification?.is_verified
              ? "success"
              : "progress",
          },
        ],
        [
          {
            name: "EMAIL ADDRESS",
            value: this.getUserProfile?.user?.email_address || "----------",
          },
          {
            name: "STATUS",
            value: this.emailVerification?.is_verified
              ? "Verified"
              : this.getUserProfile?.user?.email_address
              ? "Pending"
              : "No email",
            status: this.emailVerification?.is_verified
              ? "success"
              : "progress",
          },
        ],
        [
          {
            name: "BVN",
            value: "**********",
          },

          {
            name: "STATUS",
            value: this.bvnVerification?.is_verified ? "Verified" : "Pending",
            status: this.bvnVerification?.is_verified ? "success" : "progress",
          },
        ],
      ];
    },
  },

  data() {
    return {
      preview_doc: false,
      doc_types: [
        "cac",
        "passport",
        "drivers_license",
        "national_id",
        "bvn",
        "nin",
        "utilitybill",
      ],
    };
  },

  methods: {
    ...mapActions({
      approveUserDoc: "users/approveUserDoc",
      rejectUserDoc: "users/rejectUserDoc",
    }),

    toggleMediaPreview() {
      this.preview_doc = !this.preview_doc;
    },

    async approveDoc() {
      try {
        this.handleClick("approve");
        const payload = {
          business_id: this.$route?.params?.userID,
          verification_type: this.docVerification?.verification_type,
        };

        const response = await this.approveUserDoc(payload);

        this.handleClick("approve", "Approve", false);

        const type = response?.code === 200 ? "success" : "warning";

        const message =
          response?.code === 200
            ? response?.message
            : response?.message || "Failed to approve document";

        this.pushToast(message, type);

        if (response?.code === 200) this.$bus?.$emit("refresh_users");
      } catch (err) {
        console.log("ERROR APPROVING DOC", err);
        this.handleClick("approve", "Approve", false);
        this.pushToast("Failed to approve document", "error");
      }
    },

    async rejectDoc() {
      try {
        this.handleClick("reject");
        const payload = {
          business_id: this.$route?.params?.userID,
          verification_type: this.docVerification?.verification_type,
        };

        const response = await this.rejectUserDoc(payload);

        this.handleClick("reject", "Reject", false);

        const type = response?.code === 200 ? "success" : "warning";

        const message =
          response?.code === 200
            ? "Verification document rejected"
            : response?.message || "Failed to reject document";

        this.pushToast(message, type);

        if (response?.code === 200) {
          this.$emit("close");
          this.$bus?.$emit("refresh_users");
        }
      } catch (err) {
        console.log("ERROR REJECTING DOC", err);
        this.handleClick("reject", "Reject", false);
        this.pushToast("Failed to reject document", "error");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.verification-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(toRem(295), 1fr));
  gap: toRem(30) toRem(20);
  align-items: flex-start;

  .skeleton-loader {
    height: toRem(55);
  }

  .doc-actions {
    @include flex-row-end-nowrap;
    gap: toRem(12);

    .btn {
      max-height: toRem(35);

      .icon-spinner {
        font-size: toRem(12);
      }
    }
  }
}
</style>
