export default {
    getAllConnectedUsers: (state) => state.users,

    getUserProfile: (state) => state.user_profile,

    getUserTxn: (state) => state.user_txn,

    getFxTable: (state) => state.user_fx_txn,

    getConnectedUsers: (state) => state.connected_users,
};