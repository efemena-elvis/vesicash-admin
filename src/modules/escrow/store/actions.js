import $api from "@/services/service-api";

const routes = {
    escrow_transactions: (query) => `admin/business/transactions/list?${query}`,
};

export default {
    fetchEscrowTransactions: async({ commit }, query) => {
        const response = await $api.fetch(routes.escrow_transactions(decodeURIComponent(query)));
        const _query = query ? `?${query}` : query;
        if (response.code === 200 && _query === decodeURIComponent(location.search))
            commit("SAVE_ALL_ESCROW_TRANSACTIONS", response);
        return response;
    },
};