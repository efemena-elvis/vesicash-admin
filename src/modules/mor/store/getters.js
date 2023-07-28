export default {
  getAPIMetrics: (state) => state.api_metrics,

  getAPIKeys: (state) => state.api_keys,

  getAPIRequests: (state) => state.api_requests,

  getMORSummary: (state) => state.mor_summary,

  getMORPayoutSummary: (state) => state.mor_payout_summary,

  getMORWithdrawalsSummary: (state) => state.mor_withdrawals_summary,

  getMORTransactions: (state) => state.mor_transactions,

  getMORWithdrawals: (state) => state.mor_withdrawals,

  getMORPayouts: (state) => state.mor_payouts,

  getMORUsers: (state) => state.mor_users,

  getMORCountries: (state) => state.mor_countries,

  getMORVerifications: (state) => state.mor_verifications,

  getPendingMORVerifications: (state) => state.pending_mor_verifications,
};
