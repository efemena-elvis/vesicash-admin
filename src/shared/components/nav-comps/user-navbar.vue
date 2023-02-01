<template>
  <div class="nav-container">
    <div class="user-wrapper">
      <div class="username">Awotunde bangalee</div>
      <div class="avatar"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserNavBar",
};
</script>

<style lang="scss" scoped>
.nav-container {
  @include flex-row-end-nowrap;
  @include box-shadow("soft");
  padding: toRem(15);
  background: getColor("neutral-10");
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 3;

  @include breakpoint-down(lg) {
    display: none;
  }

  .user-wrapper {
    @include flex-row-start-nowrap;
    gap: 0 toRem(8);
  }

  .username {
    font-size: toRem(12);
    font-weight: 500;
    line-height: 7px;
    color: getColor("neutral-900");
  }

  .avatar {
    @include draw-shape(25);
    border-radius: 50%;
    background: getColor("neutral-100");

    img {
      @include width-height(100%);
      object-fit: contain;
    }
  }
}
</style>