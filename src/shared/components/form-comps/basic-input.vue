<template>
  <div :class="getGroupWrapperStyle">
    <div :class="getGroupStyle">
      <!-- INPUT LABEL -->
      <template v-if="label_title">
        <label class="form-label" :for="label_id" :class="getLabelStyle">{{
          label_title
        }}</label>
      </template>

      <!-- INPUT WRAPPER AREA -->
      <div :class="getInputWrapperStyle">
        <input
          :type="getInputType"
          :id="label_id"
          v-model.trim="form_value"
          :required="is_required"
          :disabled="is_disabled"
          class="form-control"
          :class="[getInputStyle, error_message && 'form-control-error']"
          :placeholder="placeholder"
          :min="getInputType === 'date' ? minimum_date : 0"
          @input="validateAndEmitUserInput"
          @paste="validateAndEmitUserInput"
          @change="validateAndEmitUserInput"
        />

        <!-- FORM SUFFIX AREA -->
        <template v-if="input_type === 'password' && toggle_password">
          <div
            class="icon"
            @click="togglePasswordType"
            :class="
              passwordType
                ? ['icon-show', 'grey-500']
                : ['icon-hide', 'green-500']
            "
          ></div>
        </template>

        <template v-if="custom_options.length">
          <div
            v-on-clickaway="determineTargetArea"
            :class="[
              'prefix-select-area',
              custom_options.length > 1 ? '' : 'px-3',
            ]"
            @click="custom_options.length > 1 ? toggleDropdown() : null"
          >
            <div
              v-html="selectedCustomOption.title"
              class="tertiary-2-text"
            ></div>
            <div
              v-if="custom_options.length > 1"
              class="icon icon-caret-fill-down smooth-transition"
              :class="show_dropdown && 'rotate-180'"
            ></div>
          </div>
        </template>

        <!-- FORM PREFIX AREA -->
        <template v-if="is_phone_type || is_currency_type">
          <div
            v-on-clickaway="determineTargetArea"
            class="prefix-select-area"
            @click="toggleDropdown"
          >
            <img
              v-lazy="
                is_currency_type ? currency_country.flag : current_country.flag
              "
              :alt="
                is_currency_type
                  ? currency_country.country
                  : current_country.country
              "
            />
            <div
              class="icon icon-caret-fill-down smooth-transition"
              :class="show_dropdown && 'rotate-180'"
            ></div>
          </div>
        </template>

        <!-- FORM CURRENCY TYPE -->
        <div class="prefix-select-area value-area" v-if="currency">
          <div class="value grey-900 text-no-wrap" v-html="currency"></div>
        </div>
      </div>
    </div>

    <!-- DROP DOWN SELECT AREA -->
    <template v-if="custom_options.length">
      <template name="drop-select-area" v-if="show_dropdown">
        <CustomDropSelect
          :list="custom_options"
          @selected="$emit('selected', $event)"
        />
      </template>
    </template>

    <!-- DROP DOWN SELECT AREA -->
    <template v-if="is_phone_type">
      <template name="drop-select-area" v-if="show_dropdown">
        <CountryDropSelect
          :countries="countries_data"
          @countrySelected="current_country = $event"
        />
      </template>
    </template>

    <template v-if="is_currency_type">
      <template name="drop-select-area" v-if="show_dropdown">
        <CountryDropSelect
          :allow_search="
            currency_options.length
              ? currency_options.length > 5
              : countries_data.length > 5
          "
          is_currency_type
          :countries="
            currency_options.length ? currency_options : countries_data
          "
          @countrySelected="currency_country = $event"
        />
      </template>
    </template>

    <!-- MESSAGE TEXT -->
    <div class="error-message-text" v-if="error_message">
      {{ error_message }}
    </div>
  </div>
</template>

<script>
import CountryHelper from "@/shared/mixins/mixin-country-helper";
import CustomDropSelect from "@/shared/components/custom-drop-select";

export default {
  name: "BasicInput",

  mixins: [CountryHelper],

  components: {
    CustomDropSelect,
    CountryDropSelect: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/country-drop-select"
      ),
  },

  props: {
    label_title: {
      type: String,
      default: "",
    },

    label_id: {
      type: String,
      default: "",
    },

    input_type: {
      type: String,
      default: "text",
    },

    input_value: {
      type: [String, Number],
      default: "",
    },

    is_required: {
      type: Boolean,
      default: false,
    },

    is_disabled: {
      type: Boolean,
      default: false,
    },

    is_phone_type: {
      type: Boolean,
      default: false,
    },

    is_currency_type: {
      type: Boolean,
      default: false,
    },

    currency_type: {
      type: Object,
      default: () => {},
    },

    currency_options: {
      type: Array,
      default: () => [],
    },

    currency: {
      type: String,
      default: "",
    },

    placeholder: {
      type: String,
      default: "",
    },

    minimum_date: {
      type: String,
      default: "",
    },

    toggle_password: {
      type: Boolean,
      default: true,
    },

    custom_options: {
      type: Array,
      default: () => [],
    },

    custom_style: {
      type: Object,
      default: () => ({
        group_wrapper_style: "",
        group_style: "",
        label_style: "",
        input_style: "",
        input_wrapper_style: "",
      }),
    },

    validity: {
      type: Boolean,
      default: false,
    },

    error_handler: {
      type: Object,
      default: () => ({
        type: "",
        message: "",
        minimum: 1,
      }),
    },
  },

  computed: {
    selectedCustomOption() {
      return this.custom_options?.find((item) => item.selected);
    },

    getGroupWrapperStyle() {
      return this.custom_style?.group_wrapper_style || null;
    },

    getGroupStyle() {
      return this.custom_style?.group_style || null;
    },

    getLabelStyle() {
      return this.custom_style?.label_style || null;
    },

    getInputStyle() {
      return this.custom_style?.input_style || null;
    },

    getInputWrapperStyle() {
      return this.custom_style?.input_wrapper_style || null;
    },

    getInputType() {
      if (this.input_type !== "password") return this.input_type;
      else return this.passwordType ? "password" : "text";
    },
  },

  watch: {
    input_value: {
      handler(value) {
        this.form_value = value;
      },
      immediate: true,
    },

    current_country: {
      handler(value) {
        this.$bus.$emit("update-country-state", value?.country);
      },
      immediate: true,
    },

    currency_country: {
      handler(value) {
        this.$emit("currencyUpdated", value);
      },
      immediate: true,
    },

    validity: {
      handler(value) {
        if (value) this.error_message = "";
      },
      immediate: true,
    },

    currency_type: {
      handler(value) {
        if (this.is_currency_type && value?.country) {
          this.currency_country = value;
        }
      },
      immediate: true,
    },
  },

  data() {
    return {
      passwordType: true,
      error_message: "",
      form_value: "",
      currency_country: {
        country: "Nigeria",
        dialing_code: "234",
        code: "ng",
        flag: "https://dyclassroom.com/image/flags/ng.png",
      },
    };
  },

  created() {
    // LOAD MY CURRENT COUNTRY
    this.is_phone_type && this.loadCurrentUserLocation();
  },

  methods: {
    // TOGGLE PASSWORD TYPE
    togglePasswordType() {
      this.passwordType = !this.passwordType;
    },

    validateInputType(
      value = this.form_value,
      type = this.error_handler?.type,
      message = this.error_handler?.message
    ) {
      switch (type) {
        case "single":
          this.error_message =
            !this.$validate.validateSingleName(value) && message;
          break;

        case "email":
          this.error_message =
            !this.$validate.validateEmailInput(value) && message;
          break;

        case "phone":
          this.error_message =
            !this.$validate.validatePhoneInput(value) && message;
          break;

        case "password":
          this.error_message =
            !this.$validate.validatePasswordInput(value) && message;
          break;

        case "required":
          this.error_message = !value.length && message;
          break;

        case "minimum":
          const minimum = this.error_handler?.minimum;
          this.error_message = value.length < minimum && message;
          break;

        default:
          this.error_message = "";
          break;
      }
    },

    // =================================
    // VALIDATE USER ENTRY INPUT DATA
    // =================================
    validateAndEmitUserInput() {
      // CHECK INPUT VALIDITY
      this.validateInputType();

      // EMIT CLIENT ENTERED VALUE
      this.$emit("getInputState", {
        validity: this.error_message ? true : false,
        value: this.form_value,
      });
    },
  },
};
</script>

<style></style>
