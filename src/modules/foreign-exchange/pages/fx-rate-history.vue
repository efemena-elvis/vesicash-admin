<template>
  <div class="mgt-15">
    <div class="filter-row">
      <input
        type="text"
        class="form-control"
        placeholder="Search by txn ID"
        v-model="search"
      />

      <select
        name="fx-type"
        id="fx-type"
        class="form-control pointer"
        v-model="currency_type"
      >
        <option value="" disabled>Currency type</option>
        <option value="">All</option>
        <option
          v-for="option in fxRateOptions"
          :key="option.id"
          :value="option.id"
        >
          {{ option.name }}
        </option>
      </select>

      <div class="date-filter-container">
        <div class="secondary-2-text" v-if="getDateShortcut">
          {{ getDateShortcut }}
        </div>

        <div class="secondary-2-text" v-else>
          {{ formattedDateRange || "Till Date" }}
        </div>
        <div class="date-wrapper mgt-10">
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
    </div>

    <FxRateTable />
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import { MixinDateFilter } from "@/shared/mixins/mixin-date-filter";
import "vue2-datepicker/index.css";
import FxRateTable from "@/modules/foreign-exchange/components/fx-rate-table";

export default {
  name: "FXRateHistory",

  components: {
    DatePicker,
    FxRateTable,
  },

  mixins: [MixinDateFilter],

  watch: {
    fxQuery: {
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
    fxQuery() {
      const [start, end] = this.time;
      const start_date = start
        ? this.$date.formatDate(new Date(start), false).getSimpleDate()
        : "";
      const end_date = end
        ? this.$date.formatDate(new Date(end), false).getSimpleDate()
        : "";

      const search = this.search;
      const currency_type = this.currency_type;

      return {
        start_date,
        end_date,
        search,
        currency_type,
      };
    },

    fxRateOptions() {
      return [
        {
          id: "naira_dollar",
          name: "NGN to USD",
        },
        {
          id: "dollar_naira",
          name: "USD to NGN",
        },
        {
          id: "naira_pound",
          name: "NGN to GBP",
        },
        {
          id: "pound_naira",
          name: "GBP to NGN",
        },
        {
          id: "dollar_pound",
          name: "USD to GBP",
        },
        {
          id: "pound_dollar",
          name: "GBP to USD",
        },
      ];
    },
  },

  mounted() {
    this.syncDateFilter();
  },

  data() {
    return {
      search: "",
      currency_type: "",
    };
  },

  methods: {
    queryStrings(query) {
      return Object.entries(query)
        .map(([k, v]) => `${k}=${v}`)
        .join("&");
    },

    syncDateFilter() {
      const start_date = this.$route?.query?.start_date || "";
      const end_date = this.$route?.query?.end_date || "";
      this.currency_type = this.$route?.query?.currency_type || "";
      this.search = this.$route?.query?.search || "";
      this.time = [start_date, end_date];
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-row {
  display: grid;
  grid-template-columns: 1fr minmax(0, toRem(160)) minmax(0, toRem(230));
  gap: toRem(30);
  margin-bottom: toRem(40);
  align-items: flex-end;

  @include breakpoint-custom-down(800) {
    grid-template-columns: 1fr 1fr;
    gap: toRem(30) toRem(50);
  }

  input {
    &.form-control {
      width: 75%;

      @include breakpoint-custom-down(1100) {
        width: 90%;
      }

      @include breakpoint-custom-down(800) {
        width: 100%;
        grid-column: 1/-1;
        order: 3;
      }
    }
  }

  select {
    &.form-control {
      max-width: toRem(220);
    }
  }

  .date-filter-container {
    display: grid;
    justify-content: flex-end;
  }

  .date-wrapper {
    @include flex-row-center-wrap;
    justify-self: flex-end;
    max-width: toRem(230);
    position: relative;
    height: toRem(40);
  }
}
</style>
