import $api from "@/services/service-api";

const routes = {
  login_user: "/login",
};

export default {
  // ============================================
  // LOGIN A USER INTO VESICASH ADMIN DASHBAORD
  // ============================================
  async loginUser({ commit }, payload) {
    let response = await $api.use('auth','v2').push(routes.login_user, { payload });
    if (response.code === 200 && (response?.data?.user?.account_type==="admin" || response?.data?.user?.permissions?.length)) commit("AUTH_SUCCESS", response.data);
    return response;
  },

  async logOutUser({ commit }) {
    commit("AUTH_LOGOUT");
  },
};
