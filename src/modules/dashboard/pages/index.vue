<template>
  <div class="pdb-40">
    <div class="metric-container">
      <!-- METRICS CONTAINER -->
      <template>
        <div class="mgb-30">
          <div class="top-row mgb-20">
            <div class="page-title">Overview</div>

            <div>
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
                  <span
                    slot="icon-calendar"
                    class="icon icon-caret-fill-down"
                  ></span>
                </DatePicker>
              </div>
            </div>
          </div>

          <div v-if="loading_stats" class="metric-cards-container">
            <div
              class="metric-skeleton skeleton-loader"
              v-for="i in 12"
              :key="i"
            ></div>
          </div>

          <div class="metric-cards-container pdy-30" v-else>
            <template>
              <MetricCard
                v-for="metric in dashboardMetrics1"
                :key="metric.title"
                :metric="metric"
              />
            </template>

            <MetricCard
              :metric="{ title: nairaDollarTitle, value: nairaDollarRate }"
            >
              <div
                class="swap-icon-wrapper"
                @click="naira_dollar = !naira_dollar"
              >
                <RateSwapIcon :swapped="naira_dollar" />
              </div>
            </MetricCard>

            <MetricCard
              :metric="{ title: nairaPoundTitle, value: nairaPoundRate }"
            >
              <div
                class="swap-icon-wrapper"
                @click="naira_pound = !naira_pound"
              >
                <RateSwapIcon :swapped="naira_pound" />
              </div>
            </MetricCard>

            <MetricCard
              :metric="{ title: dollarPoundTitle, value: dollarPoundRate }"
            >
              <div
                class="swap-icon-wrapper"
                @click="dollar_pound = !dollar_pound"
              >
                <RateSwapIcon :swapped="dollar_pound" />
              </div>
            </MetricCard>

            <template>
              <MetricCard
                v-for="metric in dashboardMetrics2"
                :key="metric.title"
                :metric="metric"
              />
            </template>
          </div>
          <div></div>
        </div>
      </template>

      <!-- GRAPH CONTAINER -->
      <template>
        <div>
          <div class="page-title mgb-25">Graphical metrics</div>

          <div class="metric-graphs-container">
            <div
              class="position-relative"
              :class="
                loading_metrics ||
                loading_txn_metric ||
                !getTxnVolumeMetrics.length
                  ? 'graph-wrapper'
                  : ''
              "
            >
              <div class="graph-top-row mgb-25 mgt-10">
                <select
                  name="volume-date-type"
                  class="form-control inline"
                  v-model="txn_vol_filter_type"
                >
                  <option value="" disabled>Filter by</option>
                  <option value="year">Year</option>
                  <option value="month">Month</option>
                  <option value="week">Week</option>
                </select>
                <div class="year-filter-wrapper position-relative">
                  <DatePicker
                    v-model="txn_vol_date"
                    prefix-class="xmx"
                    class="pointer year-range"
                    valueType="date"
                    :type="txnVolFilterType"
                    :disabled-date="disabledDate"
                    :clearable="false"
                    :popup-style="{ right: '0', top: '40px', left: 'auto' }"
                    :append-to-body="false"
                    :formatter="txnVolDateFormatter"
                    :editable="false"
                    :shortcuts="txnVolumeShortcuts"
                  >
                    <span
                      slot="icon-calendar"
                      class="icon icon-caret-fill-down h5-text"
                    ></span>
                  </DatePicker>
                </div>
              </div>

              <div
                class="graph-loading-container"
                v-if="loading_txn_metric || loading_metrics"
              >
                <div class="skeleton-loader" v-for="i in 6" :key="i"></div>
              </div>

              <div
                class="neutral-10-bg pd-10"
                v-else-if="getTxnVolumeMetrics.length"
              >
                <div class="secondary-1-text mgb-20">Transaction Volume</div>
                <MetricGraph
                  :dataset="getTxnVolumeMetrics"
                  :labels="txnVolLabels"
                />
              </div>
            </div>

            <div
              class="position-relative"
              :class="
                loading_metrics ||
                loading_users_metric ||
                !getUserVolumeMetrics.length
                  ? 'graph-wrapper'
                  : ''
              "
            >
              <div class="graph-top-row mgb-25 mgt-10">
                <select
                  name="volume-date-type"
                  class="form-control inline"
                  v-model="users_vol_filter_type"
                >
                  <option value="" disabled>Filter by</option>
                  <option value="year">Year</option>
                  <option value="month">Month</option>
                  <option value="week">Week</option>
                </select>
                <div class="year-filter-wrapper position-relative">
                  <DatePicker
                    v-model="users_vol_date"
                    prefix-class="xmx"
                    class="pointer year-range"
                    valueType="date"
                    :type="usersVolFilterType"
                    :disabled-date="disabledDate"
                    :clearable="false"
                    :popup-style="{ right: '0', top: '40px', left: 'auto' }"
                    :append-to-body="false"
                    :editable="false"
                    :formatter="usersVolDateFormatter"
                    :shortcuts="txnUsersShortcuts"
                  >
                    <span
                      slot="icon-calendar"
                      class="icon icon-caret-fill-down h5-text"
                    ></span>
                  </DatePicker>
                </div>
              </div>

              <div
                class="graph-loading-container"
                v-if="loading_users_metric || loading_metrics"
              >
                <div class="skeleton-loader" v-for="i in 6" :key="i"></div>
              </div>

              <div
                class="neutral-10-bg pd-10"
                v-else-if="getUserVolumeMetrics.length"
              >
                <div class="secondary-1-text mgb-20">No. of users</div>
                <MetricGraph
                  :dataset="getUserVolumeMetrics"
                  barColor="#0B618F"
                  label="Users"
                  :labels="usersVolLabels"
                />
              </div>
            </div>

            <div
              class="position-relative"
              :class="
                loading_metrics ||
                loading_txn_unit_metric ||
                !getTxnUnitMetrics.length
                  ? 'graph-wrapper'
                  : ''
              "
            >
              <div class="graph-top-row mgb-25 mgt-10">
                <select
                  name="volume-date-type"
                  class="form-control inline"
                  v-model="txn_unit_filter_type"
                >
                  <option value="" disabled>Filter by</option>
                  <option value="year">Year</option>
                  <option value="month">Month</option>
                  <option value="week">Week</option>
                </select>
                <div class="year-filter-wrapper position-relative">
                  <DatePicker
                    v-model="txn_unit_date"
                    prefix-class="xmx"
                    class="pointer year-range"
                    valueType="date"
                    :type="txnUnitFilterType"
                    :disabled-date="disabledDate"
                    :clearable="false"
                    :popup-style="{ right: '0', top: '40px', left: 'auto' }"
                    :append-to-body="false"
                    :editable="false"
                    :formatter="txnUnitDateFormatter"
                    :shortcuts="txnUnitShortcuts"
                  >
                    <span
                      slot="icon-calendar"
                      class="icon icon-caret-fill-down h5-text"
                    ></span>
                  </DatePicker>
                </div>
              </div>

              <div
                class="graph-loading-container"
                v-if="loading_txn_unit_metric || loading_metrics"
              >
                <div class="skeleton-loader" v-for="i in 6" :key="i"></div>
              </div>

              <div
                class="neutral-10-bg pd-10"
                v-else-if="getTxnUnitMetrics.length"
              >
                <div class="secondary-1-text mgb-20">Transaction Unit</div>
                <MetricGraph
                  :dataset="getTxnUnitMetrics"
                  barColor="#b3e4fb"
                  label="Transaction Unit"
                  :labels="txnUnitLabels"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import DatePicker from "vue2-datepicker";
import RateSwapIcon from "@/shared/components/icon-comps/rate-swap-icon";
import { MixinDateFilter } from "@/shared/mixins/mixin-date-filter";
import "vue2-datepicker/index.css";
import MetricCard from "@/modules/dashboard/components/metric-card";
import MetricGraph from "@/modules/dashboard/components/metric-graph";

export default {
  name: "Dashbooard",

  mixins: [MixinDateFilter],

  components: {
    MetricCard,
    MetricGraph,
    DatePicker,
    RateSwapIcon,
  },

  mounted() {
    this.syncDateFilter();
    this.fetchDashboardMetrics(this.filterQuery);
    this.initialMetrics();
  },

  watch: {
    txn_vol_year: {
      handler(year) {
        this.fetchTxnMetrics(year);
      },
    },

    txnVolFilter: {
      handler(filter) {
        this.fetchTxnMetrics(filter);
      },
    },

    usersVolFilter: {
      handler(filter) {
        this.fetchUserMetrics(filter);
      },
    },

    txnUnitFilter: {
      handler(filter) {
        this.fetchTxnUnitMetrics(filter);
      },
    },

    user_vol_year: {
      handler(year) {
        this.fetchUserMetrics(year);
      },
    },

    dateQuery: {
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

    filterQuery: {
      handler(query) {
        this.fetchDashboardMetrics(query);
      },
    },
  },

  computed: {
    ...mapGetters({ getDashboardStats: "dashboard/getDashboardStats" }),

    getTxnVolumeMetrics() {
      const type = this.txnVolFilterType;
      const range = this.date_ranges[type];

      return this.txn_volume_metrics
        ? range.map((index) => this.txn_volume_metrics[index])
        : [];
    },

    getUserVolumeMetrics() {
      const type = this.usersVolFilterType;
      const range = this.date_ranges[type];

      return this.user_metrics
        ? range.map((index) => this.user_metrics[index])
        : [];
    },

    getTxnUnitMetrics() {
      const type = this.txnUnitFilterType;
      const range = this.date_ranges[type];

      return this.txn_unit_metrics
        ? range.map((index) => this.txn_unit_metrics[index])
        : [];
    },

    nairaDollarRate() {
      const { naira_dollar, dollar_naira } = this.getDashboardStats;
      return this.naira_dollar
        ? `${this.sign("naira")}1/${this.sign("dollar")}${
            naira_dollar || "---"
          }`
        : `${this.sign("dollar")}1/${this.sign("naira")}${
            dollar_naira || "---"
          }`;
    },

    nairaDollarTitle() {
      return this.naira_dollar ? "NGN/USD rate" : "USD/NGN rate";
    },

    nairaPoundRate() {
      const { naira_pound, pound_naira } = this.getDashboardStats;
      return this.naira_pound
        ? `${this.sign("naira")}1/${this.sign("pound")}${naira_pound || "---"}`
        : `${this.sign("pound")}1/${this.sign("naira")}${pound_naira || "---"}`;
    },

    nairaPoundTitle() {
      return this.naira_pound ? "NGN/GBP rate" : "GBP/NGN rate";
    },

    dollarPoundRate() {
      const { dollar_pound, pound_dollar } = this.getDashboardStats;
      return this.dollar_pound
        ? `${this.sign("dollar")}1/${this.sign("pound")}${
            dollar_pound || "---"
          }`
        : `${this.sign("pound")}1/${this.sign("dollar")}${
            pound_dollar || "---"
          }`;
    },

    dollarPoundTitle() {
      return this.dollar_pound ? "USD/GBP rate" : "GBP/USD rate";
    },

    dashboardMetrics1() {
      const {
        transaction_volume,
        active_transactions,
        completed_transactions,
        registered_users,
        verified_users,
        dollar_balance,
        naira_balance,
        pounds_balance,
        exchange_transactions,
      } = this.getDashboardStats;

      return [
        {
          title: "Transaction volume",
          value: this.$string.formattedBulkUnit(transaction_volume),
        },
        {
          title: "Active transaction",
          value: this.$string.formattedBulkUnit(active_transactions),
        },
        {
          title: "Completed transaction",
          value: this.$string.formattedBulkUnit(completed_transactions),
        },
        {
          title: "Registered users",
          value: this.$string.formattedBulkUnit(registered_users),
        },
        {
          title: "No of verified users",
          value: this.$string.formattedBulkUnit(verified_users),
        },
        {
          title: "Dollar balance",
          value: dollar_balance
            ? `${this.$money.getSign("dollar")}${this.$money.addComma(
                dollar_balance
              )}`
            : "",
        },
        {
          title: "Naira balance",
          value: naira_balance
            ? `${this.$money.getSign("naira")}${this.$money.addComma(
                naira_balance
              )}`
            : "",
        },
        {
          title: "Pounds balance",
          value: naira_balance
            ? `${this.$money.getSign("pound")}${this.$money.addComma(
                pounds_balance
              )}`
            : "",
        },
        {
          title: "Exchange transactions",
          value: this.$string.formattedBulkUnit(exchange_transactions),
        },
      ];
    },

    dashboardMetrics2() {
      const {
        dollar_exchange_balance,
        naira_exchange_balance,
        pounds_exchange_balance,
        api_keys,
        active_api_keys,
      } = this.getDashboardStats;

      return [
        {
          title: "Naira exchange balance",
          value: `${this.$money.getSign(
            "naira"
          )}${this.$string.formattedBulkUnit(naira_exchange_balance)}`,
        },
        {
          title: "Dollar exchange balance",
          value: `${this.$money.getSign(
            "dollar"
          )}${this.$string.formattedBulkUnit(dollar_exchange_balance)}`,
        },
        {
          title: "Pounds exchange balance",
          value: `${this.$money.getSign(
            "pound"
          )}${this.$string.formattedBulkUnit(pounds_exchange_balance)}`,
        },
        {
          title: "No of API keys generated",
          value: this.$string.formattedBulkUnit(api_keys),
        },
        {
          title: "Active keys",
          value: this.$string.formattedBulkUnit(active_api_keys),
        },
      ];
    },

    dateQuery() {
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
      };
    },

    filterQuery() {
      return this.queryStrings(this.$route?.query);
    },

    txnVolFilterType() {
      const type = this.txn_vol_filter_type;
      return type ? type : "year";
    },

    usersVolFilterType() {
      const type = this.users_vol_filter_type;
      return type ? type : "year";
    },

    txnUnitFilterType() {
      const type = this.txn_unit_filter_type;
      return type ? type : "year";
    },

    txnVolFilter() {
      const date = this.txn_vol_date;

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const weekOfMonth = Math.ceil(
        (date.getDate() + (date.getDay() + 1) - 1) / 7
      );

      const type = this.txnVolFilterType;

      switch (type) {
        case "year":
          return `year=${year}`;
        case "month":
          return `year=${year}&month=${month}`;
        case "week":
          return `year=${year}&month=${month}&week${weekOfMonth}`;
        default:
          return `year=${year}`;
      }
    },

    usersVolFilter() {
      const date = this.users_vol_date;

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const weekOfMonth = Math.ceil(
        (date.getDate() + (date.getDay() + 1) - 1) / 7
      );

      const type = this.usersVolFilterType;

      switch (type) {
        case "year":
          return `year=${year}`;
        case "month":
          return `year=${year}&month=${month}`;
        case "week":
          return `year=${year}&month=${month}&week${weekOfMonth}`;
        default:
          return `year=${year}`;
      }
    },

    txnUnitFilter() {
      const date = this.txn_unit_date;

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const weekOfMonth = Math.ceil(
        (date.getDate() + (date.getDay() + 1) - 1) / 7
      );

      const type = this.txnUnitFilterType;

      switch (type) {
        case "year":
          return `year=${year}`;
        case "month":
          return `year=${year}&month=${month}`;
        case "week":
          return `year=${year}&month=${month}&week${weekOfMonth}`;
        default:
          return `year=${year}`;
      }
    },

    dateFormatter() {
      return {
        stringify: (date) => {
          return date ? this.formatDate(date) : "";
        },
      };
    },

    txnVolDateFormatter() {
      const type = this.txnVolFilterType;
      return {
        stringify: (date) => {
          return date ? this.formatDate(date, type) : "";
        },
      };
    },

    usersVolDateFormatter() {
      const type = this.usersVolFilterType;
      return {
        stringify: (date) => {
          return date ? this.formatDate(date, type) : "";
        },
      };
    },

    txnUnitDateFormatter() {
      const type = this.txnUnitFilterType;
      return {
        stringify: (date) => {
          return date ? this.formatDate(date, type) : "";
        },
      };
    },

    txnVolLabels() {
      const type = this.txnVolFilterType;
      return this.date_labels[type];
    },

    usersVolLabels() {
      const type = this.usersVolFilterType;
      return this.date_labels[type];
    },

    txnUnitLabels() {
      const type = this.txnUnitFilterType;
      return this.date_labels[type];
    },

    txnVolumeShortcuts() {
      return this.generateDateShortcut("txn_vol_filter_type");
    },

    txnUsersShortcuts() {
      return this.generateDateShortcut("users_vol_filter_type");
    },

    txnUnitShortcuts() {
      return this.generateDateShortcut("txn_unit_filter_type");
    },
  },

  data() {
    return {
      metrics: [],
      loading_stats: false,
      naira_dollar: false,
      naira_pound: false,
      dollar_pound: false,
      user_metrics: null,
      txn_volume_metrics: null,
      txn_unit_metrics: null,
      loading_txn_metric: false,
      loading_users_metric: false,
      loading_txn_unit_metric: false,
      loading_metrics: false,
      txn_vol_year: `${new Date().getFullYear()}`,
      user_vol_year: `${new Date().getFullYear()}`,

      txn_vol_date: new Date(),
      txn_vol_filter_type: "year",

      users_vol_date: new Date(),
      users_vol_filter_type: "year",

      txn_unit_date: new Date(),
      txn_unit_filter_type: "year",

      date_labels: {
        year: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sept",
          "Oct",
          "Nov",
          "Dec",
        ],
        month: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
        week: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
      },

      date_ranges: {
        year: [
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
        ],
        month: ["01", "02", "03", "04", "05"],
        week: ["01", "02", "03", "04", "05", "06", "07"],
      },
    };
  },

  methods: {
    ...mapActions({
      fetchTransactionStats: "dashboard/fetchTransactionStats",
      fetchExchangeRates: "dashboard/fetchExchangeRates",
      fetchUsersCount: "dashboard/fetchUsersCount",
      fetchAPIkeysStats: "dashboard/fetchAPIkeysStats",
      fetchGraphMetrics: "dashboard/fetchGraphMetrics",
    }),

    generateDateShortcut(metric_filter_type) {
      return [
        {
          text: "This Year",
          onClick: () => {
            this[metric_filter_type] = "year";
            return this.today;
          },
        },
        {
          text: "Last Year",
          onClick: () => {
            this[metric_filter_type] = "year";
            return this.lastYear;
          },
        },
        {
          text: "This Month",
          onClick: () => {
            this[metric_filter_type] = "month";
            return this.today;
          },
        },
        {
          text: "Last Month",
          onClick: () => {
            this[metric_filter_type] = "month";
            return this.lastMonth;
          },
        },
        {
          text: "This Week",
          onClick: () => {
            this[metric_filter_type] = "week";
            return this.today;
          },
        },
        {
          text: "Last Week",
          onClick: () => {
            this[metric_filter_type] = "week";
            return this.lastWeek;
          },
        },
      ];
    },

    formatDate(date, type = "year") {
      const formattedDate = this.$date?.formatDate(date, false);
      const year = date.getFullYear();
      const month = formattedDate.getMonth("m4");
      const weekOfMonth = Math.ceil(
        (date.getDate() + (date.getDay() + 1) - 1) / 7
      );

      switch (type) {
        case "year":
          return year;
        case "month":
          return `${month} ${year}`;
        case "week":
          return `Week ${weekOfMonth}, ${month} ${year}`;
        default:
          return year;
      }
    },

    async initialMetrics() {
      const filter = `year=${new Date().getFullYear()}`;
      this.loading_metrics = true;
      const response = await this.fetchGraphMetrics(filter);
      this.loading_metrics = false;
      if (response?.code === 200) {
        this.txn_volume_metrics = response?.data?.transaction_volume;
        this.user_metrics = response?.data?.users;
        this.txn_unit_metrics = response?.data?.transaction_unit;
      }
    },

    async fetchTxnMetrics(filter) {
      this.loading_txn_metric = true;
      const response = await this.fetchGraphMetrics(filter);
      this.loading_txn_metric = false;
      if (response?.code === 200)
        this.txn_volume_metrics = response?.data?.transaction_volume;
    },

    async fetchUserMetrics(filter) {
      this.loading_users_metric = true;
      const response = await this.fetchGraphMetrics(filter);
      this.loading_users_metric = false;
      if (response?.code === 200) this.user_metrics = response?.data?.users;
    },

    async fetchTxnUnitMetrics(filter) {
      this.loading_txn_unit_metric = true;
      const response = await this.fetchGraphMetrics(filter);
      this.loading_txn_unit_metric = false;
      if (response?.code === 200)
        this.txn_unit_metrics = response?.data?.transaction_unit;
    },

    sign(currency) {
      return this.$money?.getSign(currency);
    },

    async fetchDetails(fetcher, query = "", error_message) {
      try {
        const response = await fetcher(query);
        if (response?.code !== 200)
          this.pushToast(response?.message || error_message, "warning");
      } catch {
        this.pushToast(error_message);
      }
    },

    syncDateFilter() {
      const start_date = this.$route?.query?.start_date || "";
      const end_date = this.$route?.query?.end_date || "";
      this.time = [start_date, end_date];
    },

    queryStrings(query) {
      return Object.entries(query)
        .map(([k, v]) => `${k}=${v}`)
        .join("&");
    },

    fetchDashboardMetrics(query = "") {
      this.loading_stats = true;
      Promise.all([
        this.fetchDetails(
          this.fetchTransactionStats,
          query,
          "Failed to load transaction stats"
        ),

        this.fetchDetails(
          this.fetchExchangeRates,
          query,
          "Failed to load exchange rates"
        ),

        this.fetchDetails(
          this.fetchUsersCount,
          query,
          "Failed to load users stats"
        ),

        this.fetchDetails(
          this.fetchAPIkeysStats,
          query,
          "Failed to load API keys stats"
        ),
      ])
        .then(() => (this.loading_stats = false))
        .catch(() => (this.loading_stats = false));
    },
  },
};
</script>

<style lang="scss" scoped>
.metric-container {
  .top-row {
    @include flex-row-between-nowrap;

    .date-wrapper {
      @include flex-row-center-wrap;
      max-width: toRem(200);
      position: relative;
    }
  }

  .metric-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: toRem(30);

    .metric-skeleton {
      height: 60px;
      width: 100%;
    }
  }

  .graph-wrapper {
    display: grid;
    grid-template-rows: auto 1fr;
    min-height: toRem(500);
  }

  .graph-loading-container {
    @include flex-row-start-nowrap;
    align-items: flex-end;
    gap: 0 toRem(35);
    height: 100%;
    padding: toRem(10);
    background-color: getColor("neutral-10");

    & > div {
      height: 50%;
      width: 100%;
    }

    & > div:nth-child(1) {
      height: 25%;
    }
    & > div:nth-child(3) {
      height: 90%;
    }
    & > div:nth-child(4) {
      height: 75%;
    }
    & > div:nth-child(6) {
      height: 30%;
    }
  }

  .swap-icon-wrapper {
    @include draw-shape(42);
    @include flex-column-center;
    @include center-placement("y-axis");
    background: getColor("teal-50");
    position: absolute;
    right: toRem(15);
    cursor: pointer;
    border-radius: 50%;
  }

  .year-filter-wrapper {
    width: 100%;
  }

  .metric-graphs-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: toRem(80) toRem(30);

    .graph-top-row {
      @include flex-row-start-nowrap;
      justify-content: flex-end;
      gap: 0 toRem(25);
      margin-bottom: toRem(20);

      & > div {
        width: toRem(180);
      }

      select.form-control {
        width: toRem(120);
        height: toRem(35);
      }

      // @include breakpoint-down(md) {
      //   grid-template-columns: 100%;

      //   .graph-title {
      //     order: 3;
      //   }
      // }
    }
  }
}
</style>

<style lang="scss">
.year-range.xmx-datepicker {
  width: auto;
}
</style>
