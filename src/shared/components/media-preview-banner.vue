<template>
  <div class="media-layout">
    <!-- TOP NAV -->
    <div class="preview-nav d-flex justify-content-between align-items-center">
      <div class="left-items d-flex align-items-center">
        <img v-if="false" alt="avatar" class="avatar-img" />

        <div
          v-else
          class="avatar-wrapper font-weight-600 neutral-10 tertiary-2-text teal-600-bg"
        >
          {{ $string.getStringInitials(content.username) }}
        </div>

        <div class="mgl-8">
          <div class="tertiary-2-text mb-1 font-weight-600 neutral-10">
            {{ content.username }}
          </div>
          <div
            class="color-grey-dark tertiary-3-text text-uppercase font-weight-500 neutral-10"
          >
            {{ `${content.type} - ${content.id}` }}
          </div>
        </div>
      </div>

      <div class="right-items d-flex align-items-center neutral-100">
        <button
          class="btn btn-sm btn-alert mgr-10"
          ref="reject"
          @click="rejectDoc"
        >
          Reject
        </button>
        <button
          class="btn btn-sm btn-primary mgr-20"
          ref="approve"
          @click="approveDoc"
        >
          Approve
        </button>
        <!-- <span
          title="Download"
          class="icon icon-caret-fill-down pointer"
          @click="downloadContent"
        ></span> -->

        <div class="divider pointer mx-2"></div>

        <span
          title="Close"
          class="icon icon-close pointer"
          @click="$emit('close')"
        ></span>
      </div>
    </div>

    <div class="content-wrapper pointer">
      <div class="doc-wrapper" v-if="isPdf">
        <pdf :src="test" :style="docViewStyles" />
      </div>

      <div class="image-wrapper" v-else>
        <img :src="content.meta" :alt="`${content.type} - Document`" />
      </div>

      <div class="doc-wrapper" v-if="isDoc && !isPdf">
        <VueDocPreview :style="docViewStyles" :url="test" type="office" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
// import VueDocPreview from "vue-doc-preview";
import pdf from "vue-pdf";

export default {
  name: "MediaPreview",

  components: {
    // VueDocPreview,
    pdf,
  },

  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    docViewStyles() {
      return {
        height: "100%",
        maxHeight: "100%",
        width: "100%",
        maxWidth: "100%",
        margin: "auto",
      };
    },

    isImage() {
      return true;
    },

    isPdf() {
      // return false;
      return true || this.content?.meta?.split(".")[1] === "pdf";
    },

    isDoc() {
      return false;
    },
  },

  data() {
    return {
      test: "https://cdn.pixabay.com/photo/2023/02/04/09/20/castle-7766794_640.jpg",
      // test: "https://gradly.s3.eu-west-2.amazonaws.com/dev/files/test/zceojwqfdcffqrrunjhxpppmveleie9qf40kddwqksj7i90w10.pdf",
    };
  },

  methods: {
    ...mapActions({
      approveUserDoc: "users/approveUserDoc",
      rejectUserDoc: "users/rejectUserDoc",
    }),

    async approveDoc() {
      try {
        this.handleClick("approve");
        const payload = {
          business_id: this.$route?.params?.userID,
          verification_type: this.content?.type,
        };

        const response = await this.approveUserDoc(payload);

        this.handleClick("approve", "Approve", false);

        const type = response?.code === 200 ? "success" : "warning";

        const message =
          response?.code === 200
            ? response?.message
            : response?.message || "Failed to approve document";

        this.pushToast(message, type);

        if (response?.code === 200) {
          this.$emit("close");
          this.$bus?.$emit("refresh_users");
        }
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
          verification_type: this.content?.type,
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

    downloadContent() {
      let link = document.createElement("a");
      link.setAttribute("href", this.content?.meta);
      link.setAttribute(
        "download",
        `${this.content?.username} ${this.content?.type} document`
      );
      link.click();
    },
  },
};
</script>

<style lang="scss" scoped>
.media-layout {
  width: 100%;
  min-height: calc(100% + 65px);
  max-width: 100%;
  position: fixed;
  inset: 0;
  background: rgba(#000000, 0.85);
  z-index: 10;
}

.preview-nav {
  background: #000;
  padding: toRem(12) toRem(32);

  @include breakpoint-down(sm) {
    padding: toRem(12) toRem(12);
  }

  .avatar-wrapper {
    @include flex-row-center-wrap;
    @include draw-shape(35);
    margin-right: toRem(10);
    border-radius: toRem(5);

    @include breakpoint-down(sm) {
      display: none;
    }
  }

  .avatar-img {
    @include draw-shape(30);
    border-radius: toRem(5);
    object-fit: cover;
    margin-right: toRem(10);

    @include breakpoint-down(sm) {
      display: none;
    }
  }

  .divider {
    width: 1px;
    background: getColor("neutral-200");
    height: 25px;
  }
}

.right-items {
  gap: 0 5px;

  @include breakpoint-down(xs) {
    gap: 0 25px;
  }

  .btn {
    max-height: toRem(35);

    .icon-spinner {
      font-size: toRem(12);
    }
  }

  .icon {
    font-size: toRem(25);
    transition: all ease-in-out 0.25s;
    &:hover {
      transform: scale(1.15);
    }
  }

  .icon-caret-fill-down {
    @include draw-shape(22);
    @include flex-column-center;
    border: toRem(1.5) solid getColor("neutral-50");
    border-radius: 100%;

    &::before {
      position: relative;
      left: -0.4px;
      top: 0.7px;
    }
  }

  .icon-share {
    &:hover {
      color: getColor("teal-500");
    }
  }

  .icon-close {
    &:hover {
      color: getColor("red-600");
    }
  }
}

.content-wrapper {
  position: relative;
  width: 800px;
  max-width: 95%;
  height: calc(100% - 150px);
  max-height: calc(100% - 150px);
  top: -0px;
  margin: auto;
  @include flex-column-center;

  .image-wrapper {
    max-height: 100%;
    max-width: 100%;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
    }
  }

  .doc-wrapper {
    max-width: 100%;
    max-height: 100%;
    position: relative;
    top: -35px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 3px;
    }
  }
}
</style>
