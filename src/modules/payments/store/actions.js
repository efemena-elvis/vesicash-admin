import $api from "@/services/service-api";

const routes = {
  transactions: (page) => `admin/transactions/list?page=${page}`,
  pending_transactions: (query) => `admin/list-wallet-transactions?${query}`,
};

export default {
  fetchAllTransactions: async ({ commit }, { page, payload }) => {
    const query = decodeURIComponent(location.search);
    commit("SAVE_TRANSACTIONS", []);
    const response = await $api.push(routes.transactions(page), { payload });
    if (response.code === 200 && query === decodeURIComponent(location.search))
      commit("SAVE_TRANSACTIONS", response.data);
    return response;
  },

  fetchPendingTransactions: async ({ commit }, query) => {
    const _query = decodeURIComponent(location.search);
    const response = await $api.fetch(routes.pending_transactions(query));
    commit("SAVE_PENDING_TRANSACTIONS", []);
    if (response.code === 200 && _query === decodeURIComponent(location.search))
      commit("SAVE_PENDING_TRANSACTIONS", response.data);
    return response;
  },
};
