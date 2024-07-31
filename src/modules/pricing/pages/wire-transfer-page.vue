<template>
  <div class="wire-layout">
    <div class="create-account-wrapper">
      <button
        class="btn btn-md btn-primary ml-auto block"
        @click="createWireAccount"
      >
        Create new wire account
      </button>
    </div>

    <div class="my-3">
      <WireAccountTable
        :accounts="wire_accounts"
        :table_loading="loading_accounts"
        @deleted="loadAccounts"
        @edit="editAccount"
      />
    </div>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_create_modal">
        <WireTransferAccountModal
          :default_country_banks="default_country_banks"
          :default_country_code="default_country_code"
          @closeTriggered="toggleWireTransfer"
          :update="update"
          @refresh="refresh"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import WireTransferAccountModal from "@/modules/pricing/components/modals/create-wire-transfer-account-modal";
import WireAccountTable from "@/modules/pricing/components/wire-account-table";
import countries from "@/utilities/countries";

export default {
  name: "WireTransfers",

  components: {
    WireTransferAccountModal,
    WireAccountTable,
  },

  mounted() {
    this.loadDefaultCountryBanks("ng");
    this.loadAccounts();
  },

  data() {
    return {
      show_create_modal: false,
      default_country_banks: [],
      default_country_code: "ng",
      wire_accounts: [],
      loading_accounts: false,
      update: null,
      countries,
    };
  },

  methods: {
    ...mapActions({
      loadCountryBanks: "transaction/loadCountryBanks",
      loadWireAccounts: "transaction/loadWireAccounts",
    }),

    refresh() {
      this.show_create_modal = false;
      this.loadAccounts();
    },

    createWireAccount() {
      this.update = null;
      this.show_create_modal = true;
    },

    editAccount(account) {
      this.update = account;

      const code = this.countries.find(
        (item) => account.currency === item.currency.short
      )?.code;
      if (!code) {
        this.pushToast("Cant update", "warning");
        return;
      }

      if (code !== "ng") this.default_country_banks = [];
      this.default_country_code = code;
      this.show_create_modal = true;
    },

    toggleWireTransfer() {
      this.show_create_modal = !this.show_create_modal;
    },

    async loadDefaultCountryBanks(code) {
      try {
        const response = await this.loadCountryBanks(code);
        if (response?.code === 200) {
          this.default_country_banks = response?.data;
        }
      } catch (e) {
        console.log("FAILED TO LOAD BANKS FOR ", code);
      }
    },

    async loadAccounts() {
      try {
        this.loading_accounts = true;
        const _response = await this.loadWireAccounts();
        const response = _response?.data || _response;
        this.loading_accounts = false;
        if (response?.code === 200) {
          this.wire_accounts = response?.data;
        }
      } catch (e) {
        this.loading_accounts = false;
        console.log("FAILED TO LOAD WIRE ACCOUNT FOR ", code);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wire-layout {
  margin-top: toRem(30);

  .create-account-wrapper {
    @include flex-row-end-nowrap();
  }
}
</style>
