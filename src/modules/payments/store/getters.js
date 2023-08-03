export default {
  getTransactions: (state) => state.transactions,

  getPendingTransactions: (state) => state.pending_transactions,

  getPendingCount: (state) => state.pending_count,
};
