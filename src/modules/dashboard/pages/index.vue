<template>
  <div>
    <div class="metric-container">
      <!-- METRICS CONTAINER -->
      <template>
        <div class="mgb-30">
          <div class="top-row mgb-20">
            <div class="page-title">Overview</div>

            <div>
              <div class="secondary-2-text" v-if="getDateShortcut">{{getDateShortcut}}</div>

              <div class="secondary-2-text" v-else>{{ formattedDateRange || 'Till Date' }}</div>
              <div class="date-wrapper mgt-10">
                <DatePicker
                  v-model="time"
                  range
                  prefix-class="xmx"
                  :formatter="{ stringify:()=>'' }"
                  :range-separator="'Date range'"
                  :placeholder="'Date range'"
                  class="pointer"
                  :clearable="false"
                  :editable="false"
                  :disabled-date="disabledDate"
                  :popup-style="{right:'0', top:'40px',left:'auto'}"
                  :append-to-body="false"
                  :shortcuts="shortcutConfig"
                >
                  <span slot="icon-calendar" class="icon icon-caret-fill-down"></span>
                </DatePicker>
              </div>
            </div>
          </div>

          <div v-if="loading_stats" class="metric-cards-container">
            <div class="metric-skeleton skeleton-loader" v-for="i in 12" :key="i"></div>
          </div>

          <div class="metric-cards-container pdy-30" v-else>
            <MetricCard v-for="metric in dashboardMetrics" :key="metric.title" :metric="metric" />
          </div>
          <div></div>
        </div>
      </template>

      <!-- GRAPH CONTAINER -->
      <template>
        <div>
          <div class="page-title mgb-25">Graphical metrics</div>

          <div class="metric-graphs-container pdy-20">
            <div class="neutral-10-bg pd-15">
              <div class="mgb-20 secondary-2-text">Transaction Volume</div>
              <MetricGraph />
            </div>

            <div class="neutral-10-bg pd-15">
              <div class="mgb-20 secondary-2-text">No. of users</div>
              <MetricGraph barColor="#0B618F" label="Users" />
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
  },

  mounted() {
    this.syncDateFilter();
    this.fetchDashboardMetrics("");
  },

  watch: {
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

    dashboardMetrics() {
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
        gbp_usd_rate,
        usd_ngn_rate,
        gbp_ngn_rate,
        dollar_exchange_balance,
        naira_exchange_balance,
        pounds_exchange_balance,
        api_keys,
        active_api_keys,
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
        {
          title: "GBP/USD rate",
          value: `${this.$money.getSign("pound")}1/${this.$money.getSign(
            "dollar"
          )}${this.$money.addComma(gbp_usd_rate)}`,
        },

        {
          title: "USD/NGN rate",
          value: `${this.$money.getSign("dollar")}1/${this.$money.getSign(
            "naira"
          )}${this.$money.addComma(usd_ngn_rate)}`,
        },
        {
          title: "GBP/NGN rate",
          value: `${this.$money.getSign("pound")}1/${this.$money.getSign(
            "naira"
          )}${this.$money.addComma(gbp_ngn_rate)}`,
        },
        {
          title: "Naira exchange balance",
          value: `${this.$money.getSign(
            "naira"
          )}${this.$string.formattedBulkUnit(naira_exchange_balance)}`,
        },
        {
          title: "Dollar exchange balance",
          value: `${this.$money.getSign(
            "naira"
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
    };
  },

  methods: {
    ...mapActions({
      fetchTransactionStats: "dashboard/fetchTransactionStats",
      fetchExchangeRates: "dashboard/fetchExchangeRates",
      fetchUsersCount: "dashboard/fetchUsersCount",
      fetchAPIkeysStats: "dashboard/fetchAPIkeysStats",
    }),

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

  .metric-graphs-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: toRem(30);
  }
}
</style>