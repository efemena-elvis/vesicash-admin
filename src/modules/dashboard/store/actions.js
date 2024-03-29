import $api from "@/services/service-api";

const routes = {
  dashboard_txn_stats: (query) =>
    `/business/transactions/statistics?${query}`,
  exchange_rates: (query) => `/business/rates/statistics?${query}`,
  vesicash_users: (query) => `/users/total?${query}`,
  api_keys: (query) => `/tokens?${query}`,
  graph_metrics: (query) => `/graphical-metrics?${query}`,
};

export default {
  // ============================================
  // FETCH DASHBOARD TXN STATS
  // ============================================
  async fetchTransactionStats({ state, commit }, query = "") {
    let response = await $api.use('admin').fetch(routes.dashboard_txn_stats(query));
    if (response.code === 200) {
      const updated_stats = {
        ...state.dashboard_stats,
        transaction_volume: response.data.transaction_volume,
        active_transactions: response.data.active,
        completed_transactions: response.data.completed,
      };

      commit("SAVE_DASHBOARD_STATS", updated_stats);
    }
    return response;
  },

  // ============================================
  // FETCH DASHBOARD EXCHANGE RATES
  // ============================================
  async fetchExchangeRates({ state, commit }, query) {
    let response = await $api.use('admin').fetch(routes.exchange_rates(query));
    if (response.code === 200) {
      const updated_stats = {
        ...state.dashboard_stats,
        ...response.data,
        exchange_transactions: response.data.exchange_transactions,
        gbp_usd_rate: response.data.pound_dollar,
        usd_ngn_rate: response.data.dollar_naira,
        gbp_ngn_rate: response.data.pound_naira,
        dollar_exchange_balance: response.data.dollar_exchange_balance,
        naira_exchange_balance: response.data.naira_exchange_balance,
        pounds_exchange_balance: response.data.pounds_exchange_balance,
      };

      commit("SAVE_DASHBOARD_STATS", updated_stats);
    }
    return response;
  },

  // ============================================
  // FETCH DASHBOARD USERS COUNTS
  // ============================================
  async fetchUsersCount({ state, commit }, query = "") {
    let response = await $api.use('admin').fetch(routes.vesicash_users(query));
    if (response.code === 200) {
      const updated_stats = {
        ...state.dashboard_stats,
        registered_users: response.data.registered_users,
        verified_users: response.data.verified_users,
      };

      commit("SAVE_DASHBOARD_STATS", updated_stats);
    }
    return response;
  },

  // ============================================
  // FETCH API KEYS
  // ============================================
  async fetchAPIkeysStats({ state, commit }, query = "") {
    let response = await $api.use('admin').fetch(routes.api_keys(query));
    if (response.code === 200) {
      const updated_stats = {
        ...state.dashboard_stats,
        api_keys: response.data.api_keys,
        active_api_keys: response.data.active_tokens,
      };

      commit("SAVE_DASHBOARD_STATS", updated_stats);
    }
    return response;
  },

  async fetchGraphMetrics(_, query = "") {
    return await $api.use('admin').fetch(routes.graph_metrics(query));
  },
};
