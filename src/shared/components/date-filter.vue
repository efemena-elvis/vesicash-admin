<template>
  <DatePicker
    v-model="time"
    range
    prefix-class="xmx"
    :formatter="{ stringify:()=>'' }"
    :range-separator="placeholder"
    :placeholder="placeholder"
    class="pointer"
    :clearable="false"
    :editable="false"
    :disabled-date="disabledDate"
    :popup-style="{right:'0', top:'40px',left:'auto'}"
    :append-to-body="false"
    :shortcuts="shortcutConfig"
  >
    <span slot="icon-calendar" class="icon icon-caret-fill-down"></span>
  </DatePicker>
</template>

<script>
import DatePicker from "vue2-datepicker";
import { MixinDateFilter } from "@/shared/mixins/mixin-date-filter";
import "vue2-datepicker/index.css";

export default {
  name: "DateFilter",

  mixins: [MixinDateFilter],

  props: {
    time: {
      type: Array,
      default: () => [],
    },

    placeholder: {
      type: String,
      default: () => "Date Range",
    },
  },

  model: {
    prop: "time",
    event: "update",
  },

  watch: {
    time: {
      handler(data) {
        this.$emit("update", [...data]);
      },
      deep: true,
    },
  },

  components: {
    DatePicker,
  },

  computed: {
    today() {
      const date = new Date();
      return date;
    },

    yesterday() {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      return date;
    },

    lastWeek() {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      return date;
    },

    lastMonth() {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7 * 4);
      return date;
    },

    lastYear() {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7 * 52);
      return date;
    },

    shortcutConfig() {
      const today = new Date();
      return [
        {
          text: "Till Date",
          onClick: () => {
            return [];
          },
        },
        {
          text: "Today",
          onClick: () => {
            return [today, today];
          },
        },
        {
          text: "Yesterday",
          onClick: () => {
            return [this.yesterday, today];
          },
        },
        {
          text: "Last Week",
          onClick: () => {
            return [this.lastWeek, today];
          },
        },
        {
          text: "Last Month",
          onClick: () => {
            return [this.lastMonth, today];
          },
        },
        {
          text: "Last Year",
          onClick: () => {
            return [this.lastYear, today];
          },
        },
      ];
    },
  },
};
</script>

<style>
</style>