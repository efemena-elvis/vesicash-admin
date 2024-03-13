<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-md' }"
    class="update-fee-modal"
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
          <div class="tertiary-2-text text-grey-900 mgb-5">Currency</div>
          <DropSelectInput
            placeholder="Select currency"
            :pre_select="defaultCurrency"
            :options="currencies"
            @optionSelected="currency = $event.id"
            :disabled="currencyDisabled"
          />

          <div class="tertiary-2-text text-grey-900 mgb-5 mgt-30">
            Amount range
          </div>
          <DropSelectInput
            placeholder="Select charge range"
            :pre_select="rangeDefault"
            :options="ranges"
            @optionSelected="range_id = $event.id"
            :disabled="rangeDisabled"
            :clear_selection="clear_range"
          />

          <div class="form-container mgy-30">
            <div class="position-relative">
              <BasicInput
                label_title="Fee"
                label_id="fee"
                :input_value="form.fee"
                is_required
                :custom_options="fee_types"
                @selected="selectFeeType"
                :custom_style="{ input_wrapper_style: 'form-prefix' }"
                placeholder="Enter fee"
                @getInputState="updateFormState($event, 'fee')"
                :error_handler="{
                  type: 'required',
                  message: 'Enter fee',
                }"
              />
            </div>

            <div class="position-relative">
              <BasicInput
                label_title="Capped at"
                label_id="capped-at"
                :input_value="form.cap"
                is_required
                :custom_options="currency_types"
                @selected="selectCurrencyType"
                :custom_style="{ input_wrapper_style: 'form-prefix' }"
                placeholder="Enter cap limit"
                @getInputState="updateFormState($event, 'cap')"
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
          {{ charge_details.id ? "Update" : "Create" }}
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
  name: "UpdateFeeModal",

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
        fee: "",
        cap: "",
        currency: "",
        is_percentage_fee: false,
        type: "",
      }),
    },
  },

  watch: {
    currency: {
      handler(cc) {
        const title = cc;
        const description = `Flat fee (${cc})`;
        this.fee_types[1].title = title;
        this.fee_types[1].description = description;
        this.currency_types[0].title = title;
        this.currency_types[0].description = title;

        const range_id = this.range_id;
        const valid_id = this.ranges?.some((range) => range.id == range_id);

        if (!!range_id && !valid_id) {
          this.clear_range = true;
          this.range_id = "";
        }
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
      const is_percentage_fee =
        this.fee_types?.find((type) => type?.selected)?.id === 1;
      return {
        range_id: this.range_id,
        fee: Number(this.form.fee),
        fee_capped_at: Number(this.form.cap),
        is_percentage_fee,
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
      if (!this.defaultCurrency && !this.currency) return [];

      const foreign_currencies = ["GBP", "USD"];

      const filtered_range = this.getChargeRanges?.filter(
        (range) =>
          foreign_currencies.includes(this.currency) ||
          Number(range.max_value) >= 1000
      );

      return filtered_range?.map((range) => {
        return {
          name:
            range.max_value > 0
              ? `${this.$money.addComma(
                  range.min_value
                )} - ${this.$money.addComma(range.max_value)}`
              : `> ${this.$money.addComma(range.min_value - 1)}`,
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
      clear_range: false,
      range_id: this.charge_details?.range_id,
      currency: this.charge_details?.currency,
      selected_merchant: "",
      selected_merchants: [],
      fee_types: [
        {
          title: "%",
          description: "Percentage (%)",
          id: 1,
          selected: this.charge_details.is_percentage_fee,
        },
        {
          title: this.charge_details.currency,
          description: `Flat fee (${this.charge_details.currency})`,
          id: 2,
          selected: !this.charge_details.is_percentage_fee,
        },
      ],

      currency_types: [
        {
          id: 1,
          title: this.charge_details.currency,
          description: this.charge_details.currency,
          selected: true,
        },
      ],

      form: {
        fee: this.charge_details.fee,
        cap: this.charge_details.cap,
      },
      validity: {
        fee: !this.charge_details.fee,
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

    selectFeeType(item) {
      this.fee_types = this.fee_types?.map((type) => {
        return { ...type, selected: item.id === type.id };
      });
    },

    selectCurrencyType(item) {
      this.currency_types = this.currency_types?.map((type) => {
        return { ...type, selected: item.id === type.id };
      });
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
.update-fee-modal.modal-overlay {
  .modal-outer-container {
    top: toRem(40);
    margin-bottom: toRem(20);
  }
}
</style>
