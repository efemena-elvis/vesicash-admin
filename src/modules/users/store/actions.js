import $api from "@/services/service-api";

const routes = {
  connected_users: (query) => `/users?${query}`,
  user_profile: (account_id) => `/user/fetch/${account_id}`,
  user_txn: `/business/transactions`,
  txn_details: `/business/transactions/listById`,
  user_fx_txn: "/user/exchange-transactions",
  wallet_withdrawals: (account_id, page) =>
    `/user/fetch/${account_id}/withdrawal/?page=${page}`,
  wallet_fundings: (account_id, page) =>
    `/user/fetch/${account_id}/funding/?page=${page}`,
  vesicash_moderators:'/moderators',  
  moderator_access_types:'/access-type',

  approve_decline_txn:'/approve-wallet-transaction',  

  delete_user: "/user/delete",
  approve_doc: "/verification/mark/verified",
  reject_doc:"/verification/mark/rejected",

  remove_user_bank:"/user/remove/bank",
  update_dollar_account:"/user/update/bank",

  generate_token:"/tokens/generate",
  revoke_token:"/tokens/revoke",
  add_moderator:"/add-moderator",
  update_moderator:"/update-moderator",
  delete_moderator:"/delete-moderator"
};

export default {
  //FETCH ACTIONS

  fetchAllConnectedUsers: async ({ commit }, query = "") => {
    let response = await $api.use('admin').fetch(routes.connected_users(query));
    const _query = query ? `?${query}` : query;
    //SAVE ONLY RESPONSE CODE 200 AND DATA THAT MATCHES CURRENT URL (TRICKY _O-O_)
    if (response.code === 200 && _query === decodeURIComponent(location.search))
      commit("SAVE_ALL_USERS", response.data);
    return response;
  },

  fetchUserProfile: async ({ commit }, account_id) => {
    const response = await $api.use('admin').fetch(routes.user_profile(account_id));
    if (response?.code === 200) commit("SAVE_USER_PROFILE", response.data);
    return response;
  },

  fetchUserTransactions: async ({ commit }, payload) => {
    const response = await $api.use('admin').push(routes.user_txn, { payload });
    if (response?.code === 200) commit("SAVE_USER_TXN", response.data);
    return response;
  },

  fetchTransactionDetails: async (_, transaction_id) => {
    const response = await $api.use('admin').push(routes.txn_details, {
      payload: { transaction_id },
    });
    return response;
  },

  fetchAllFxTransactions: async ({ commit }, payload) => {
    const response = await $api.use('admin').push(routes.user_fx_txn, { payload });
    if (response?.code === 200) commit("SAVE_USER_FX_TXN", response?.data);
    return response;
  },

  fetchWalletWithdrawals: async (_, { account_id, page }) => {
    return await $api.use('admin').fetch(routes.wallet_withdrawals(account_id, page));
  },

  fetchWalletFundings: async (_, { account_id, page }) => {
    return await $api.use('admin').fetch(routes.wallet_fundings(account_id, page));
  },

  fetchConnectedUsers: async ({ commit }) => {
    return new Promise((res) =>
      setTimeout(() => {
        const user = {
          lastname: "Ogedengbe",
          firstname: "Patrick",
          email_address: "pat@qa.team",
          username: "Patty",
          phone_number: "0908477783",
        };

        commit("SAVE_CONNECTED_USERS", [user]);

        res({ code: 200, data: [user] });
      }, 1000)
    );
  },

  fetchVesicashModerators: async ({commit}) => {
    const response = await $api.use('admin').fetch(routes.vesicash_moderators);
    if(response?.code === 200) commit('SAVE_VESICASH_MODERATORS',response?.data)
    return response;
  },

  fetchModeratorsAccessTypes: async({commit}) => {
    const response = await $api.use('admin').fetch(routes.moderator_access_types);
    if(response?.code === 200) commit('SAVE_MODERATORS_ACCESS_TYPES',response?.data);
    return response;
  },

  //UPDATE AND DELETE ACTIONS

  approveOrDeclineTransaction:async (_,payload)=> {
    return await $api.use('admin').push(routes.approve_decline_txn, { payload });
  },

  deleteUser: async (_, payload) => {
    return await $api.use('admin').push(routes.delete_user, { payload });
  },

  removeUserBank: async (_, payload) => {
    return await $api.use('admin').push(routes.remove_user_bank, { payload });
  },

  updateUserDollarAccount: async (_, payload)=> {
    return await $api.use('admin').push(routes.update_dollar_account, { payload });
  },

  approveUserDoc: async (_, payload) => {
    return await $api.use('admin').push(routes.approve_doc, { payload });
  },

  rejectUserDoc: async (_, payload) => {
    return await $api.use('admin').push(routes.reject_doc, { payload });
  },
  
  generateUserAPIKey: async (_, payload) => {
    return await $api.use('admin').push(routes.generate_token, { payload });
  },

  revokeUserAPIKey: async (_, payload) => {
    return await $api.use('admin').push(routes.revoke_token, { payload });
  },

  addModerator: async (_, payload) => {
    return await $api.use('admin').push(routes.add_moderator, { payload });
  },

  updateModerator: async (_, payload) => {
    return await $api.use('admin').push(routes.update_moderator, { payload });
  },

  deleteModerator: async (_, payload) => {
    return await $api.use('admin').remove(routes.delete_moderator, { payload, resolve:true });
  },
};
