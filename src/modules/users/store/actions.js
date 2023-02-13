import $api from "@/services/service-api";

const routes = {
    connected_users: (query) => `admin/users?${query}`,
};

export default {
    fetchConnectedUsers: async({ commit }, query = "") => {
        let response = await $api.fetch(routes.connected_users(query));
        if (response.code === 200) commit("SAVE_CONNECTED_USERS", response.data);
        return response;
    },

    fetchUserTransactions: async() => {
        return new Promise((res) => {
            setTimeout(() => {
                res({ code: 200 });
            }, 1500);
        });
    },
};