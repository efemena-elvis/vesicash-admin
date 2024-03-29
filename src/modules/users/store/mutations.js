export default {
  SAVE_ALL_USERS: (state, users) => (state.users = users),

  SAVE_USER_PROFILE: (state, profile) => (state.user_profile = profile),

  SAVE_USER_TXN: (state, txn) => (state.user_txn = txn),

  SAVE_USER_FX_TXN: (state, fx) => (state.user_fx_txn = fx),

  SAVE_CONNECTED_USERS: (state, users) => (state.connected_users = users),

  SAVE_VESICASH_MODERATORS: (state, moderators) =>
    (state.vesicash_moderators = moderators),

  SAVE_MODERATORS_ACCESS_TYPES: (state, data) =>
    (state.moderator_access_types = data),
};
