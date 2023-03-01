import $api from "@/services/service-api";

const routes = {
  login_user: "/auth/login",
};

export default {
  // ============================================
  // LOGIN A USER INTO VESICASH ADMIN DASHBAORD
  // ============================================
  async loginUser({ commit }, payload) {
    let response = await $api.push(routes.login_user, { payload });
    if (response.code === 200 && response?.data?.user?.account_type==="admin") commit("AUTH_SUCCESS", response.data);
    return response;
  },

  async logOutUser({ commit }) {
    commit("AUTH_LOGOUT");
  },
};
