<template>
  <div class="mgt-40">
    <UserAccessTable />
  </div>
</template>

<script>
import UserAccessTable from "../components/users/user-access-table.vue";

export default {
  name: "UserAccess",

  components: {
    UserAccessTable,
  },
};
</script>

<style lang="scss" scoped></style>
