<template>
  <div class="nav-wrapper" :class="isActive && 'nav-wrapper-active'">
    <!-- ROUTE WITH CHILDREN -->
    <template v-if="nav.children.length">
      <router-link
        v-if="checkAuthorizedRoute"
        to
        class="nav-item-row"
        @click.native="$emit('toggleNavDropdown', nav)"
      >
        <!-- ICON COMPONENT -->
        <div class="icon">
          <component :is="nav.icon" />
        </div>

        <div class="nav-text">{{ nav.title }}</div>

        <!-- CARET -->
        <div class="caret">
          <div
            class="icon icon-caret-left f-size-28"
            :class="nav.show_more ? 'rotate-180' : null"
          ></div>
        </div>
      </router-link>
    </template>

    <!-- ROUTE WITHOUT CHILDREN -->
    <template v-else>
      <router-link
        v-if="checkAuthorizedRoute"
        :to="nav.link"
        class="nav-item-row"
      >
        <div class="icon">
          <component :is="nav.icon" />
        </div>
        <div class="nav-text">{{ nav.title }}</div>
        <div
          class="indicator"
          v-if="nav.title === 'Payments' && getPendingCount"
        >
          <span>{{ getPendingCount }}</span>
        </div>
      </router-link>
    </template>

    <!-- CHILDREN LIST -->
    <div class="inner-wrapper" v-if="nav.show_more">
      <div class="spacer"></div>

      <div class="wrapper">
        <router-link
          :to="item.link"
          class="nav-item-row nav-sub-row smooth-transition"
          :class="path_list.includes(item.slug) && 'active-sub-row'"
          v-for="(item, index) in nav.children"
          :key="index"
        >
          <div class="text-row">
            <div class="bullet smooth-transition mgr-8 rounded-circle"></div>

            <div
              class="nav-text"
              :class="!path_list.includes(item.slug) && 'inactive-text'"
            >
              {{ item.title }}
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "SidebarItem",

  components: {
    DashboardIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/dashboard-icon"
      ),
    UserIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/user-icon"
      ),
    PaymentIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/payment-icon"
      ),
    CreditCardIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/credit-card-icon"
      ),
    VerificationIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/verification-icon"
      ),
    TransactionIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/transaction-icon"
      ),
    ExchangeIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/exchange-icon"
      ),
    SettingsIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/settings-icon"
      ),
    FileIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/file-icon"
      ),
  },

  props: {
    nav: {
      type: Object,
      default: () => ({
        title: "Dashboard",
        icon: "DashboardIcon",
        link: "/dashboard",
        show_more: false,
        children: [],
        authorize: ["open"],
      }),
    },
  },

  computed: {
    ...mapGetters({ getPendingCount: "transaction/getPendingCount" }),

    isActive() {
      return this.path_list.includes(this.nav.slug) ? true : false;
    },

    // isChildLinkActive() {
    //   let child_routes = [];
    //   let current_route = this.$route.name;
    //   this.nav.children.map((item) => child_routes.push(item.link));

    //   return child_routes.includes(current_route) ||
    //     this.nav.link === current_route
    //     ? true
    //     : false;
    // },

    // CHECK IF CURRENT ROUTE ON LIST IS AUTHORIZED
    checkAuthorizedRoute() {
      return this.nav.authorize.includes(this?.getAuthType) ||
        this.nav.authorize.includes("open")
        ? true
        : false;
    },
  },

  watch: {
    $route: {
      handler(value) {
        this.path_list = value.path.split("/");
      },
      immediate: true,
    },
  },

  data: () => ({
    path_list: [],
  }),
};
</script>

<style lang="scss">
%active-side-bar-state {
  background: getColor("teal-50");

  .nav-item-row {
    position: relative;
    .nav-text {
      color: getColor("teal-800");
    }

    svg {
      .light-theme {
        fill: getColor("teal-200") !important;
      }

      .dark-theme {
        fill: getColor("teal-800") !important;
      }
    }
  }
}

.nav-wrapper {
  margin-bottom: toRem(12);
  @include transition(0.4s);
  position: relative;

  .nav-item-row {
    @include generate-font-type("secondary-2");
    @include flex-row-start-nowrap;
    @include transition(0.3s);
    color: getColor("grey-600");
    align-items: center;
    position: relative;
    padding: toRem(8);
    text-align: left;

    &:last-of-type {
      margin-bottom: 0;
    }

    .indicator {
      position: absolute;
      @include center-placement("y-axis");
      right: toRem(10);
      @include draw-shape(20);
      @include flex-column-center;
      border-radius: 50%;
      background: getColor("green-500");
      color: getColor("neutral-10");
      font-size: toRem(11);
      animation: blink 1.5s infinite;
      animation-fill-mode: both;
    }

    svg {
      margin-right: toRem(12);
      min-width: toRem(35);
      max-width: toRem(35);

      .light-theme {
        @include transition(0.325s);
        fill: getColor("grey-300");
      }

      .dark-theme {
        @include transition(0.325s);
        fill: getColor("grey-500");
      }
    }

    .caret {
      @include center-placement("y-axis");
      transform: translateY(-50%) rotate(-90deg);
      right: toRem(6);

      .icon {
        @include transition(0.2s);
      }
    }
  }

  &:hover {
    @extend %active-side-bar-state;
  }

  &-active {
    @extend %active-side-bar-state;
  }

  .inner-wrapper {
    @include flex-row-start-nowrap;
    align-items: flex-start;
    @include transition(0.4s);
    position: relative;
    padding: 0 toRem(8) toRem(8);

    .spacer {
      width: 20%;
    }

    .wrapper {
      width: 80%;
    }

    .nav-sub-row {
      padding: toRem(10) toRem(8);
      margin-bottom: toRem(6);

      &:last-of-type {
        margin-bottom: 0;
      }

      .text-row {
        @include flex-row-start-nowrap;

        .bullet {
          background: getColor("grey-500");
          @include draw-shape(7);
        }
      }

      &:hover {
        background-color: getColor("neutral-10");
      }
    }

    .active-sub-row {
      background: getColor("neutral-10");

      .bullet {
        background: getColor("teal-800") !important;
      }
    }

    .inactive-text {
      color: getColor("grey-600");
    }
  }
}

@keyframes blink {
  0% {
    transform: scale(1) translateY(-50%);
    opacity: 1;
  }
  50% {
    transform: scale(1.05) translateY(-50%);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) translateY(-50%);
    opacity: 1;
  }
}
</style>
