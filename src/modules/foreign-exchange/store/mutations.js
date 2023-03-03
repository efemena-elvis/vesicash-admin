export default {
  SAVE_FX_STATS: (state, stats) => (state.fx_stats = stats),

  SAVE_FX_TXN: (state, data) => (state.fx_txn = data),

  SAVE_FX_RATES: (state, data) => (state.fx_rates = data),
};
