<template>
  <div class="position-relative">
    <div class="top-row">
      <div class="page-title">Manage Users</div>

      <div class="secondary-2-text" v-if="getDateShortcut">
        {{ getDateShortcut }}
      </div>

      <div class="secondary-2-text" v-else>
        {{ formattedDateRange || "Till Date" }}
      </div>
    </div>

    <div class="filter-row mgb-30">
      <input
        type="text"
        class="form-control"
        placeholder="Search user ID, email, name, phone number"
        v-model.trim="search"
      />

      <select name id class="form-control pointer" v-model="account_type">
        <option value disabled>Account type</option>
        <option value="">All</option>
        <option value="individual">Individual</option>
        <option value="business">Business</option>
      </select>

      <select name id class="form-control pointer" v-model="status">
        <option value="" disabled selected>Status</option>
        <option value="">All</option>
        <option value="true">Verified</option>
        <option :value="'false'">Pending</option>
      </select>

      <div class="date-wrapper">
        <DatePicker
          v-model="time"
          range
          prefix-class="xmx"
          :formatter="{ stringify: () => '' }"
          :range-separator="'Date range'"
          :placeholder="'Date range'"
          class="pointer"
          :clearable="false"
          :editable="false"
          :disabled-date="disabledDate"
          :popup-style="{ right: '0', top: '40px', left: 'auto' }"
          :append-to-body="false"
          :shortcuts="shortcutConfig"
        >
          <span slot="icon-calendar" class="icon icon-caret-fill-down"></span>
        </DatePicker>
      </div>
    </div>
    <UsersTable :users="getUsers" />
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import UsersTable from "@/modules/users/components/profile/users-table";
import DatePicker from "vue2-datepicker";
import { MixinDateFilter } from "@/shared/mixins/mixin-date-filter";
import "vue2-datepicker/index.css";

export default {
  name: "users",

  components: {
    UsersTable,
    DatePicker,
  },

  mixins: [MixinDateFilter],

  computed: {
    ...mapGetters({ getConnectedUsers: "users/getAllConnectedUsers" }),

    getUsers() {
      let users = this.getConnectedUsers?.data
        ? [...this.getConnectedUsers?.data]
        : [];
      // if (!this.status) return users;
      // if (this.status === "verified")
      //   return users?.filter((user) => user.is_verified);
      // return users?.filter((user) => !user.is_verified);
      return users;
    },

    userQueries() {
      const search = this.search;
      const account_type = this.account_type;
      const [start, end] = this.time;
      const status = this.status;
      const start_date = start
        ? this.$date.formatDate(new Date(start), false).getSimpleDate()
        : "";
      const end_date = end
        ? this.$date.formatDate(new Date(end), false).getSimpleDate()
        : "";

      return {
        account_type,
        search,
        start_date,
        end_date,
        status,
        page: 1,
      };
    },
  },

  watch: {
    userQueries: {
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

  mounted() {
    this.syncFilterInputs();
  },

  data() {
    return {
      search: "",
      account_type: "",
      status: "",
      show_date_range: false,
      date_shortcut: "",
    };
  },

  methods: {
    ...mapMutations({ SAVE_ALL_USERS: "users/SAVE_ALL_USERS" }),

    syncFilterInputs() {
      this.search = this.$route?.query?.search || "";
      this.account_type = this.$route?.query?.account_type || "";
      const start_date = this.$route?.query?.start_date || "";
      const end_date = this.$route?.query?.end_date || "";
      this.time = [start_date, end_date];
    },

    queryStrings(query) {
      return Object.entries(query)
        .map(([k, v]) => `${k}=${v}`)
        .join("&");
    },
  },
};
</script>

<style lang="scss" scoped>
.top-row {
  @include flex-row-between-nowrap;
  margin-bottom: toRem(20);

  @include breakpoint-down(lg) {
    margin-bottom: toRem(15);
    justify-content: flex-end;
    .page-title {
      display: none;
    }
  }
}

.date-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
}

.filter-row {
  display: grid;
  grid-template-columns: 1.5fr repeat(2, 0.45fr) minmax(0, 0.55fr);
  gap: toRem(30) toRem(15);

  & > :nth-child(1) {
    width: 80%;
  }

  & > :nth-child(4) {
    width: 95%;
    justify-self: flex-end;
  }

  @include breakpoint-custom-down(1150) {
    & > :nth-child(1) {
      width: 90%;
    }
  }

  @include breakpoint-custom-down(800) {
    grid-template-columns: 0.25fr 0.25fr minmax(0, 0.55fr);

    & > :nth-child(1) {
      grid-column: 1 / span 3;
      order: 4;
      width: 100%;
    }

    & > :nth-child(4) {
      width: 80%;
    }
  }

  .icon-caret-fill-down {
    font-size: toRem(24);
    color: getColor("neutral-900");
  }
}
</style>
