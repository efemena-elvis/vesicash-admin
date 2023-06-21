<template>
  <div>
    <div class="filter-row mgy-30">
      <input
        type="text"
        class="form-control"
        placeholder="Search by reference ID"
        v-model.trim="search"
      />

      <select name id class="form-control pointer" v-model="type">
        <option value disabled>Wallet Type</option>
        <option value="">All</option>
        <option
          :value="option.value"
          v-for="(option, index) in walletTypes"
          :key="option.name + index"
        >
          {{ option.name }}
        </option>
      </select>

      <select name id class="form-control pointer" v-model="status">
        <option value="" disabled selected>Status</option>
        <option value="">All</option>
        <option
          :value="option.value"
          v-for="(option, index) in payoutStatus"
          :key="option + index"
        >
          {{ option.name }}
        </option>
      </select>

      <div class="date-wrapper">
        <DatePicker
          v-model="time"
          range
          prefix-class="xmx"
          :formatter="{ stringify: () => '' }"
          :range-separator="'Date range'"
          :placeholder="'Disabled'"
          class="pointer"
          :clearable="false"
          :editable="false"
          :disabled-date="disabledDate"
          :popup-style="{ right: '0', top: '40px', left: 'auto' }"
          :append-to-body="false"
          :shortcuts="shortcutConfig"
          disabled
        >
          <span slot="icon-calendar" class="icon icon-caret-fill-down"></span>
        </DatePicker>
      </div>
    </div>

    <MorPayoutsTable />
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import { MixinDateFilter } from "@/shared/mixins/mixin-date-filter";
import "vue2-datepicker/index.css";
import MorPayoutsTable from "@/modules/mor/components/mor-payouts-table";
import { mapGetters } from "vuex";

export default {
  name: "MORTransactions",

  components: {
    DatePicker,
    MorPayoutsTable,
  },

  mixins: [MixinDateFilter],

  computed: {
    ...mapGetters({
      getMORCountries: "mor/getMORCountries",
    }),

    walletTypes() {
      return this.getMORCountries?.map((item) => ({
        value: item.currency_code,
        id: item.currency_code,
        name: `${item.name} ${item.currency_code}`,
      }));
    },

    payoutStatus() {
      return [
        {
          name: "Successful",
          value: "successful",
        },
        {
          name: "Pending",
          value: "pending",
        },
        {
          name: "Failed",
          value: "failed",
        },
      ];
    },

    txnQueries() {
      const search = this.search;
      const currency = this.type;
      const status = this.status;
      const [start, end] = this.time;
      const start_date = start
        ? this.$date.formatDate(new Date(start), false).getSimpleDate()
        : "";
      const end_date = end
        ? this.$date.formatDate(new Date(end), false).getSimpleDate()
        : "";

      return {
        currency,
        search,
        start_date,
        end_date,
        status,
        page: 1,
      };
    },
  },
  watch: {
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
      search: "",
      type: "",
      status: "",
      show_date_range: false,
      date_shortcut: "",
    };
  },

  methods: {
    syncFilterInputs() {
      this.search = this.$route?.query?.search || "";
      this.status = this.$route?.query?.status || "";
      this.type = this.$route?.query?.type || "";
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
    grid-template-columns: 0.28fr 0.32fr minmax(0, 0.4fr);

    & > :nth-child(1) {
      grid-column: 1 / span 3;
      order: 4;
      width: 100%;
    }

    & > :nth-child(4) {
      width: 80%;
    }
  }

  .date-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
  }

  .icon-caret-fill-down {
    font-size: toRem(24);
    color: getColor("neutral-900");
  }
}
</style>
