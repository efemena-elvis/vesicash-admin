<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
    :place_center="true"
    class="approval-modal"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Approve transaction</div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="tertiary-1-text grey-900" v-html="message"></div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer footer-wrapper mgt-15">
        <button
          class="btn btn-alert btn-md"
          ref="Decline"
          @click="updateTransaction('no')"
        >
          Decline
        </button>
        <button
          class="btn btn-primary btn-md"
          ref="Approve"
          @click="updateTransaction()"
        >
          Approve
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions } from "vuex";
import ModalCover from "@/shared/components/modal-cover";
export default {
  name: "PaymentApprovalModal",

  components: {
    ModalCover,
  },

  props: {
    message: {
      type: String,
      default: "Approve the withdrawal of $100.00 from the dollar wallet",
    },

    id: {
      type: [Number, String],
      default: "",
    },
  },

  methods: {
    ...mapActions({
      approveOrDeclineTransaction: "users/approveOrDeclineTransaction",
      approveTransaction: "transaction/approveTransaction",
      declineTransaction: "transaction/declineTransaction",
    }),

    async updateTransaction(status = "yes") {
      const { id } = this;

      const ref = status === "yes" ? "Approve" : "Decline";

      const action =
        status === "yes" ? "approveTransaction" : "declineTransaction";

      try {
        this.handleClick(ref);

        const response = await this[action](id);
        this.handleClick(ref, ref, false);
        const type = response?.code === 200 ? "success" : "warning";
        this.pushToast(response?.message, type);
        if (response?.code === 200) this.$emit("refresh");
      } catch (err) {
        console.log("ERROR UPDATING TXN", err);
        this.handleClick(ref, ref, false);
        this.pushToast(`Failed to ${ref} this transaction`, status);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.footer-wrapper {
  @include flex-row-start-end;
  justify-content: flex-end;
  gap: toRem(15);
}
</style>

<style lang="scss">
.approval-modal .modal-cover-body {
  min-height: auto;
}
.btn {
  .icon-spinner {
    font-size: toRem(12);
  }

  .f-size-19 {
    font-size: 0.95rem;
  }
}
</style>
