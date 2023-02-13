<template>
  <div class="profile-container">
    <div class="meta-container">
      <div class="meta-block">
        <div class="grey-600 tertiary-3-text mgb-7">FIRST NAME</div>
        <div class="skeleton-loader" v-if="loading"></div>
        <div class="secondary-2-text mgb-10" v-else>{{ userDetails.firstname }}</div>
      </div>

      <div class="meta-block">
        <div class="grey-600 tertiary-3-text mgb-7">LAST NAME</div>
        <div class="skeleton-loader" v-if="loading"></div>
        <div class="secondary-2-text mgb-10" v-else>{{ userDetails.lastname }}</div>
      </div>

      <div class="meta-block">
        <div class="grey-600 tertiary-3-text mgb-7">DATE CREATED</div>
        <div class="skeleton-loader" v-if="loading"></div>
        <div class="secondary-2-text mgb-10" v-else>{{ userDetails.anniversary }}</div>
      </div>

      <div class="meta-block" v-if="isBusiness">
        <div class="grey-600 tertiary-3-text mgb-7">WEBSITE</div>
        <div class="skeleton-loader" v-if="loading"></div>
        <div class="secondary-2-text mgb-10" v-else>{{ userDetails.website }}</div>
      </div>

      <div class="meta-block" v-if="isBusiness">
        <div class="grey-600 tertiary-3-text mgb-7">OFFICE ADDRESS</div>
        <div class="skeleton-loader" v-if="loading"></div>
        <div class="secondary-2-text mgb-10">{{ userDetails.address }}</div>
      </div>

      <div class="meta-block">
        <div class="grey-600 tertiary-3-text mgb-7">PHONE NUMBER</div>
        <div class="skeleton-loader" v-if="loading"></div>
        <div class="d-flex align-items-start" v-else>
          <div class="secondary-2-text mgb-10 mgr-8">{{ userDetails.phone }}</div>
          <TagCard card_text="Verified" />
        </div>
      </div>

      <div class="meta-block">
        <div class="grey-600 tertiary-3-text mgb-7">EMAIL ADDRESS</div>
        <div class="skeleton-loader" v-if="loading"></div>
        <div class="d-flex align-items-start" v-else>
          <div class="secondary-2-text mgb-10 mgr-8">{{userDetails.email}}</div>
          <TagCard card_text="Pending" card_type="progress" />
        </div>
      </div>

      <div class="meta-block" v-if="isBusiness">
        <div class="grey-600 tertiary-3-text mgb-7">BIO</div>
        <div class="skeleton-loader" v-if="loading"></div>
        <div class="secondary-2-text mgb-10 mgr-8" v-else>{{ userDetails.bio }}</div>
      </div>
    </div>

    <button class="btn btn-md btn-alert">Delete account</button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TagCard from "@/shared/components/card-comps/tag-card";
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
  },

  computed: {
    ...mapGetters({ getUserProfile: "users/getUserProfile" }),

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