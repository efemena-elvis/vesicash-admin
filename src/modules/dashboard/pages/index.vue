<template>
  <div>
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
            <template v-for="metric in dashboardMetrics1">
              <MetricCard :key="metric.title" :metric="metric" />
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

            <template v-for="metric in dashboardMetrics2">
              <MetricCard :key="metric.title" :metric="metric" />
            </template>
          </div>
          <div></div>
        </div>
      </template>

      <!-- GRAPH CONTAINER -->
      <template>
        <div>
          <div class="page-title mgb-25">Graphical metrics</div>

          <div class="metric-graphs-container pdy-20">
            <div
              class="neutral-10-bg pd-10 position-relative"
              :class="
                loading_txn_metric || !getTxnVolumeMetrics.length
                  ? 'graph-wrapper'
                  : ''
              "
            >
              <div
                class="d-flex justify-content-between align-items-center mgb-25 mgt-10"
              >
                <div class="secondary-2-text pdl-4">Transaction Volume</div>
                <div class="year-filter-wrapper position-relative">
                  <DatePicker
                    v-model="txn_vol_year"
                    prefix-class="xmx"
                    class="pointer year-range"
                    valueType="format"
                    formt="YYYY"
                    type="year"
                    :disabled-date="disabledDate"
                    :clearable="false"
                    :popup-style="{ right: '0', top: '40px', left: 'auto' }"
                    :append-to-body="false"
                  >
                    <span
                      slot="icon-calendar"
                      class="icon icon-caret-fill-down h5-text"
                    ></span>
                  </DatePicker>
                </div>
              </div>

              <div class="graph-loading-container" v-if="loading_txn_metric">
                <div class="skeleton-loader" v-for="i in 6" :key="i"></div>
              </div>

              <MetricGraph
                v-else-if="getTxnVolumeMetrics.length"
                :dataset="getTxnVolumeMetrics"
              />

              <div class="h5-text text-center mgt-40" v-else>
                NO TRANSACTION VOLUME DATA FOR THIS YEAR
              </div>
            </div>

            <div
              class="neutral-10-bg pd-10 position-relative"
              :class="
                loading_users_metric || !getUserVolumeMetrics.length
                  ? 'graph-wrapper'
                  : ''
              "
            >
              <div
                class="d-flex justify-content-between align-items-center mgb-25 mgt-10"
              >
                <div class="secondary-2-text pdl-4">No. of users</div>
                <div class="year-filter-wrapper position-relative">
                  <DatePicker
                    v-model="user_vol_year"
                    prefix-class="xmx"
                    class="pointer year-range"
                    valueType="format"
                    formt="YYYY"
                    type="year"
                    :disabled-date="disabledDate"
                    :clearable="false"
                    :popup-style="{ right: '0', top: '40px', left: 'auto' }"
                    :append-to-body="false"
                  >
                    <span
                      slot="icon-calendar"
                      class="icon icon-caret-fill-down h5-text"
                    ></span>
                  </DatePicker>
                </div>
              </div>

              <div class="graph-loading-container" v-if="loading_users_metric">
                <div class="skeleton-loader" v-for="i in 6" :key="i"></div>
              </div>

              <MetricGraph
                v-else-if="getUserVolumeMetrics.length"
                :dataset="getUserVolumeMetrics"
                barColor="#0B618F"
                label="Users"
              />

              <div class="h5-text text-center mgt-40" v-else>
                NO USER VOLUME DATA FOR THIS YEAR
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
    this.fetchTxnMetrics(`${new Date().getFullYear()}`);
    this.fetchUserMetrics(`${new Date().getFullYear()}`);
  },

  watch: {
    txn_vol_year: {
      handler(year) {
        this.fetchTxnMetrics(year);
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
      const year_range = [
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
      ];
      return this.txn_volume_metrics
        ? year_range.map((index) => this.txn_volume_metrics[index])
        : [];
    },

    getUserVolumeMetrics() {
      const year_range = [
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
      ];
      return this.user_metrics
        ? year_range.map((index) => this.user_metrics[index])
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
      loading_txn_metric: false,
      loading_users_metric: false,
      txn_vol_year: `${new Date().getFullYear()}`,
      user_vol_year: `${new Date().getFullYear()}`,
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

    async fetchTxnMetrics(year) {
      this.loading_txn_metric = true;
      const response = await this.fetchGraphMetrics(`year=${year}`);
      this.loading_txn_metric = false;
      if (response?.code === 200)
        this.txn_volume_metrics = response?.data?.transaction_volume;
    },

    async fetchUserMetrics(year) {
      this.loading_users_metric = true;
      const response = await this.fetchGraphMetrics(`year=${year}`);
      this.loading_users_metric = false;
      if (response?.code === 200) this.user_metrics = response?.data?.users;
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
    width: toRem(130);
  }

  .metric-graphs-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: toRem(30);
  }
}
</style>

<style lang="scss">
.year-range.xmx-datepicker {
  width: auto;
}
</style>
