export default {
  SAVE_API_METRICS: (state, metrics) => (state.api_metrics = metrics),

  SAVE_API_KEYS: (state, keys) => (state.api_keys = keys),

  SAVE_API_REQUESTS: (state, requests) => (state.api_requests = requests),
};
