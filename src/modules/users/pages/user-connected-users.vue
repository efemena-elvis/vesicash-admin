<template>
  <div class="mgt-30">
    <UserTable />
  </div>
</template>

<script>
import UserTable from "@/modules/users/components/users/user-table";
export default {
  name: "ConnectedUsers",

  components: {
    UserTable,
  },
};
</script>

<style lang="scss" scoped>
</style>