<template>
  <div>
    <div class="page-title">API Transactions</div>

    <div class="filter-wrapper mgy-30">
      <input
        type="text"
        placeholder="Search id"
        class="form-control"
        v-model.trim="search"
        disabled
      />
      <select v-model="status" class="form-control pointer">
        <option value="" disabled>Status</option>
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="declined">Declined</option>
      </select>
    </div>

    <ApiRequestTable />
  </div>
</template>

<script>
import ApiRequestTable from "@/modules/api/components/api-request-table";
export default {
  name: "APITransactions",

  components: {
    ApiRequestTable,
  },

  data() {
    return {
      search: "",
      status: "",
    };
  },

  mounted() {
    this.syncRequestFilter();
  },

  watch: {
    requestQuery: {
      handler(query) {
        let updated_query = { ...this.$route.query, ...query };

        Object.entries(updated_query).forEach(
          ([k, v]) => !v && delete updated_query[k]
        );

        // THIS CONDITION AVOIDS REDUNDANT NAVIGATION

        this.queryStrings(updated_query) !==
          this.queryStrings(this.$route?.query) &&
          this.$router.replace({
            path: this.$route.path,
            query: { ...updated_query },
          });
      },
    },
  },

  computed: {
    requestQuery() {
      const search = this.search;
      const status = this.status;

      return {
        search,
        status,
      };
    },
  },

  methods: {
    queryStrings(query) {
      return Object.entries(query)
        .map(([k, v]) => `${k}=${v}`)
        .join("&");
    },

    syncRequestFilter() {
      this.status = this.$route?.query?.status || "";
      this.search = this.$route?.query?.search || "";
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-wrapper {
  @include flex-row-between-nowrap;
  gap: 0 toRem(50);

  input {
    max-width: toRem(400);
  }

  select {
    max-width: toRem(150);
  }
}
</style>
