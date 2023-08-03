export default {
  SAVE_API_METRICS: (state, metrics) => (state.api_metrics = metrics),

  SAVE_API_KEYS: (state, keys) => (state.api_keys = keys),

  SAVE_API_REQUESTS: (state, requests) => (state.api_requests = requests),

  SAVE_MOR_SUMMARY: (state, summary) => (state.mor_summary = summary),

  SAVE_MOR_PAYOUT_SUMMARY: (state, summary) =>
    (state.mor_payout_summary = summary),

  SAVE_MOR_WITHDRAWALS_SUMMARY: (state, summary) =>
    (state.mor_withdrawals_summary = summary),

  SAVE_MOR_TRANSACTIONS: (state, data) => (state.mor_transactions = data),

  SAVE_MOR_WITHDRAWALS: (state, data) => (state.mor_withdrawals = data),

  SAVE_MOR_PAYOUTS: (state, data) => (state.mor_payouts = data),

  SAVE_MOR_USERS: (state, data) => (state.mor_users = data),

  SAVE_MOR_COUNTRIES: (state, data) => (state.mor_countries = data),

  SAVE_MOR_VERIFICATIONS: (state, data) => (state.mor_verifications = data),

  SAVE_PENDING_MOR_VERIFICATIONS: (state, count) =>
    (state.pending_mor_verifications = count),
};
