<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-md' }"
    class="record-transaction-modal"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Record Transaction</div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="full-width">
          <div class="form-label">Merchant</div>
          <DropSelectInput
            placeholder="Select a merchant"
            :options="vesicashMerchants"
            @optionSelected="account_id = $event.id"
          />

          <!-- <BasicInput
            label_id="merchantID"
            :input_value="form.merchant_name"
            placeholder="Enter merchant name"
            @getInputState="updateFormState($event, 'merchant_name')"
            :error_handler="{
              type: 'required',
              message: 'Enter merchant name',
            }"
          /> -->
        </div>

        <div>
          <div class="form-label">Transaction creation date</div>
          <input
            type="date"
            name="creationDate"
            id="creationDate"
            class="form-control"
            v-model="transaction_date"
            :max="today"
          />
        </div>

        <div>
          <div class="form-label">Reference ID</div>
          <BasicInput
            label_id="referenceID"
            :input_value="form.reference_id"
            placeholder="Enter reference ID"
            @getInputState="updateFormState($event, 'reference_id')"
            :error_handler="{
              type: 'required',
              message: 'Enter reference ID',
            }"
          />
        </div>

        <div>
          <div class="form-label">Country of transaction</div>
          <DropSelectInput
            placeholder="Nigeria"
            :options="morCountries"
            @optionSelected="transaction_country = $event.id"
          />
        </div>

        <!-- <div>
          <div class="form-label">Currency of transaction</div>
          <DropSelectInput
            placeholder="Naira"
            :options="morCurrencyOptions"
            @optionSelected="transaction_currency = $event.id"
          />
        </div> -->

        <div>
          <div class="form-label">Total Amount Paid</div>
          <BasicInput
            label_id="totalAmount"
            :input_value="form.amount"
            placeholder="1.00"
            input_type="number"
            :custom_style="{ input_style: 'right-text' }"
            @getInputState="updateFormState($event, 'amount')"
            :error_handler="{
              type: 'required',
              message: 'Total amount required',
            }"
          />
        </div>

        <div>
          <div class="form-label">Tax Fee</div>
          <BasicInput
            label_title=""
            label_id="taxFee"
            :input_value="form.tax"
            input_type="number"
            placeholder="0.00"
            :custom_style="{ input_style: 'right-text' }"
            @getInputState="updateFormState($event, 'tax')"
            :error_handler="{
              type: 'required',
              message: 'Tax fee required',
            }"
          />
        </div>

        <div>
          <div class="form-label">Processing Fee</div>
          <BasicInput
            label_title=""
            label_id="processingFee"
            :input_value="form.fee"
            input_type="number"
            placeholder="0.00"
            :custom_style="{ input_style: 'right-text' }"
            @getInputState="updateFormState($event, 'fee')"
            :error_handler="{
              type: 'required',
              message: 'Processing fee required',
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
          :disabled="isDisabled"
          ref="update"
          @click="saveTransaction"
        >
          Record Transaction
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
  name: "RecordMORTransactionModal",

  components: {
    ModalCover,
    DropSelectInput,
    BasicInput,
  },

  computed: {
    ...mapGetters({ getFXStats: "fx/getFXStats" }),

    today() {
      return new Date().toISOString().split("T")[0];
    },

    isDisabled() {
      return (
        Object.values(this.validity)?.some((valid) => valid) ||
        !this.transaction_date ||
        !this.transaction_country ||
        !this.account_id
      );
    },

    vesicashMerchants() {
      return [
        {
          name: "Gabby Molly",
          id: "7493884123",
        },
        {
          name: "Johnson Dan",
          id: "9488553669",
        },
      ];
    },

    txnDate() {
      return new Date(this.transaction_date)?.getTime() / 1000;
    },

    updatePayload() {
      return {
        account_id: Number(this.account_id),
        // merchant_name: this.form.merchant_name,
        transaction_created_at: this.txnDate,
        reference: this.form.reference_id,
        country: this.transaction_country,
        // transaction_currency: this.transaction_currency,
        amount: Number(this.form.amount),
        tax_fee: Number(this.form.tax),
        processing_fee: Number(this.form.fee),
      };
    },

    morCountries() {
      return [
        {
          id: 251,
          name: "Nigeria",
        },
        {
          id: 115,
          name: "Kenya",
        },

        {
          id: 253,
          name: "Ghana",
        },
        {
          id: 249,
          name: "Zambia",
        },
        {
          id: 65,
          name: "Egypt",
        },
      ];
    },

    morCurrencyOptions() {
      return [
        {
          id: "NGN",
          name: "Naira",
        },
        {
          id: "USD",
          name: "Dollar",
        },
        {
          id: "GHS",
          name: "Ghana",
        },
      ];
    },
  },

  data() {
    return {
      selected_rate: "dollar_naira",
      transaction_date: "",
      transaction_country: "",
      transaction_currency: "",
      account_id: "",
      form: {
        // merchant_name: "",
        reference_id: "",
        amount: "",
        tax: "",
        fee: "",
      },

      validity: {
        // merchant_name: true,
        reference_id: true,
        amount: true,
        tax: true,
        fee: true,
      },
    };
  },

  methods: {
    ...mapActions({ saveMORtransaction: "mor/saveMORtransaction" }),

    async saveTransaction() {
      this.handleClick("update");
      try {
        const response = await this.saveMORtransaction(this.updatePayload);
        this.handleClick("update", "Record Transaction", false);
        const type = response?.status === "success" ? "success" : "warning";
        const message = response?.message;
        this.pushToast(message, type);

        if (response?.status === "success") {
          this.$emit("closeTriggered");
          this.$bus.$emit("refreshMOR");
          // window.location.reload();
        }
      } catch (err) {
        this.handleClick("update", "Record Transaction", false);
        console.log("FAILED TO SAVE TXN", err);
        this.pushToast("Failed to save transaction", "error");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: toRem(35) toRem(30);

  & > .full-width {
    grid-column: 1/-1;
  }
}
</style>

<style lang="scss">
.record-transaction-modal.modal-overlay {
  .modal-outer-container {
    top: toRem(10);
    margin-bottom: toRem(20);
  }
}

.right-text {
  text-align: right;
}
</style>
