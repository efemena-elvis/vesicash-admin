import Vue from "vue";
import Vuex from "vuex";

// =========================
// MODULES STORE POINT
// =========================
import general from "./general";
import auth from "@/modules/auth/store";
import dashboard from "@/modules/dashboard/store";
import users from "@/modules/users/store";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        general,
        auth,
        dashboard,
        users,
    },
});