<template>
  <div>
    <div class="plain-tab-switcher" v-if="plain">
      <router-link
        class="tab-item secondary-3-text grey-600 fw-500 smooth-transition pointer"
        :active-class="exact ?'':'tab-item--active'"
        :exact-active-class="exact ?'tab-item--active':''"
        v-for="(tab, index) in tabs"
        :key="index"
        :to="tab.routeName ? {name:tab.routeName} : tab.route"
      >{{ tab.name }}</router-link>
    </div>

    <div class="button-tab-switcher" v-else>
      <router-link
        :active-class="exact ?'':'tab-item--active'"
        :exact-active-class="exact ?'tab-item--active':''"
        class="tab-item"
        v-for="(tab, index) in tabs"
        :key="index"
        :to="tab.routeName ? {name:tab.routeName} : tab.route"
      >{{ tab.name }}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "RouteTabSwitcher",

  props: {
    tabs: {
      type: Array,
      default: () => [],
    },

    plain: {
      type: Boolean,
      default: true,
    },

    exact: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.plain-tab-switcher {
  border-bottom: toRem(0.5) solid getColor("grey-100");
  @include flex-row-start-nowrap;
  // padding: 0 toRem(10);
  gap: 0 toRem(7);
  max-width: 100%;

  overflow-x: auto;
  @include custom-scroll-style;

  .tab-item {
    border-bottom: toRem(3) solid transparent;
    padding: toRem(7) toRem(14);
    font-size: toRem(12.75);
    min-width: max-content;

    &:hover {
      border-bottom: toRem(3) solid getColor("teal-800");
    }
  }

  .tab-item--active {
    border-bottom: toRem(3) solid getColor("teal-800");
    color: getColor("teal-800");
  }
}

.button-tab-switcher {
  @include flex-row-between-nowrap;
  gap: 0 toRem(10);
  width: max-content;
  padding: toRem(7) toRem(9);
  border-radius: toRem(7);
  background: getColor("grey-100");
  position: relative;

  .tab-item {
    font-size: toRem(14);
    color: getColor("grey-600");
    padding: toRem(6) toRem(12);
    border-radius: toRem(5);
    &:hover {
      background: getColor("neutral-10");
    }
  }

  overflow-x: auto;
  @include custom-scroll-style;

  .tab-item--active {
    transition: all ease-in-out 0.3s;
    box-shadow: toRem(1) toRem(-1) toRem(4) rgba(168, 177, 175, 0.3),
      toRem(-1) toRem(1) toRem(4) rgba(168, 177, 175, 0.3);
    background: getColor("neutral-10");
    color: getColor("neutral-900");
  }
}
</style>