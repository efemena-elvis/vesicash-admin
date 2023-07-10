<template>
  <div>
    <div class="filter-row mgy-30">
      <input
        type="text"
        class="form-control"
        placeholder="Search by account ID, email"
        v-model.trim="search"
      />

      <select name id class="form-control pointer" v-model="status">
        <option value="" disabled selected>Status</option>
        <option value="">All</option>
        <option
          :value="option.value"
          v-for="(option, index) in verificationStatus"
          :key="option + index"
        >
          {{ option.name }}
        </option>
      </select>

      <div class="date-wrapper">
        <div class="secondary-2-text mgb-10" v-if="getDateShortcut">
          {{ getDateShortcut }}
        </div>

        <div class="secondary-2-text mgb-10" v-else>
          {{ formattedDateRange || "Till Date" }}
        </div>
        
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

    <VerificationTable />
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import { MixinDateFilter } from "@/shared/mixins/mixin-date-filter";
import "vue2-datepicker/index.css";
import VerificationTable from "@/modules/verifications/components/verification-table";
export default {
  name: "MORVerification",

  components: {
    DatePicker,
    VerificationTable,
  },

  mixins: [MixinDateFilter],

  computed: {
    walletTypes() {
      return [
        {
          name: "Dollar",
          value: "dollar",
        },
        {
          name: "Naira",
          value: "naira",
        },
      ];
    },

    verificationStatus() {
      return [
        {
          name: "Verified",
          value: true,
        },
        {
          name: "Pending",
          value: "false",
        },
      ];
    },

    txnQueries() {
      const search = this.search;
      const type = this.type;
      const status = this.status;
      const [start, end] = this.time;
      let _start = new Date(start);
      _start.setHours(1, 0, 0, 0);
      let _end = new Date(end);
      _end.setHours(1, 0, 0, 0);
      const from = start ? Math.floor(new Date(_start).getTime() / 1000) : "";
      const to = end ? Math.floor(new Date(_end).getTime() / 1000) : "";
      // const start_date = start
      //   ? this.$date.formatDate(new Date(start), false).getSimpleDate()
      //   : "";
      // const end_date = end
      //   ? this.$date.formatDate(new Date(end), false).getSimpleDate()
      //   : "";

      return {
        type,
        search,
        from,
        to,
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

      const start_date = this.$route?.query?.from
        ? this.$date
            .formatDate(
              new Date(Number(this.$route?.query?.from) * 1000),
              false
            )
            .getSimpleDate()
        : "";

      const end_date = this.$route?.query?.to
        ? this.$date
            .formatDate(new Date(Number(this.$route?.query?.to) * 1000), false)
            .getSimpleDate()
        : "";

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

    .secondary-2-text {
      position: absolute;
      top: -20px;
      left: 0;
    }
  }
}
</style>
