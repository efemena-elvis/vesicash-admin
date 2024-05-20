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
        <template v-if="!content.approved">
          <button
            class="btn btn-sm btn-alert mgr-10"
            ref="Reject"
            @click="
              content.mor
                ? updateMORDoc(false)
                : type === 'business'
                ? approveBusiness('reject')
                : rejectDoc
            "
          >
            Reject
          </button>

          <button
            class="btn btn-sm btn-primary mgr-20"
            ref="Approve"
            @click="
              content.mor
                ? updateMORDoc(true)
                : type === 'business'
                ? approveBusiness('accept')
                : approveDoc
            "
          >
            Approve
          </button>
        </template>

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
        <pdf :src="content.meta[active_meta_index]" :style="docViewStyles" />
      </div>

      <div class="image-wrapper" v-else>
        <img
          :src="meta"
          :alt="`${content.type} - Document`"
          v-for="(meta, index) in content.meta"
          :key="meta + index"
          :class="index === active_meta_index ? 'hidden-meta' : 'active-meta'"
        />
        <div class="control" v-if="content.meta?.length > 1">
          <span class="icon icon-caret-left" @click="navigate(-1)"></span>
          <span class="icon icon-caret-right" @click="navigate(1)"></span>
        </div>
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
    type: {
      type: String,
      default: "",
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
      return !this.isPdf;
    },

    isPdf() {
      // return false;
      return (
        this.fileType(this.content?.meta?.[this.active_meta_index]) === "pdf"
      );
    },

    isDoc() {
      return false;
    },
  },

  data() {
    return {
      active_meta_index: 0,
      test: "https://cdn.pixabay.com/photo/2023/02/04/09/20/castle-7766794_640.jpg",
      // test: "https://gradly.s3.eu-west-2.amazonaws.com/dev/files/test/zceojwqfdcffqrrunjhxpppmveleie9qf40kddwqksj7i90w10.pdf",
    };
  },

  methods: {
    ...mapActions({
      approveUserDoc: "users/approveUserDoc",
      rejectUserDoc: "users/rejectUserDoc",
      approveMORDoc: "mor/approveMORDoc",
      approveBusinessDoc: "mor/approveBusinessDoc",
    }),

    fileType(url) {
      const filename = url.substring(url.lastIndexOf("/") + 1);
      const extension = filename.substring(filename.lastIndexOf(".") + 1);
      return extension;
    },

    async approveBusiness(action) {
      const button = action === "accept" ? "Approve" : "Reject";
      const id = this.content?.id;

      const payload = {
        action,
        id,
      };

      try {
        this.handleClick(button);
        const response = await this.approveBusinessDoc(payload);

        this.handleClick(button, button, false);

        const type = [200, 201].includes(response?.code)
          ? "success"
          : "warning";

        const message = response?.message;

        this.pushToast(message, type);

        if ([200, 201].includes(response?.code)) {
          this.$emit("close");
          this.$bus?.$emit("refresh_business");
        }
      } catch (err) {
        console.log("ERROR APPROVING DOC", err);
        this.handleClick(button, button, false);
        this.pushToast("Failed", "error");
      }
    },

    async updateMORDoc(approve = true) {
      const button = approve ? "Approve" : "Reject";

      try {
        this.handleClick(button);

        const details = {
          payload: {
            country_id: this.content?.country_id,
            status: approve ? "verified" : "not_verified",
          },
          id: this.content?.setting_id,
        };

        const response = await this.approveMORDoc(details);

        this.handleClick(button, button, false);

        const type = [200, 201].includes(response?.code)
          ? "success"
          : "warning";

        const message = response?.message;

        this.pushToast(message, type);

        if ([200, 201].includes(response?.code)) {
          this.$emit("close");
          this.$bus?.$emit("refresh_users");
        }
      } catch (err) {
        console.log("ERROR DOC", err);
        this.handleClick(button, button, false);
        this.pushToast("Failed", "error");
      }
    },

    async approveDoc() {
      try {
        this.handleClick("Approve");
        const payload = {
          business_id: this.$route?.params?.userID,
          verification_type: this.content?.type,
        };

        const response = await this.approveUserDoc(payload);

        this.handleClick("Approve", "Approve", false);

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
        this.handleClick("Approve", "Approve", false);
        this.pushToast("Failed to approve document", "error");
      }
    },

    async rejectDoc() {
      try {
        this.handleClick("Reject");
        const payload = {
          business_id: this.$route?.params?.userID,
          verification_type: this.content?.type,
        };

        const response = await this.rejectUserDoc(payload);

        this.handleClick("Reject", "Reject", false);

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
        this.handleClick("Reject", "Reject", false);
        this.pushToast("Failed to reject document", "error");
      }
    },

    downloadContent() {
      let link = document.createElement("a");
      link.setAttribute("href", this.content?.meta?.[this.active_meta_index]);
      link.setAttribute(
        "download",
        `${this.content?.username} ${this.content?.type} document`
      );
      link.click();
    },

    navigate(direction) {
      if (direction < 0 && this.active_meta_index > 0) {
        this.active_meta_index--;
        console.log(this.active_meta_index);
      }
      if (
        direction > 0 &&
        this.active_meta_index < this.content?.meta?.length - 1
      ) {
        this.active_meta_index++;
      }
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
    position: relative;

    img {
      max-width: 95%;
      max-height: 95%;
      object-fit: cover;
    }

    img.hidden-meta {
      opacity: 0;
      position: absolute;
    }

    img.active-meta {
      opacity: 1;
    }

    .control {
      position: absolute;
      bottom: -10px;
      @include flex-row-center-nowrap;
      width: 100%;
      font-size: 2.5rem;
      color: getColor("grey-400");
      gap: 0 toRem(15);

      .icon {
        transition: transform ease 0.2s;
        &:hover {
          transform: scale(1.06);
        }
      }
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
