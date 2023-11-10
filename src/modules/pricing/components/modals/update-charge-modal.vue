<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-md' }"
    class="update-charge-modal"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">{{ title }}</div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div>
          <div class="tertiary-2-text text-grey-900 mgb-5">Amount range</div>
          <DropSelectInput
            placeholder="Select charge range"
            :pre_select="rangeDefault"
            :options="ranges"
            @optionSelected="range_id = $event.id"
            :disabled="rangeDisabled"
          />

          <div class="tertiary-2-text text-grey-900 mgb-5 mgt-30">Currency</div>
          <DropSelectInput
            placeholder="Select currency"
            :pre_select="defaultCurrency"
            :options="currencies"
            @optionSelected="currency = $event.id"
            :disabled="currencyDisabled"
          />

          <div class="form-container mgy-30">
            <div class="position-relative">
              <BasicInput
                label_title="Card fee"
                label_id="card-fee"
                :input_value="form.card_fee"
                is_required
                :custom_options="card_charge_types"
                @selected="selectCardChargeType"
                :custom_style="{ input_wrapper_style: 'form-prefix' }"
                placeholder="Enter card fee"
                @getInputState="updateFormState($event, 'card_fee')"
                :error_handler="{
                  type: 'required',
                  message: 'Enter card fee',
                }"
              />
            </div>

            <div class="position-relative">
              <BasicInput
                label_title="Capped at"
                label_id="card-capped-at"
                :input_value="form.card_cap"
                is_required
                :custom_options="card_currency_types"
                @selected="selectCardCurrencyType"
                :custom_style="{ input_wrapper_style: 'form-prefix' }"
                placeholder="Enter cap limit"
                @getInputState="updateFormState($event, 'card_cap')"
              />
            </div>
          </div>

          <div class="form-container mgb-10">
            <div class="position-relative">
              <BasicInput
                label_title="Bank transfer fee"
                label_id="bank-transfer-fee"
                :input_value="form.bank_transfer_fee"
                is_required
                :custom_options="transfer_charge_types"
                @selected="selectTransferChargeType"
                :custom_style="{ input_wrapper_style: 'form-prefix' }"
                placeholder="Enter transfer fee"
                @getInputState="updateFormState($event, 'bank_transfer_fee')"
                :error_handler="{
                  type: 'required',
                  message: 'Enter transfer fee',
                }"
              />
            </div>

            <div class="position-relative">
              <BasicInput
                label_title="Capped at"
                label_id="transfer-capped-at"
                :input_value="form.bank_transfer_cap"
                is_required
                :custom_options="transfer_currency_types"
                @selected="selectTransferCurrencyType"
                :custom_style="{ input_wrapper_style: 'form-prefix' }"
                placeholder="Enter transfer limit"
                @getInputState="updateFormState($event, 'bank_transfer_cap')"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          class="btn btn-md btn-primary w-100 mgt-15"
          ref="save"
          @click="createNewCharge"
          :disabled="disabled"
        >
          Save
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ModalCover from "@/shared/components/modal-cover";
import BasicInput from "@/shared/components/form-comps/basic-input";
import DropSelectInput from "@/shared/components/drop-select-input";

export default {
  name: "UpdateChargeModal",

  components: {
    ModalCover,
    BasicInput,
    DropSelectInput,
  },

  props: {
    title: {
      type: String,
      default: "",
    },

    charge_details: {
      type: Object,
      default: () => ({
        range: "",
        range_id: "",
        card_fee: "",
        card_cap: "",
        bank_transfer_fee: "",
        bank_transfer_cap: "",
        currency: "",
        is_percentage_card_fee: false,
        is_percentage_transfer_fee: false,
        type: "",
      }),
    },
  },

  watch: {
    currency: {
      handler(cc) {
        const title = cc;
        const description = `Flat fee (${cc})`;
        this.card_charge_types[1].title = title;
        this.card_charge_types[1].description = description;
        this.transfer_charge_types[1].title = title;
        this.transfer_charge_types[1].description = description;
        this.card_currency_types[0].title = title;
        this.card_currency_types[0].description = title;
        this.transfer_currency_types[0].title = title;
        this.transfer_currency_types[0].description = title;
      },
    },
  },

  computed: {
    ...mapGetters({
      getMORCountries: "mor/getMORCountries",
      getChargeRanges: "pricing/getChargeRanges",
    }),

    disabled() {
      return (
        !this.currency ||
        !this.range_id ||
        Object.values(this.validity)?.some((state) => state)
      );
    },

    payload() {
      const is_percentage_card_fee =
        this.card_charge_types?.find((type) => type?.selected)?.id === 1;
      const is_percentage_bank_fee =
        this.transfer_charge_types?.find((type) => type?.selected)?.id === 1;
      return {
        range_id: this.range_id,
        card_fee: Number(this.form.card_fee),
        card_fee_capped_at: Number(this.form.card_cap),
        is_percentage_card_fee,
        bank_fee: Number(this.form.bank_transfer_fee),
        bank_fee_capped_at: Number(this.form.bank_transfer_cap),
        is_percentage_bank_fee,
        type: this.charge_details.type,
        currency: this.currency,
      };
    },

    currencies() {
      return this.getMORCountries
        ?.map((country) => {
          return {
            ...country,
            id: country.currency_code,
            name: `${country.name} ${country.currency_code}`,
          };
        })
        ?.filter((country) =>
          ["NGN", "USD", "GBP", "GHS"].includes(country.currency_code)
        );
    },

    defaultCurrency() {
      if (this.charge_details?.currency) {
        const currency = this.currencies?.find(
          (country) => country.currency_code === this.charge_details?.currency
        );
        return currency ? currency : null;
      }
      return null;
    },

    currencyDisabled() {
      return !!this.charge_details?.currency;
    },

    ranges() {
      return this.getChargeRanges?.map((range) => {
        return {
          name: `${this.$money.addComma(
            range.min_value
          )} - ${this.$money.addComma(range.max_value)}`,
          ...range,
        };
      });
    },

    rangeDefault() {
      if (this.charge_details?.range_id) {
        return {
          name: this.charge_details?.range,
          id: this.charge_details?.range_id,
        };
      }
      return null;
    },

    rangeDisabled() {
      return !!this.charge_details?.range_id;
    },
  },

  data() {
    return {
      range_id: this.charge_details?.range_id,
      currency: this.charge_details?.currency,
      selected_merchant: "",
      selected_merchants: [],
      card_charge_types: [
        {
          title: "%",
          description: "Percentage (%)",
          id: 1,
          selected: this.charge_details.is_percentage_card_fee,
        },
        {
          title: this.charge_details.currency,
          description: `Flat fee (${this.charge_details.currency})`,
          id: 2,
          selected: !this.charge_details.is_percentage_card_fee,
        },
      ],
      transfer_charge_types: [
        {
          title: "%",
          description: "Percentage (%)",
          id: 1,
          selected: this.charge_details.is_percentage_transfer_fee,
        },
        {
          title: this.charge_details.currency,
          description: `Flat fee (${this.charge_details.currency})`,
          id: 2,
          selected: !this.charge_details.is_percentage_transfer_fee,
        },
      ],
      card_currency_types: [
        {
          id: 1,
          title: this.charge_details.currency,
          description: this.charge_details.currency,
          selected: true,
        },
      ],
      transfer_currency_types: [
        {
          id: 1,
          title: this.charge_details.currency,
          description: this.charge_details.currency,
          selected: true,
        },
      ],
      form: {
        card_fee: this.charge_details.card_fee,
        card_cap: this.charge_details.card_cap,
        bank_transfer_fee: this.charge_details.bank_transfer_fee,
        bank_transfer_cap: this.charge_details.bank_transfer_cap,
      },
      validity: {
        card_fee: !this.charge_details.card_fee,
        // card_cap: !this.charge_details.card_cap,
        bank_transfer_fee: !this.charge_details.bank_transfer_fee,
        // bank_transfer_cap: !this.charge_details.bank_transfer_cap,
      },
    };
  },

  methods: {
    ...mapActions({ createCharge: "pricing/createCharge" }),

    async createNewCharge() {
      const cta = this.charge_details?.id ? "Update" : "Create";

      try {
        const payload = this.charge_details?.id
          ? { ...this.payload, id: this.charge_details?.id }
          : { ...this.payload };
        this.handleClick("save");
        const response = await this.createCharge(payload);
        const status = response?.code === 200 ? "success" : "warning";
        const message =
          response?.code === 200
            ? response?.message
            : response?.data || response?.message;
        this.pushToast(message, status);
        this.handleClick("save", cta, false);
        if (response?.code == 200) this.$emit("done");
        if (this.charge_details?.id && response?.code == 200)
          this.$emit("closeTriggered");
      } catch (err) {
        this.handleClick("save", cta, false);
        this.pushToast("Failed!!!", "error");
        console.log("Error creating new charge", err);
      }
    },

    selectCardChargeType(item) {
      this.card_charge_types = this.card_charge_types?.map((type) => {
        return { ...type, selected: item.id === type.id };
      });
    },

    selectTransferChargeType(item) {
      this.transfer_charge_types = this.transfer_charge_types?.map((type) => {
        return { ...type, selected: item.id === type.id };
      });
    },

    selectCardCurrencyType(item) {
      this.card_currency_types = this.card_currency_types?.map((type) => {
        return { ...type, selected: item.id === type.id };
      });
    },

    selectTransferCurrencyType(item) {
      this.transfer_currency_types = this.transfer_currency_types?.map(
        (type) => {
          return { ...type, selected: item.id === type.id };
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.range-card {
  padding: toRem(7) toRem(14);
  border: dashed 1px getColor("grey-900");
  background-color: getColor("grey-50");
}

.form-container {
  border: toRem(1) solid getColor("grey-900");
  padding: toRem(15);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: toRem(20);
}
</style>

<style lang="scss">
.update-charge-modal.modal-overlay {
  .modal-outer-container {
    top: toRem(10);
    margin-bottom: toRem(20);
  }
}
</style>
