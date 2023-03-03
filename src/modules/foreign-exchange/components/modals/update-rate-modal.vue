<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-xs' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Update Rate</div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="form-group">
          <div class="form-label">Transaction type</div>
          <DropSelectInput
            placeholder="USD to NGN"
            :options="fxRateOptions"
            @optionSelected="selected_rate = $event.id"
          />
        </div>

        <div class="form-group">
          <div class="form-label">Initial ({{ initialSign }})</div>
          <BasicInput
            label_id="initialCurrency"
            :input_value="form.initial"
            placeholder="1.00"
            input_type="number"
            is_disabled
            :custom_style="{ input_style: 'right-text' }"
            @getInputState="updateFormState($event, 'initial')"
            :error_handler="{
              type: 'required',
              message: 'Initial amount required',
            }"
          />
        </div>

        <div class="form-group">
          <div class="form-label">Final ({{ finalSign }})</div>
          <BasicInput
            label_title=""
            label_id="finalCurrency"
            :input_value="form.final"
            input_type="number"
            placeholder="0.00"
            :custom_style="{ input_style: 'right-text' }"
            @getInputState="updateFormState($event, 'final')"
            :error_handler="{
              type: 'required',
              message: 'Final amount required',
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
          :disabled="!form.final"
          ref="update"
          @click="changeFXRate"
        >
          Update rate
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DropSelectInput from "@/shared/components/drop-select-input";
import BasicInput from "@/shared/components/form-comps/basic-input";
import ModalCover from "@/shared/components/modal-cover";

export default {
  name: "UpdateRateModal",

  components: {
    ModalCover,
    DropSelectInput,
    BasicInput,
  },

  computed: {
    ...mapGetters({ getFXStats: "fx/getFXStats" }),

    initialSign() {
      const currency = this.selected_rate?.split("_")[0];
      return this.$money?.getSign(currency);
    },

    initialCode() {
      const currency = this.selected_rate?.split("_")[0];
      return this.$money?.getCode(currency);
    },

    finalSign() {
      const currency = this.selected_rate?.split("_")[1];
      return this.$money?.getSign(currency);
    },

    finalCode() {
      const currency = this.selected_rate?.split("_")[1];
      return this.$money?.getCode(currency);
    },

    updatePayload() {
      return {
        from_currency: this.initialCode,
        to_currency: this.finalCode,
        initial_amount: "1.00",
        final_amount: this.form.final,
      };
    },

    fxRateOptions() {
      return [
        {
          id: "dollar_naira",
          name: "USD to NGN",
        },
        {
          id: "naira_dollar",
          name: "NGN to USD",
        },

        {
          id: "naira_pound",
          name: "NGN to GBP",
        },
        {
          id: "pound_naira",
          name: "GBP to NGN",
        },
        {
          id: "dollar_pound",
          name: "USD to GBP",
        },
        {
          id: "pound_dollar",
          name: "GBP to USD",
        },
      ];
    },
  },

  watch: {
    selected_rate: {
      handler(rate) {
        const _rate = this.getFXStats[rate];
        this.form.final = _rate;
      },
      immediate: true,
    },
  },

  data() {
    return {
      selected_rate: "dollar_naira",
      form: {
        initial: "",
        final: "",
      },

      validity: {
        initial: false,
        final: false,
      },
    };
  },

  methods: {
    ...mapActions({ updateRate: "fx/updateRate" }),

    async changeFXRate() {
      this.handleClick("update");
      try {
        const response = await this.updateRate(this.updatePayload);
        this.handleClick("update", "Update rate", false);
        const type = response?.code === 200 ? "success" : "warning";
        const message = response?.message;
        this.pushToast(message, type);

        if (response?.code === 200) {
          this.$emit("updateRate");
          this.$emit("closeTriggered");
        }
      } catch (err) {
        this.handleClick("update", "Update rate", false);
        console.log("FAILED TO UPDATE RATE", err);
        this.pushToast("Failed to update rate", "error");
      }
    },
  },
};
</script>

<style lang="scss">
.right-text {
  text-align: right;
}
</style>
