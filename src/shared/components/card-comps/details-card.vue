<template>
  <div :class="`disbursement-card pd-20 rounded-3 neutral-10-bg ${wrapperClass}`">
    <div
      class="card-title secondary-2-text grey-900"
      :class="titleClass"
      v-if="card_title"
    >{{card_title}}</div>

    <div class="meta-block" v-for="(meta,index) in metas" :key="index">
      <div class="meta-name">{{ meta.name }}</div>
      <TagCard v-if="meta.status" :card_text="meta.value" :card_type="meta.status" />
      <div v-else class="meta-value">{{meta.value}}</div>
    </div>

    <div class="slot-container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";
export default {
  name: "DetailCard",

  components: {
    TagCard,
  },

  props: {
    card_title: {
      type: String,
      default: "",
    },

    metas: {
      type: Array,
      default: () => [],
    },

    titleClass: {
      type: String,
      default: "",
    },

    wrapperClass: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.disbursement-card {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(185px, 1fr));
  gap: toRem(25) toRem(10);
  border: toRem(1) solid getColor("grey-300");

  @include breakpoint-custom-up-down(1140, 1200) {
    grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
  }

  .card-title,
  .slot-container {
    grid-column: 1/-1;
  }

  .slot-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: toRem(30);

    @include breakpoint-down(xl) {
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
  }

  .slot-container:empty {
    display: none;
  }
}
</style>