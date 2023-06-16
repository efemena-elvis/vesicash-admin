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
          <div class="form-label">Merchant</div>
          <DropSelectInput
            placeholder="Select Merchant to pay to"
            :options="merchants"
            @optionSelected="selected_merchant = $event.id"
          />
        </div>

        <div class="form-label">Total processed money</div>

        <div class="metric-wrapper mgb-20">
          <div class="metric-card">
            <div class="h5-text teal-800">$6,400,000.00</div>
            <div class="secondary-3-text grey-700 mgb-4">USD TRANSACTIONS</div>
          </div>

          <div class="metric-card">
            <div class="h5-text teal-800">$6,400,000.00</div>
            <div class="secondary-3-text grey-700 mgb-4">USD TRANSACTIONS</div>
          </div>

          <div class="metric-card">
            <div class="h5-text teal-800">$6,400,000.00</div>
            <div class="secondary-3-text grey-700 mgb-4">USD TRANSACTIONS</div>
          </div>
          <div class="metric-card">
            <div class="h5-text teal-800">$6,400,000.00</div>
            <div class="secondary-3-text grey-700 mgb-4">USD TRANSACTIONS</div>
          </div>
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          class="btn btn-md btn-primary w-100 mgt-15"
          :disabled="!selected_merchant"
          ref="update"
          @click="changeFXRate"
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
    ...mapGetters({ getFXStats: "fx/getFXStats" }),

    updatePayload() {
      return {
        selected_merchant: "",
      };
    },

    merchants() {
      return [
        {
          id: "1",
          name: "Abobagunwa Ezekiel",
        },
        {
          id: "2",
          name: "Awotunde Bangalee",
        },

        {
          id: "3",
          name: "Liam Gabby",
        },
      ];
    },
  },

  data() {
    return {
      selected_merchant: "",
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

<style lang="scss" scoped>
.metric-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: toRem(15) toRem(15);

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
