<template>
  <ModalCover
    show_close_btn
    @closeModal="$emit('closeTriggered')"
    :modal_style="modal_style"
    class="transaction-summary-modal"
  >
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">{{ summary.title }}</div>
      </div>
      <div></div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <DetailsCard :metas="summary.metas" wrapper-class="border-0 pd-0" />
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer mgt-20">
        <button class="btn btn-primary btn-md">Download receipt</button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import ModalCover from "@/shared/components/modal-cover";
import DetailsCard from "@/shared/components/card-comps/details-card";
export default {
  name: "TransactionSummaryModal",

  components: {
    ModalCover,
    DetailsCard,
  },

  props: {
    modal_style: {
      type: Object,
      default: () => ({ size: "modal-sm" }),
    },

    summary: {
      type: Object,
      default: () => ({
        title: "Transaction summary",
        metas: [
          {
            name: "AMOUNT PAID",
            value: "$40,000",
          },
          {
            name: "TRANSACTION REFERENCE",
            value: "1124434",
          },
          {
            name: "DATE OF TRANSACTION",
            value: "30th Apr 2022",
          },
          {
            name: "COUNTRY",
            value: "United states",
          },
          {
            name: "PHONE NUMBER",
            value: "09158585822",
          },
          {
            name: "BANK NAME",
            value: "Citi bank",
          },
          {
            name: "SWIFT CODE",
            value: "1234334",
          },
          {
            name: "PHONE NUMBER",
            value: "3848458848",
          },
          {
            name: "SORT CODE",
            value: "566782",
          },
          {
            name: "BANK ADDRESS",
            value: "33 singham way united states",
          },
          {
            name: "WALLET USED",
            value: "Dollar wallet",
          },
          {
            name: "STATUS",
            value: "Completed",
            status: "success",
          },
        ],
      }),
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

<style lang="scss">
.transaction-summary-modal.modal-overlay {
  place-items: center;
  .modal-outer-container {
    position: absolute;
    top: 60px;
    min-width: 600px;

    @include breakpoint-custom-down(630) {
      min-width: 0;
      width: 98%;
      max-width: 98%;
    }
  }
}
</style>