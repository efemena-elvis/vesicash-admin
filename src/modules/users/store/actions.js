import $api from "@/services/service-api";

const routes = {
  connected_users: (query) => `admin/users?${query}`,
  user_profile: (account_id) => `admin/user/fetch/${account_id}`,
};

export default {
  fetchConnectedUsers: async ({ commit }, query = "") => {
    let response = await $api.fetch(routes.connected_users(query));
    if (response.code === 200) commit("SAVE_CONNECTED_USERS", response.data);
    return response;
  },

  fetchUserProfile: async ({ commit }, account_id) => {
    const response = await $api.fetch(routes.user_profile(account_id));
    if (response?.code === 200) commit("SAVE_USER_PROFILE", response.data);
    return response;
  },

  fetchUserTransactions: async () => {
    return new Promise((res) => {
      setTimeout(() => {
        res({ code: 200 });
      }, 1500);
    });
  },
};
