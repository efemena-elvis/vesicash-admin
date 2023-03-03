<template>
  <div class="profile-container">
    <div class="meta-container">
      <div class="meta-block">
        <div class="grey-600 tertiary-3-text mgb-7">FIRST NAME</div>
        <div class="skeleton-loader" v-if="loading"></div>
        <div class="secondary-1-text mgb-10" v-else>
          {{ userDetails.firstname }}
        </div>
      </div>

      <div class="meta-block">
        <div class="grey-600 tertiary-3-text mgb-7">LAST NAME</div>
        <div class="skeleton-loader" v-if="loading"></div>
        <div class="secondary-1-text mgb-10" v-else>
          {{ userDetails.lastname }}
        </div>
      </div>

      <div class="meta-block">
        <div class="grey-600 tertiary-3-text mgb-7">DATE CREATED</div>
        <div class="skeleton-loader" v-if="loading"></div>
        <div class="secondary-1-text mgb-10" v-else>
          {{ userDetails.anniversary }}
        </div>
      </div>

      <div class="meta-block" v-if="isBusiness">
        <div class="grey-600 tertiary-3-text mgb-7">WEBSITE</div>
        <div class="skeleton-loader" v-if="loading"></div>
        <div class="secondary-1-text mgb-10" v-else>
          {{ userDetails.website }}
        </div>
      </div>

      <div class="meta-block" v-if="isBusiness">
        <div class="grey-600 tertiary-3-text mgb-7">OFFICE ADDRESS</div>
        <div class="skeleton-loader" v-if="loading"></div>
        <div class="secondary-1-text mgb-10">{{ userDetails.address }}</div>
      </div>

      <div class="meta-block">
        <div class="grey-600 tertiary-3-text mgb-7">PHONE NUMBER</div>
        <div class="skeleton-loader" v-if="loading"></div>
        <div class="d-flex align-items-start" v-else>
          <div class="secondary-1-text mgb-10 mgr-8">
            {{ userDetails.phone }}
          </div>
          <TagCard
            :card_text="isPhoneVerified ? 'Verified' : 'Pending'"
            :card_type="isPhoneVerified ? 'success' : 'progress'"
          />
        </div>
      </div>

      <div class="meta-block">
        <div class="grey-600 tertiary-3-text mgb-7">EMAIL ADDRESS</div>
        <div class="skeleton-loader" v-if="loading"></div>
        <div class="d-flex align-items-start" v-else>
          <div class="secondary-1-text mgb-10 mgr-8">
            {{ userDetails.email }}
          </div>
          <TagCard
            :card_text="isEmailVerified ? 'Verified' : 'Pending'"
            :card_type="isEmailVerified ? 'success' : 'progress'"
          />
        </div>
      </div>

      <div class="meta-block" v-if="isBusiness">
        <div class="grey-600 tertiary-3-text mgb-7">BIO</div>
        <div class="skeleton-loader" v-if="loading"></div>
        <div class="secondary-1-text mgb-10 mgr-8" v-else>
          {{ userDetails.bio }}
        </div>
      </div>
    </div>

    <button class="btn btn-md btn-alert" @click="toggleDeleteModal">
      Delete account
    </button>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_delete_user_modal">
        <DeletePromptModal
          @closeTriggered="toggleDeleteModal"
          :name="getName"
          @delete="removeUser"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import TagCard from "@/shared/components/card-comps/tag-card";
import DeletePromptModal from "@/modules/users/components/users/modals/delete-prompt-modal";
export default {
  name: "UserProfile",

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    TagCard,
    DeletePromptModal,
  },

  computed: {
    ...mapGetters({ getUserProfile: "users/getUserProfile" }),

    verifications() {
      return this.getUserProfile?.profile?.verifications?.length
        ? this.getUserProfile?.profile?.verifications
        : [];
    },

    isPhoneVerified() {
      return [...this.verifications].find(
        (item) => item.verification_type === "phone"
      )?.is_verified;
    },

    isEmailVerified() {
      return [...this.verifications].find(
        (item) => item.verification_type === "email"
      )?.is_verified;
    },

    getName() {
      return `${this.getUserProfile?.user?.firstname || ""} ${
        this.getUserProfile?.user?.lastname ||
        this.getUserProfile?.user?.email_address
      }`;
    },

    userAnniversary() {
      if (!this.getUserProfile?.user?.created_at) return "------";
      const anniversary = this.$date?.formatDate(
        new Date(this.getUserProfile?.user?.created_at),
        false
      );

      const day = anniversary.getDay("d3");
      const month = anniversary.getMonth("m4");
      const year = anniversary.getYear("y1");

      return `${day} ${month}, ${year}`;
    },

    userDetails() {
      return {
        firstname: this.getUserProfile?.user?.firstname || "-------",
        lastname: this.getUserProfile?.user?.lastname || "-------",
        anniversary: this.userAnniversary,
        website:
          this.getUserProfile?.profile?.business?.business_name || "--------",
        address:
          this.getUserProfile?.profile?.business?.business_address ||
          "--------",
        phone: this.getUserProfile?.user?.phone_number || "-------",
        email: this.getUserProfile?.user?.email_address || "-------",
        bio: this.getUserProfile?.profile?.business?.bio || "--------",
      };
    },

    isBusiness() {
      return this.getUserProfile?.user?.account_type === "business";
    },
  },

  data() {
    return {
      show_delete_user_modal: false,
    };
  },

  methods: {
    ...mapActions({ deleteUser: "users/deleteUser" }),

    toggleDeleteModal() {
      this.show_delete_user_modal = !this.show_delete_user_modal;
    },

    async removeUser() {
      this.show_delete_user_modal = false;

      this.$bus.$emit("show-page-loader", "Processing");

      const payload = {
        account_id: this.$route?.params?.userID,
      };

      try {
        const response = await this.deleteUser(payload);

        this.$bus.$emit("hide-page-loader");

        const type = response?.code === 200 ? "success" : "warning";

        const message =
          response?.code === 200
            ? response?.message
            : response?.message || "Failed to delete user";

        this.pushToast(message, type);

        if (response?.code === 200)
          this.$router?.push({ name: "VesicashManageUsers" });
      } catch (err) {
        console.log("ERROR DELETING USER", err);

        this.pushToast("Failed to delete user", "error");
        this.$bus.$emit("hide-page-loader");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.profile-container {
  padding: toRem(40) 0 toRem(100) 0;

  .meta-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: toRem(40) toRem(20);
    margin-bottom: toRem(70);

    .skeleton-loader {
      @include draw-shape(175, 30);
    }
  }
}
</style>
