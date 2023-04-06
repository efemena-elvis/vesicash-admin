import Vue from "vue";
import Vuex from "vuex";

// =========================
// MODULES STORE POINT
// =========================
import general from "./general";
import auth from "@/modules/auth/store";
import dashboard from "@/modules/dashboard/store";
import users from "@/modules/users/store";
import fx from "@/modules/foreign-exchange/store";
import escrow from "@/modules/escrow/store";
import transaction from "@/modules/payments/store";
import api from "@/modules/api/store";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    general,
    auth,
    dashboard,
    users,
    fx,
    escrow,
    transaction,
    api,
  },
});
