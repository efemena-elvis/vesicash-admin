<template>
  <div class="neutral-10-bg wire-table">
    <!-- TABLE CONTAINER -->
    <TableContainer
      table_name="wire-table"
      :table_data="accounts"
      :table_header="table_header"
      :is_loading="table_loading"
      :empty_message="getEmptyMessage"
      :show_paging="false"
      :pagination="null"
    >
      <template v-for="(data, index) in accounts">
        <WireAccountTableRow
          :key="index"
          table_name="wire-table"
          :data="data"
          :index="index + 1"
          @deleted="$emit('deleted')"
          @edit="$emit('edit', $event)"
        />
      </template>
    </TableContainer>
  </div>
</template>

<script>
import TableContainer from "@/shared/components/table-comps/table-container";

export default {
  name: "WireAccountsTable",

  components: {
    TableContainer,

    WireAccountTableRow: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/pricing/components/wire-account-table-row"
      ),
  },

  props: {
    table_loading: {
      type: Boolean,
      default: false,
    },

    accounts: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    getEmptyMessage() {
      return "No wire accounts";
    },
  },

  data() {
    return {
      table_header: [
        "#",
        "Date",
        "Currency",
        "Bank name",
        "Account number",
        "Beneficiary name",
        "Minimum amount",
        "Action",
      ],
    };
  },
};
</script>

<style lang="scss">
.wire-table {
  min-height: 65vh;
  border: toRem(1) solid getColor("grey-100");
}

.wire-table {
  &-1 {
    min-width: toRem(50);
    max-width: toRem(90);
  }

  &-3 {
    max-width: toRem(200);
  }
  &-2,
  &-5,
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
