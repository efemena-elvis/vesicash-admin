import $api from "@/services/service-api";

const routes = {
  transactions: (page) => `/transactions/list?page=${page}`,
  pending_transactions: (query) => `/list-wallet-transactions?${query}`,
  pending_transactions_count:
    "/list-wallet-transactions?count=yes&status=pending",
  approve_transaction: (id) => `/withdrawal/resume/${id}`,
  decline_transaction: (id) => `/withdrawal/cancel/${id}`,
  load_country_banks: "/banks",
  create_wire_account: "/wire-transfer/accounts",
  update_wire_account: (id) => `/wire-transfer/accounts/${id}`,
  load_wire_accounts: "/wire-transfer/accounts",
  delete_wire_account: (id) => `wire-transfer/accounts/${id}`,
  load_wire_transfers: (page) => `wire-transfer/payments?page=${page}`,
  update_wire_payment: (ref, action) =>
    `wire-transfer/payments/${ref}/${action}`,
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

  loadCountryBanks: async (_, country_code) => {
    return await $api
      .use("payment")
      .push(routes.load_country_banks, { payload: { country_code } });
  },

  createWireAccount: async (_, payload) => {
    return await $api
      .use("payment")
      .push(routes.create_wire_account, { payload });
  },

  updateWireAccount: async (_, { payload, id }) => {
    return await $api
      .use("payment")
      .patch(routes.update_wire_account(id), { payload });
  },

  loadWireAccounts: async () => {
    return await $api.use("payment").fetch(routes.load_wire_accounts, {});
  },

  deleteWireAccount: async (_, id) => {
    return await $api.use("payment").remove(routes.delete_wire_account(id), {});
  },

  loadWireTransfers: async (_, page) => {
    return await $api
      .use("payment")
      .fetch(routes.load_wire_transfers(page), {});
  },

  async updateWirePayment(_, { ref, action }) {
    return await $api
      .use("payment")
      .patch(routes.update_wire_payment(ref, action), {});
  },
};
