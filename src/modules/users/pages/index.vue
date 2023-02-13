<template>
  <div class="position-relative">
    <div class="top-row mgb-20">
      <div class="page-title">Manage Users</div>

      <div
        class="secondary-2-text"
        v-if="formattedStartDate && formattedEndDate"
      >{{ formattedStartDate }} - {{formattedEndDate}}</div>

      <div class="secondary-2-text" v-else>{{ date_shortcut }}</div>
    </div>

    <div class="filter-row mgb-30">
      <input
        type="text"
        class="form-control"
        placeholder="Search user ID, email, name, phone number"
        v-model="search"
      />

      <select name id class="form-control pointer" v-model="account_type">
        <option value>
          Account
          type
        </option>
        <option value="individual">Individual</option>
        <option value="business">Business</option>
      </select>

      <select name id class="form-control pointer">
        <option value="1" disabled selected>Status</option>
        <option value="2">Verified</option>
        <option value="3">Pending</option>
      </select>

      <div class="date-wrapper">
        <DatePicker
          v-model="time"
          range
          prefix-class="xmx"
          :formatter="{ stringify:()=>'' }"
          :range-separator="'Date range'"
          placeholder="Date range"
          class="pointer"
          :clearable="false"
          :editable="false"
          :disabled-date="disabledDate"
          :popup-style="{right:'0', top:'40px',left:'auto'}"
          :append-to-body="false"
        >
          <span slot="icon-calendar" class="icon icon-caret-fill-down"></span>
        </DatePicker>
      </div>
    </div>
    <UsersTable />
  </div>
</template>

<script>
import UsersTable from "@/modules/users/components/profile/users-table";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

export default {
  name: "users",

  components: {
    UsersTable,
    DatePicker,
  },

  computed: {
    userQueries() {
      const search = this.search;
      const account_type = this.account_type;
      const [start, end] = this.time;
      const start_date = start
        ? new Date(start).toISOString().split("T")[0]
        : "";
      const end_date = end ? new Date(end).toISOString().split("T")[0] : "";

      // will be updated later with date service

      return {
        account_type,
        search,
        start_date,
        end_date,
      };
    },

    formattedStartDate() {
      const date = this.time[0];

      if (!date) return "";
      const start_date = this.$date.formatDate(new Date(date), false);

      const start_day = start_date?.getDay("d3");
      const start_month = start_date?.getMonth("m4");
      const start_year = start_date?.getYear("y1");

      return `${start_day} ${start_month}, ${start_year}`;
    },

    formattedEndDate() {
      const date = this.time[1];

      if (!date) return "";
      const start_date = this.$date.formatDate(new Date(date), false);

      const start_day = start_date?.getDay("d3");
      const start_month = start_date?.getMonth("m4");
      const start_year = start_date?.getYear("y1");

      return `${start_day} ${start_month}, ${start_year}`;
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
      time: ["2020-04-19", "2022-08-09"],
      show_date_range: false,
      date_shortcut: "",
    };
  },

  methods: {
    toggleDateRange() {
      this.show_date_range = !this.show_date_range;
    },

    disabledDate(a) {
      return new Date(a).getTime() > new Date().getTime();
    },

    closeDateRange() {
      this.show_date_range = false;
    },

    syncFilterInputs() {
      this.search = this.$route?.query?.search || "";
      this.account_type = this.$route?.query?.account_type || "";
      const start_date = this.$route?.query?.start_date || "";
      const end_date = this.$route?.query?.end_date || "";
      this.time = [start_date, end_date];
      this.date_shortcut = start_date ? "" : "Till Date";
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

  @include breakpoint-down(lg) {
    display: none;
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