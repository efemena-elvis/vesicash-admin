<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Payout to wallets</div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="form-group">
          <div class="form-label">Merchants</div>
          <DropSelectInput
            placeholder="Select Merchants to pay to"
            :multi_options="merchants"
            @multiSelected="selectMerchants"
            multi
            all="All Merchants"
          />
        </div>

        <div class="form-label">Total processed money</div>

        <div class="metric-wrapper mgb-20">
          <div
            class="metric-card"
            v-for="option in getMORSummary"
            :key="option.currency"
          >
            <div class="h5-text teal-800">
              {{ formattedAmount(option.currency, option.amount) }}
            </div>
            <div class="secondary-3-text grey-700 mgb-4">
              {{ option.currency }} TRANSACTIONS
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
          :disabled="!selected_merchants.length"
          ref="update"
          @click="sendPayout"
        >
          Pay to wallet
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DropSelectInput from "@/shared/components/drop-select-input";
import ModalCover from "@/shared/components/modal-cover";

export default {
  name: "PayoutMORModal",

  components: {
    ModalCover,
    DropSelectInput,
  },

  computed: {
    ...mapGetters({
      getMORUsers: "mor/getMORUsers",
      getMORSummary: "mor/getMORSummary",
    }),

    updatePayload() {
      return {
        merchants: this.selected_merchants,
      };
    },

    merchants() {
      return [...this.getMORUsers]?.map((user) => ({
        name: user.full_name,
        id: user.account_id,
      }));
    },
  },

  data() {
    return {
      selected_merchant: "",
      selected_merchants: [],
    };
  },

  methods: {
    ...mapActions({ sendMORPayout: "mor/sendMORPayout" }),

    formattedAmount(currency, cost) {
      const amount = `${this.$money?.getSign(currency)}${this.$money?.addComma(
        cost
      )}`;

      return amount;
    },

    selectMerchants(merchants) {
      this.selected_merchants = merchants
        ?.filter((m) => m.selected)
        ?.map((m) => m.id);
    },

    async sendPayout() {
      this.handleClick("update");
      try {
        const response = await this.sendMORPayout(this.updatePayload);
        this.handleClick("update", "Pay to wallet", false);
        const type = response?.code === 200 ? "success" : "warning";
        const message = response?.message;
        this.pushToast(message, type);

        if (response?.code === 200) {
          this.$bus?.$emit("refreshMOR");
          this.$emit("closeTriggered");
        }
      } catch (err) {
        this.handleClick("update", "Pay to wallet", false);
        console.log("FAILED TO PAY WALLET", err);
        this.pushToast("Failed to Pay wallet", "error");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.metric-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: toRem(15) toRem(15);
  max-height: toRem(200);
  overflow-y: auto;
  @include custom-scroll-style;

  & > .full-width {
    grid-column: 1/-1;
  }

  .metric-card {
    border: toRem(1.5) solid getColor("grey-200");
    padding: toRem(15);
  }
}
</style>

<style lang="scss">
.right-text {
  text-align: right;
}
</style>
