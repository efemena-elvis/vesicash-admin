<template>
  <div>
    <div class="page-title mgb-30">API Keys</div>

    <div class="metric-cards-container">
      <template v-if="loading_metric">
        <div class="skeleton-loader metric-skeleton"></div>
        <div class="skeleton-loader metric-skeleton"></div>
      </template>

      <template v-else>
        <MetricCard
          :metric="{
            title: 'No of API keys generated',
            value: getAPIMetrics.api_keys,
          }"
        />
        <MetricCard
          :metric="{ title: 'Active keys', value: getAPIMetrics.active_tokens }"
        />
      </template>
    </div>

    <div class="filter-row mgy-40">
      <input
        type="text"
        class="form-control"
        placeholder="Search by account ID, account name, api key"
        v-model.trim="search"
      />

      <div class="date-wrapper">
        <div class="secondary-2-text mgb-5" v-if="getDateShortcut">
          {{ getDateShortcut }}
        </div>

        <div class="secondary-2-text mgb-5" v-else>
          {{ formattedDateRange || "Till Date" }}
        </div>
        <DatePicker
          v-model="time"
          range
          prefix-class="xmx"
          :formatter="{ stringify: () => '' }"
          :range-separator="'Date range'"
          :placeholder="'Date range'"
          class="pointer api-filter"
          :clearable="false"
          :editable="false"
          :disabled-date="disabledDate"
          :popup-style="{ right: '0', top: '60px', left: 'auto' }"
          :append-to-body="false"
          :shortcuts="shortcutConfig"
        >
          <span slot="icon-calendar" class="icon icon-caret-fill-down"></span>
        </DatePicker>
      </div>
    </div>

    <ApiKeyTable />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import MetricCard from "@/modules/dashboard/components/metric-card";
import DatePicker from "vue2-datepicker";
import { MixinDateFilter } from "@/shared/mixins/mixin-date-filter";
import ApiKeyTable from "@/modules/api/components/api-key-table";
import "vue2-datepicker/index.css";

export default {
  name: "API",

  mixins: [MixinDateFilter],

  components: {
    MetricCard,
    DatePicker,
    ApiKeyTable,
  },

  computed: {
    ...mapGetters({ getAPIMetrics: "api/getAPIMetrics" }),

    apiQueries() {
      const search = this.search;
      const [start, end] = this.time;
      const start_date = start
        ? this.$date.formatDate(new Date(start), false).getSimpleDate()
        : "";
      const end_date = end
        ? this.$date.formatDate(new Date(end), false).getSimpleDate()
        : "";

      return {
        start_date,
        end_date,
        search,
        page: 1,
      };
    },
  },

  watch: {
    "getAPIMetrics.length": {
      handler(size) {
        if (!size) this.fetchMetrics();
      },
      immediate: true,
    },

    apiQueries: {
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
      loading_metric: false,
      search: "",
    };
  },

  methods: {
    ...mapActions({ fetchAPIMetrics: "api/fetchAPIMetrics" }),

    async fetchMetrics() {
      this.loading_metric = true;
      await this.fetchAPIMetrics();
      this.loading_metric = false;
    },

    syncFilterInputs() {
      this.search = this.$route?.query?.search || "";
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
.metric-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(209px, 1fr));
  gap: toRem(30);

  .metric-skeleton {
    height: 60px;
    width: 100%;
  }
}

.filter-row {
  @include flex-row-between-wrap;
  align-items: flex-end;
  gap: toRem(30);

  .form-control {
    width: 50%;

    @include breakpoint-custom-down(758) {
      width: 100%;
      order: 2;
    }
  }

  .date-wrapper {
    position: relative;
    margin-left: auto;
  }
}
</style>

<style lang="scss">
.api-filter.xmx-datepicker-range {
  width: toRem(250);

  @include breakpoint-down(sm) {
    width: auto;
  }
}
</style>
