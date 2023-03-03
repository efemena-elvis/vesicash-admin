<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-md' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Exchange Details</div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <DetailsCard :metas="details" wrapperClass="fx-summary-wrapper" />
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button class="btn btn-md btn-primary mgt-35">Download receipt</button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import ModalCover from "@/shared/components/modal-cover";
import DetailsCard from "@/shared/components/card-comps/details-card";

export default {
  name: "FXSummaryModal",

  props: {
    details: {
      type: Array,
      default: () => [{ name: "USER", value: "Yusuf Rilwan" }],
    },
  },

  components: {
    ModalCover,
    DetailsCard,
  },
};
</script>

<style lang="scss">
.card {
  &.fx-summary-wrapper {
    border: 0;
    padding: 0;
  }
}
</style>
