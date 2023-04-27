<template>
  <div>
    <div class="top-row">
      <div class="page-title">Transactions</div>
    </div>

    <RouteTabSwitcher
      query_key="tx_type"
      controlled
      :tabs="transactionTypeTabs"
    />

    <div
      class="filter-row mgt-20 mgb-40"
      :class="isPending ? 'pending-filter-row' : ''"
    >
      <input
        type="text"
        class="form-control search-box"
        placeholder="Search account ID"
        v-model.trim="search"
        v-if="isPending"
      />
      <select
        name
        id
        class="form-control pointer"
        v-model="wallet_type"
        v-if="!isPending"
      >
        <option value="NGN">NGN Wallet</option>
        <option value="USD">USD Wallet</option>
        <option value="GBP">GBP Wallet</option>
        <option value="ESCROW_NGN">NGN Escrow Wallet</option>
        <option value="ESCROW_USD">USD Escrow Wallet</option>
        <option value="ESCROW_GBP">GBP Escrow Wallet</option>
      </select>

      <select
        name
        id
        class="form-control text-capitalize pointer"
        v-model="payment_entry"
        v-if="!isPending"
      >
        <option
          :value="option"
          v-for="option in paymentEntry"
          :key="option"
          class="text-capitalize"
        >
          {{ option }}
        </option>
      </select>

      <select
        name
        id
        class="form-control pointer"
        v-model="status"
        v-if="isPending"
      >
        <option value="" disabled selected>Status</option>
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="yes">Approved</option>
        <option value="no">Rejected</option>
      </select>

      <select name id class="form-control pointer" v-model="status" v-else>
        <option value="" disabled selected>Status</option>
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="failed">Failed</option>
      </select>

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
          class="pointer tx-filter"
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

    <PendingTransactionTable v-if="isPending" />

    <TransactionTable v-else />
  </div>
</template>

<script>
import RouteTabSwitcher from "@/shared/components/route-tab-switcher";
import DatePicker from "vue2-datepicker";
import { MixinDateFilter } from "@/shared/mixins/mixin-date-filter";
import TransactionTable from "@/modules/payments/components/transaction-table";
import PendingTransactionTable from "@/modules/payments/components/pending-transaction-table";
import "vue2-datepicker/index.css";
export default {
  name: "Payments",

  mixins: [MixinDateFilter],

  components: {
    RouteTabSwitcher,
    DatePicker,
    TransactionTable,
    PendingTransactionTable,
  },

  computed: {
    isPending() {
      return this.$route?.query?.tx_type === "pending";
    },

    paymentEntry() {
      if (["ESCROW_NGN", "ESCROW_USD", "ESCROW_GBP"].includes(this.wallet_type))
        return ["escrow"];
      if (this.$route?.query?.tx_type === "outflow")
        return ["escrow", "transfer", "exchange"];
      return ["funding", "escrow", "transfer", "exchange"];
    },

    txnQueries() {
      const wallet_type = this.wallet_type;
      const tx_type = this.$route?.query?.tx_type || "inflow";
      const payment_entry = this.payment_entry;
      const status = this.status;
      const [start, end] = this.time;
      const start_date = start
        ? this.$date.formatDate(new Date(start), false).getSimpleDate()
        : "";
      const end_date = end
        ? this.$date.formatDate(new Date(end), false).getSimpleDate()
        : "";
      const search = this.search;

      return {
        wallet_type,
        tx_type,
        payment_entry,
        start_date,
        end_date,
        status,
        search,
        page: 1,
      };
    },

    transactionTypeTabs() {
      return [
        {
          name: "Inflow",
          active:
            !this.$route?.query?.tx_type ||
            this.$route?.query?.tx_type === "inflow",
        },

        {
          name: "Outflow",
          active: this.$route?.query?.tx_type === "outflow",
        },

        {
          name: "Pending",
          active: this.$route?.query?.tx_type === "pending",
        },
      ];
    },
  },

  watch: {
    isPending: {
      handler(pending) {
        if (pending) {
          this.wallet_type = this.payment_entry = "";
          this.time = [];
          this.status = "pending";
        } else {
          this.wallet_type = "NGN";
          (this.payment_entry = "funding"), (this.status = this.search = "");
          this.time = [];
        }
      },
    },

    paymentEntry: {
      handler(entries) {
        if (!entries?.includes(this.payment_entry) && !this.isPending)
          this.payment_entry = entries[0];
      },
    },

    txnQueries: {
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
      wallet_type: "NGN",
      payment_entry: "funding",
      status: "",
      show_date_range: false,
      date_shortcut: "",
      search: "",
    };
  },

  methods: {
    syncFilterInputs() {
      this.wallet_type = this.$route?.query?.wallet_type || "NGN";
      this.payment_entry = this.$route?.query?.payment_entry;
      this.status = this.$route?.query?.status || "";
      const start_date = this.$route?.query?.start_date || "";
      const end_date = this.$route?.query?.end_date || "";
      this.time = [start_date, end_date];
      this.search = this.$route?.query?.search || "";
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

.filter-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: toRem(20);
  align-items: flex-end;

  @include breakpoint-down(md) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.pending-filter-row {
  grid-template-columns: minmax(auto, toRem(400)) repeat(2, 1fr);
  gap: toRem(30);

  @include breakpoint-custom-down(900) {
    grid-template-columns: repeat(2, 1fr);
  }

  .search-box {
    width: 90%;
    @include breakpoint-custom-down(900) {
      order: 3;
      grid-column: 1/-1;
      width: 100%;
    }
  }
}

.date-wrapper {
  position: relative;
  margin-left: auto;
}
</style>

<style lang="scss">
.tx-filter.xmx-datepicker-range {
  width: toRem(220);

  @include breakpoint-down(sm) {
    width: auto;
  }
}
</style>
