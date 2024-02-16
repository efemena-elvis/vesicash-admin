import $api from "@/services/service-api";

const routes = {
  transactions: (page) => `/transactions/list?page=${page}`,
  pending_transactions: (query) => `/list-wallet-transactions?${query}`,
  pending_transactions_count:
    "/list-wallet-transactions?count=yes&status=pending",
  approve_transaction: (id) => `/withdrawal/resume/${id}`,
  decline_transaction: (id) => `/withdrawal/cancel/${id}`,
};

export default {
  fetchAllTransactions: async ({ commit }, { page, payload }) => {
    const query = decodeURIComponent(location.search);
    commit("SAVE_TRANSACTIONS", []);
    const response = await $api
      .use("admin")
      .push(routes.transactions(page), { payload });
    if (response.code === 200 && query === decodeURIComponent(location.search))
      commit("SAVE_TRANSACTIONS", response.data);
    return response;
  },

  fetchPendingTransactions: async ({ commit }, query) => {
    const _query = decodeURIComponent(location.search);
    const response = await $api
      .use("admin")
      .fetch(routes.pending_transactions(query));
    commit("SAVE_PENDING_TRANSACTIONS", []);
    if (response.code === 200 && _query === decodeURIComponent(location.search))
      commit("SAVE_PENDING_TRANSACTIONS", response.data);
    return response;
  },

  fetchPendingTransactionsCount: async ({ commit }) => {
    commit("SAVE_PENDING_TRANSACTIONS_COUNT", 0);
    const response = await $api
      .use("admin")
      .fetch(routes.pending_transactions_count);
    if (response.code === 200)
      commit("SAVE_PENDING_TRANSACTIONS_COUNT", Number(response?.data || 0));
    return response;
  },

  approveTransaction: async (_, id) => {
    const response = await $api
      .use("payment")
      .push(routes.approve_transaction(id), {});

    return response;
  },

  declineTransaction: async (_, id) => {
    const response = await $api
      .use("payment")
      .push(routes.decline_transaction(id), {});

    return response;
  },
};
