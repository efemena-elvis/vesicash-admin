<template>
  <div class="drop-option-wrapper w-100 mgt-7 smooth-animation">
    <div class="inner-wrapper rounded-8">
      <!-- SEARCH BAR -->
      <div class="search-bar mgb-4 mgt-10" v-if="list.length > 4">
        <input
          type="text"
          class="form-control ignore"
          placeholder="Search country name"
          v-model="search_value"
        />
        <div class="icon icon-search grey-400 index-999"></div>
      </div>

      <!-- OPTIONS -->
      <template v-if="list.length">
        <div class="option-scroll-wrapper">
          <div
            class="option-row"
            v-for="(item, index) in filteredList"
            :key="index"
            @click="selectItem(item)"
          >
            <div
              class="inner-lining wt-100"
              :class="index + 1 === filteredList.length && 'no-bottom-border'"
            >
              <div v-html="item.description"></div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="no-options text-center">No options available</div>
      </template>
    </div>

    <div class="mgb-4 invisible">Hidden state</div>
  </div>
</template>

<script>
export default {
  name: "CustomDropSelect",

  props: {
    list: {
      type: Array,
      default: () => [],
    },

    allow_search: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    filteredList() {
      return this.list.filter((item) =>
        item.description.toLowerCase().includes(this.search_value.toLowerCase())
      );
    },
  },

  data() {
    return {
      search_value: "",
    };
  },

  methods: {
    selectItem(item) {
      this.$emit("selected", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-bar {
  .form-control {
    text-align: left;
  }
}
</style>
