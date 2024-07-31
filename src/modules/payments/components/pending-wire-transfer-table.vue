<template>
  <div class="neutral-10-bg wire-table mgt-20">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="wire-tb"
      :table_data="wire_transfers"
      :table_header="table_header"
      :is_loading="table_loading"
      :empty_message="getEmptyMessage"
      show_paging
      :pagination="getPagination"
      @goToPage="updatePage"
    >
      <template v-for="(data, index) in pendingWireTransfers">
        <TransactionTableRow
          :key="index"
          table_name="wire-tb"
          :data="data"
          @refresh="fetchWireTransfers"
          :index="index + 1 + (page - 1) * per_page"
        />
      </template>
    </TableContainer>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import TableContainer from "@/shared/components/table-comps/table-container";

export default {
  name: "PendingWireTransferTable",

  components: {
    TableContainer,

    TransactionTableRow: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/payments/components/pending-wire-transfer-table-row"
      ),
  },

  props: {},

  computed: {
    getEmptyMessage() {
      return "No pending wire transfers";
    },

    pendingWireTransfers() {
      return this.wire_transfers.map((item) => {
        const tf_date = this.$date?.formatDate(
          new Date(item?.created_at),
          false
        );

        const date = tf_date?.getSimpleFormatDate();
        const reference = item.reference;
        const currency = item.currency;
        const amount = `${this.$money.getSign(currency)}${this.$money.addComma(
          item.amount
        )}`;
        const account_number = item.account_number;
        const account_name = item.account_name;
        const status = item.status;

        return {
          ...item,
          date,
          reference,
          currency,
          amount,
          account_number,
          account_name,
          status,
        };
      });
    },

    getPagination() {
      if (!this.pagination) return null;
      return {
        current_page: this.page,
        per_page: 15,
        last_page: this.pagination?.total_pages_count || 0,
        from: 0,
        to: 0,
        total: 0,
      };
    },
  },

  watch: {
    "$route.query.page": {
      handler(page) {
        if (page) this.page = Number(page);
      },
      immediate: true,
      deep: true,
    },
  },

  data() {
    return {
      table_header: [
        "#",
        "Date",
        "Reference ID",
        "Account name",
        "Account number",
        "Amount",
        "Status",
        "Action",
      ],
      wire_transfers: [],
      table_loading: false,
      page: 1,
      per_page: 15,
      pagination: null,
    };
  },

  mounted() {
    this.fetchWireTransfers(this.page);
  },

  methods: {
    ...mapActions({ loadWireTransfers: "transaction/loadWireTransfers" }),

    updatePage(page) {
      this.page = Number(page);
      const query = { ...this.$route?.query, page };
      this.$router.replace({
        path: this.$route.path,
        query: { ...query },
      });
      this.fetchWireTransfers(page);
    },

    async fetchWireTransfers(page) {
      const _query = decodeURIComponent(location.search);
      this.table_loading = true;

      try {
        const _response = await this.loadWireTransfers(page);
        this.table_loading = false;
        const response = _response?.data || _response;
        if (
          response.code === 200 &&
          _query === decodeURIComponent(location.search)
        ) {
          this.wire_transfers = response?.data;
          this.pagination = response?.pagination;
        }
      } catch (e) {
        this.table_loading = false;
        console.log("FAILED TO LOAD WIRES", e);
      }
    },
  },
};
</script>

<style lang="scss">
.wire-tb {
  &-1 {
    min-width: toRem(50);
    max-width: toRem(90);
  }

  &-3 {
    max-width: toRem(300);
  }

  &-2 &-5,
  &-6 {
    max-width: toRem(200);
    min-width: toRem(160);
  }

  &-4 {
    max-width: toRem(250);
    min-width: toRem(200);
  }

  &-7 {
    min-width: toRem(100);
  }

  .head-data {
    padding: toRem(13) toRem(22) !important;
  }

  .body-data {
    padding: toRem(10) toRem(22) !important;
  }
}
</style>
