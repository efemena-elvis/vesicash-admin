<template>
  <div>
    <div class="page-title">{{ $route.meta.name }}</div>

    <RouteTabSwitcher
      :tabs="verificationRoutes"
      class="mgt-30"
      :plain="false"
    />

    <RouterView />
  </div>
</template>

<script>
import RouteTabSwitcher from "@/shared/components/route-tab-switcher";
export default {
  name: "VerificationLayout",

  components: {
    RouteTabSwitcher,
  },

  computed: {
    verificationRoutes() {
      return [
        {
          name: "Business verifications",
          route: "/verifications/business",
        },
        {
          name: "MOR verifications",
          route: "/verifications/mor",
        },
      ];
    },
  },
};
</script>

<style></style>
