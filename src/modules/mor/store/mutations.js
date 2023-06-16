export default {
  SAVE_API_METRICS: (state, metrics) => (state.api_metrics = metrics),

  SAVE_API_KEYS: (state, keys) => (state.api_keys = keys),

  SAVE_API_REQUESTS: (state, requests) => (state.api_requests = requests),

  SAVE_MOR_SUMMARY: (state, summary) => (state.mor_summary = summary),

  SAVE_MOR_TRANSACTIONS: (state, data) => (state.mor_transactions = data),
};
