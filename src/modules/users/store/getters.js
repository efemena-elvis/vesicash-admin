export default {
  getAllConnectedUsers: (state) => state.users,

  getUserProfile: (state) => state.user_profile,

  getUserTxn: (state) => state.user_txn,

  getFxTable: (state) => state.user_fx_txn,

  getConnectedUsers: (state) => state.connected_users,

  getVesicashModerators: (state) => state.vesicash_moderators,

  getModeratorAccessTypes: (state) => state.moderator_access_types,
};
