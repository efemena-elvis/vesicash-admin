<template>
  <div>
    <div class="page-title mgb-20">Manage Users</div>

    <div class="filter-row mgb-30">
      <div class="search-input-wrapper">
        <input
          type="text"
          class="form-control"
          placeholder="Search user ID, email, name, phone number"
        />
      </div>

      <div class="d-flex align-items-center select-wrapper">
        <select name id class="form-control mgr-15">
          <option value="1">Account type</option>
          <option value="2">Personal</option>
          <option value="3">Business</option>
        </select>

        <select name id class="form-control mgr-25">
          <option value="1">Status</option>
          <option value="2">Verified</option>
          <option value="3">Pending</option>
        </select>

        <select name id class="form-control ml-auto">
          <option value="1">Date Range</option>
        </select>
      </div>
    </div>
    <UsersTable />
  </div>
</template>

<script>
import UsersTable from "@/modules/users/components/users-table";
export default {
  name: "users",

  components: {
    UsersTable,
  },

  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.filter-row {
  @include flex-row-between-nowrap;
  gap: toRem(25) 0;

  .search-input-wrapper {
    width: 35%;
    margin-right: 10%;
  }

  .select-wrapper {
    width: 55%;
  }
}
</style>