export default {
  SAVE_TRANSACTIONS: (state, data) => (state.transactions = data),

  SAVE_PENDING_TRANSACTIONS: (state, data) =>
    (state.pending_transactions = data),
};
