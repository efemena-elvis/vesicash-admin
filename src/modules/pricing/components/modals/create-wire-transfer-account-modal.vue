<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-md' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">
          {{ update ? "Update" : "Create" }} wire transfer account
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="form-group">
          <div class="form-label">Currency</div>
          <DropSelectInput
            placeholder="Currency"
            :options="currencies"
            @optionSelected="loadSelectedCountryBanks"
            :pre_select="defaultCurrency"
          />
        </div>

        <div
          class="skeleton-loader bank-skeleton my-2"
          v-if="loading_banks"
        ></div>

        <div class="form-group" v-else>
          <div class="form-label">Bank</div>
          <DropSelectInput
            placeholder="Select bank"
            :options="selectedCountryBanks"
            @optionSelected="setSelectedBank"
            allow_search
            @searchItem="banks_search_key = $event"
            :pre_select="defaultBank"
          />
        </div>

        <div class="form-group">
          <BasicInput
            label_id="account_number"
            label_title="Account number"
            :input_value="form.account_number"
            placeholder="0159494476"
            input_type="number"
            @getInputState="updateFormState($event, 'account_number')"
            :error_handler="{
              type: 'required',
              message: 'Account number required',
            }"
          />
        </div>

        <div class="form-group">
          <BasicInput
            label_id="account_name"
            label_title="Beneficiary name"
            :input_value="form.account_name"
            placeholder="Yusuf Rilwan"
            @getInputState="updateFormState($event, 'account_name')"
            :error_handler="{
              type: 'required',
              message: 'Beneficiary name required',
            }"
          />
        </div>

        <div class="form-group">
          <BasicInput
            label_id="min_amount_threshold"
            label_title="Minimum amount"
            :input_value="form.amount"
            placeholder="500.00"
            input_type="number"
            :custom_style="{ input_style: 'right-text' }"
            @getInputState="updateFormState($event, 'amount')"
            :error_handler="{
              type: 'required',
              message: 'Minimum amount required',
            }"
          />
        </div>
      </div>
    </template>
    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          class="btn btn-md btn-primary w-100 mgt-15"
          ref="create"
          :disabled="disabled"
          @click="update ? updateAccount() : createAccount()"
        >
          {{ update ? "Update" : "Create" }} wire account
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions } from "vuex";
import ModalCover from "@/shared/components/modal-cover";
import DropSelectInput from "@/shared/components/drop-select-input";
import BasicInput from "@/shared/components/form-comps/basic-input";
import countries from "@/utilities/countries";

export default {
  name: "CreateWireTransferAccountModal",

  props: {
    default_country_banks: {
      type: Array,
      default: () => [],
    },

    default_country_code: {
      type: String,
      default: "ng",
    },

    update: {
      type: Object,
      default: () => null,
    },
  },

  components: {
    ModalCover,
    DropSelectInput,
    BasicInput,
  },

  mounted() {
    if (this.default_country_banks?.length) {
      this.updateBankList(
        this.default_country_banks,
        this.default_country_code
      );
      return;
    }
    this.loadBanks(this.default_country_code);
  },

  computed: {
    currencies() {
      return this.countries?.map((item) => {
        const currency = {
          name: `${item.currency.short} (${item.currency.sign})`,
          code: item.code,
          id: item.code,
        };
        return currency;
      });
    },

    selectedCurrency() {
      const item = this.countries.find(
        (item) => item.code === this.selected_country_code
      );
      return item?.currency?.short;
    },

    defaultCurrency() {
      const item = this.countries.find(
        (item) => item.code === this.default_country_code
      );
      return item
        ? {
            name: `${item.currency.short} (${item.currency.sign})`,
            code: item.code,
            id: item.code,
          }
        : null;
    },

    defaultBank() {
      if (!this.update) return null;
      const bank = this.selectedCountryBanks?.find(
        (item) => item.name === this.update?.bank_name
      );
      return bank ? bank : null;
    },

    selectedCountryBanks() {
      const code = this.selected_country_code;
      return this.banks?.[code]
        ? this.banks?.[code].filter((bank) =>
            bank?.name
              ?.toLowerCase()
              .includes(this.banks_search_key.toLowerCase())
          )
        : [];
    },

    wireAccountPayload() {
      return {
        min_amount_threshold: Number(this.form.amount),
        currency: this.selectedCurrency,
        beneficiary_name: this.form.account_name,
        account_number: this.form.account_number,
        bank_name: this.selected_bank?.name || this.defaultBank?.name,
        sort_code: this.selected_bank?.code || this.defaultBank?.code,
      };
    },

    disabled() {
      const form_valid = Object.values(this.validity).every((item) => !item);
      return (
        (!this.selected_bank && !this.defaultBank) ||
        !this.selectedCurrency ||
        !form_valid
      );
    },
  },

  data() {
    return {
      banks: null,
      banks_search_key: "",
      countries,
      loading_banks: false,
      selected_country_code: this.default_country_code,
      selected_bank: null,
      form: {
        amount: this.update?.min_amount_threshold || "",
        account_number: this.update?.account_number || "",
        account_name: this.update?.beneficiary_name || "",
      },
      validity: {
        amount: !this.update?.min_amount_threshold,
        account_number: !this.update?.account_number,
        account_name: !this.update?.beneficiary_name,
      },
    };
  },

  methods: {
    ...mapActions({
      loadCountryBanks: "transaction/loadCountryBanks",
      createWireAccount: "transaction/createWireAccount",
      updateWireAccount: "transaction/updateWireAccount",
    }),

    updateBankList(list, code) {
      if (this.banks) this.banks[code] = list;
      else this.banks = { [code]: list };
    },

    async loadBanks(code) {
      if (this.banks?.[code]) return;

      try {
        this.loading_banks = true;
        const response = await this.loadCountryBanks(code);
        this.loading_banks = false;
        if (response?.code === 200) {
          this.updateBankList(response.data, code);
        }
      } catch (e) {
        console.log("FAILED TO LOAD BANK FOR ", code);
        this.loading_banks = false;
      }
    },

    loadSelectedCountryBanks({ code }) {
      this.selected_bank = null;
      this.selected_country_code = code;
      this.loadBanks(code);
    },

    setSelectedBank(bank) {
      this.selected_bank = bank;
    },

    async updateAccount() {
      try {
        this.handleClick("create");
        const response = await this.updateWireAccount({
          payload: this.wireAccountPayload,
          id: this.update?.id,
        });
        this.handleClick("create", "Update wire account", false);
        const message = response?.data?.message || response?.message;
        const type = response?.code === 200 ? "success" : "warning";
        this.pushToast(message, type);
        if (response?.code === 200) {
          this.$emit("refresh");
        }
      } catch (e) {
        this.handleClick("create", "Update wire account", false);
        console.log("ERROR UPDATING WIRE ACCOUNT", e);
        this.pushToast("Failed to update wire account", "error");
      }
    },

    async createAccount() {
      try {
        this.handleClick("create");
        const response = await this.createWireAccount(this.wireAccountPayload);
        this.handleClick("create", "Create wire account", false);
        const message = response?.data?.message || response?.message;
        const type = response?.code === 200 ? "success" : "warning";
        this.pushToast(message, type);
        if (response?.code === 200) {
          this.$emit("refresh");
        }
      } catch (e) {
        this.handleClick("create", "Create wire account", false);
        console.log("ERROR CREATING WIRE ACCOUNT", e);
        this.pushToast("Failed to create wire account", "error");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bank-skeleton {
  height: toRem(45);
}
</style>
