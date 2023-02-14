<template>
  <div class="meta-row">
    <div class="meta-block">
      <div class="meta-name">ACCOUNT ID</div>
      <div class="meta-value">{{details.userID}}</div>
    </div>

    <div class="meta-block">
      <div class="meta-name">ACCOUNT TYPE</div>
      <div class="meta-value text-capitalize">{{ details.account_type }}</div>
    </div>

    <div class="meta-block" v-if="details.business_name">
      <div class="meta-name">BUSINESS NAME</div>
      <div class="meta-value">{{details.business_name }}</div>
    </div>

    <div class="meta-block">
      <div class="meta-name">STATUS OF VERIFICATON</div>
      <TagCard
        :card_text="details.verified ?  'Verified':'Pending'"
        :card_type="details.verified ?  'success':'progress'"
      />
    </div>
  </div>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";

export default {
  name: "UserDetailsMeta",

  props: {
    details: {
      type: Object,
      default: () => ({}),
    },
  },

  components: {
    TagCard,
  },
};
</script>

<style lang="scss" scoped>
.meta-row {
  @include flex-row-start-wrap;
  align-items: stretch;
  gap: toRem(20);
  margin-bottom: toRem(40);
}
</style>