<template>
  <div class="sidebar neutral-10-bg">
    <!-- BRAND LOGO -->
    <router-link
      :to="{ name: 'VesicashDashboard' }"
      class="brand-logo mgb-40 d-block"
    >
      <VesicashBrandLogo />
    </router-link>

    <!-- SIDE NAV ITEMS -->
    <div class="sidebar-item-list">
      <SidebarItem
        v-for="(nav, index) in sidebar_routes"
        :key="index"
        :nav="nav"
        @toggleNavDropdown="toggleDropdown"
      />
    </div>

    <!-- LOG OUT ACCOUNT SECTION -->
    <div class="wrapper position-absolute wt-100">
      <ProfileMenu @exit="handleUserlogOut" />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import navRoutes from "@/shared/constants/nav-routes";
import VesicashBrandLogo from "@/shared/components/icon-comps/vesicash-brand-logo";
import SidebarItem from "@/shared/components/nav-comps/sidebar-item";
import ProfileMenu from "@/shared/components/nav-comps/profile-menu";

export default {
  name: "Sidebar",

  components: {
    VesicashBrandLogo,
    SidebarItem,
    ProfileMenu,
  },

  data() {
    return {
      sidebar_routes: navRoutes,
    };
  },

  methods: {
    ...mapActions({ logOutUser: "auth/logOutUser" }),

    handleUserlogOut() {
      this.togglePageLoader();
      setTimeout(() => this.logOutUser(), 2000);
    },

    toggleDropdown($event) {
      this.sidebar_routes.map((item) => {
        if (item.id !== $event.id) item.show_more = false;
        else {
          $event.show_more = !$event.show_more;
          !$event.children.length
            ? this.$router.push({ name: $event.link })
            : null;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  padding: toRem(22) toRem(16);
  @include stretch-area;
  min-height: 100%;
  position: relative;
  z-index: 4;
  border: 1px solid #e8e8e8;

  @include breakpoint-down(lg) {
    width: 60%;
  }

  @include breakpoint-down(sm) {
    width: 65%;
  }

  @include breakpoint-down(xs) {
    width: 75%;
  }

  .sidebar-item-list {
    overflow-y: auto;
    max-height: 85%;
    padding-bottom: toRem(60);
    &::-webkit-scrollbar {
      width: 0;
    }
  }

  .brand-logo {
    svg {
      width: toRem(146);
      height: auto;
    }
  }

  .wrapper {
    padding: 0 toRem(16);
    bottom: toRem(24);
    left: 0;

    .log-out-section {
      @include flex-row-start-nowrap;
      position: relative;
      padding: toRem(8);

      svg {
        margin-right: toRem(16);
      }

      &:hover {
        background: getColor("neutral-10");
      }
    }
  }
}
</style>
