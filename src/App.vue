<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>

    <!-- ALERT BANNER -->
    <AlertBanner
      v-if="show_alert"
      :message="alert.message"
      :status="alert.status"
    />

    <!-- FEATHER PAGE LOADER -->
    <transition name="fade" v-if="show_feather_loader">
      <PageLoader :message="feather_loader_msg" />
    </transition>

    <!-- VESICASH MODAL PORTAL TARGET -->
    <portal-target name="vesicash-modals"></portal-target>

    <div class="auth-banner" v-if="showAuthorizedAlert">
      <AlertIcon />
      <span class="secondary-1-text">
        Unauthorized access, login to gain access
      </span>

      <a class="btn btn-md btn-primary" href="/login">Login</a>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AlertIcon from "./shared/components/icon-comps/alert-icon.vue";
export default {
  name: "App",

  metaInfo: {
    title: "Escrow Payment service Nigeria Africa",
    titleTemplate: "Vesicash | %s",
    htmlAttrs: {
      lang: "en",
      amp: true,
    },
  },

  components: {
    AlertIcon,
    PageLoader: () =>
      import(
        /* webpackChunkName: "app-module" */ "@/shared/components/page-loader"
      ),

    AlertBanner: () =>
      import(
        /* webpackChunkName: "app-module" */ "@/shared/components/alert-banner"
      ),
  },

  watch: {
    $route: {
      handler() {
        this.show_feather_loader = false;
      },
    },
  },

  computed: {
    ...mapGetters({ getAuthorized: "general/getAuthorized" }),

    showAuthorizedAlert() {
      const routeName = this.$route?.name;
      return routeName !== "VesicashLogin" && !this.getAuthorized;
    },
  },

  data: () => ({
    show_feather_loader: false,
    feather_loader_msg: "",

    show_alert: false,
    alert: {
      status: "success",
      message: "Alert message here...",
    },
  }),

  async mounted() {
    await this.fetchPendingTransactionsCount();
    await this.fetchPendingMORVerifications();
  },

  created() {
    // EVENT BUS TO TOGGLE PAGE LOADER
    this.$bus.$on("toggle-page-loader", (message) => {
      this.show_feather_loader = !this.show_feather_loader;
      this.feather_loader_msg = message;
    });

    this.$bus.$on("show-page-loader", (message) => {
      this.show_feather_loader = true;
      this.feather_loader_msg = message;
    });

    this.$bus.$on("hide-page-loader", () => {
      this.show_feather_loader = false;
      this.feather_loader_msg = "";
    });

    // EVENT BUS TO TOGGLE ALERT BANNER
    this.$bus.$on("toggle-alert-banner", (data) => this.toggleAlert(data));

    this.$bus.$on("refresh_users", () => this.fetchPendingMORVerifications());
  },

  methods: {
    ...mapActions({
      fetchPendingTransactionsCount:
        "transaction/fetchPendingTransactionsCount",
      fetchPendingMORVerifications: "mor/fetchPendingMORVerifications",
    }),

    toggleAlert(data = {}) {
      Object.keys(data).length ? (this.alert = data) : null;
      this.show_alert = !this.show_alert;
    },
  },
};
</script>

<style lang="scss">
*,
html,
body {
  scroll-behavior: smooth !important;
}

.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 0.2s ease;
}
.fade-leave-active {
  transition: opacity 0.2s ease;
  opacity: 0;
}

.auth-banner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: toRem(15) toRem(60);
  background-color: getColor("neutral-10");
  z-index: 99;
  border-bottom: 1px solid black;
  display: grid;
  grid-template-columns: auto 1fr 150px;
  align-items: center;
  gap: 10px;

  @include breakpoint-down(lg) {
    padding: toRem(15) toRem(40);
  }
  @include breakpoint-down(md) {
    padding: toRem(15) toRem(30);
  }
  @include breakpoint-down(sm) {
    padding: toRem(15) toRem(15);
  }
}
</style>
