<template>
  <AuthWrapper title_text="Login to your account">
    <!-- AUTH PAGE -->
    <form @submit.prevent="handleUserLogIn" class="auth-page">
      <!-- EMAIL ADDRESS INPUT -->
      <div class="form-group">
        <BasicInput
          label_title="Email address"
          label_id="emailAddress"
          input_type="email"
          is_required
          placeholder="Enter email address"
          :input_value="form.email_address"
          @getInputState="updateFormState($event, 'email_address')"
          :error_handler="{
            type: 'email',
            message: 'Email address is not valid',
          }"
        />
      </div>

      <!-- PASSWORD INPUT -->
      <div class="form-group mgb-13">
        <BasicInput
          label_title="Password"
          label_id="password"
          input_type="password"
          is_required
          placeholder="Enter password"
          :custom_style="{ input_wrapper_style: 'form-suffix' }"
          :input_value="form.password"
          @getInputState="updateFormState($event, 'password')"
          :error_handler="{
            type: 'password',
            message: 'Password should contain at least 4 characters',
          }"
        />
      </div>

      <!-- FORGOT PASSWORD LINK -->
      <div class="d-flex justify-content-end" v-if="false">
        <router-link
          :to="{ name: 'VesicashForgotPassword' }"
          class="tertiary-2-text"
          >Forgot Password?</router-link
        >
      </div>

      <!-- BUTTON AREA -->
      <div class="btn-area mgt-30 mgb-10">
        <button
          class="btn btn-primary btn-md w-100"
          ref="loginBtn"
          :disabled="isValidState"
        >
          Login to account
        </button>
      </div>

      <!-- HELP BLOCK TEXT -->
      <div class="help-block text-center" v-if="false">
        Don’t have an account?
        <router-link to="/register-lander" class="fw-medium"
          >Register</router-link
        >
      </div>
    </form>
  </AuthWrapper>
</template>

<script>
import { mapActions } from "vuex";
import AuthWrapper from "@/modules/auth/components/auth-wrapper";
import BasicInput from "@/shared/components/form-comps/basic-input";

export default {
  name: "Login",

  metaInfo: {
    title: "Login",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    AuthWrapper,
    BasicInput,
  },

  computed: {
    // CHECK FORM BUTTON VALIDITY STATE
    isValidState() {
      return Object.values(this.validity).every((valid) => !valid)
        ? false
        : true;
    },
  },

  data() {
    return {
      form: {
        email_address: "",
        password: "",
      },

      validity: {
        email_address: true,
        password: true,
      },
    };
  },

  methods: {
    ...mapActions({ loginUser: "auth/loginUser" }),

    // ============================
    // HANDLE USER CLIENT LOGIN
    // ============================
    handleUserLogIn() {
      this.handleClick("loginBtn");

      let request_payload = {
        email_address: this.form?.email_address,
        password: this.form?.password,
      };

      this.loginUser(request_payload)
        .then((response) => {
          this.handleClick("loginBtn", "Login to account", false);
          if (response.code === 200) {
            if (
              response?.data?.user?.account_type === "admin" ||
              response?.data?.user_permissions?.length
            ) {
              this.pushToast("User login was successful", "success");
              // REDIRECT TO DASHBOARD
              return setTimeout(() => (location.href = "/dashboard"), 2000);
            }

            this.pushToast(
              "Unauthorized. Only Admin or Moderator have access",
              "warning"
            );
            // console.log("login response", response);
          }

          // HANDLE NON 200 RESPONSE
          else this.handleLoginError(response.message);
        })
        .catch(() => {
          this.handleLoginError("Unable to login to your account");
        });
    },

    // ============================
    // HANDLE USER LOGIN ERROR
    // ============================
    handleLoginError(message) {
      this.pushToast(message, "error");
      this.handleClick("loginBtn", "Login to account", false);
    },
  },
};
</script>

<style lang="scss" scoped></style>
