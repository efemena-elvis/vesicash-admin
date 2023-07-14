import $api from "@/services/service-api";

const routes = {
    mor_summary:'/admin/transactions/summary',

    record_transaction:`/admin/transaction/record`,

    send_payouts:'/admin/payout/to-wallet',

    mor_transactions: (query)=> `/admin/transactions/get?limit=15${query}`,

    mor_withdrawals: (query)=> `/admin/withdrawal/get-all?limit=15${query}`,

    mor_payouts: (query)=> `/admin/payouts/get?limit=15${query}`,

    mor_users: '/admin/settings/get',

    mor_user:'/admin/settings/get?search=',

    mor_verifications: (query)=>`/admin/settings/get?${query}`,

    pending_mor_verifications:'/admin/settings/get',

    mor_countries:'/countries/mor',

    approve_mor_doc: (id) => `/admin/settings/${id}/document`,

    complete_mor_withdrawal: (id)=>`/admin/withdrawal/complete/${id}`
};

export default {
    fetchAPIMetrics:async({commit})=>{
        const response = await $api.use('mor','v2').fetch(routes.api_metrics);
        if(response?.code === 200) commit('SAVE_API_METRICS', response?.data);
        return response;
    },

    fetchAPIkeys:async({commit},query)=>{
        const _query = decodeURIComponent(location.search)
        const response = await $api.use('mor','v2').fetch(routes.api_keys(query));
        if(response?.code === 200 && _query === decodeURIComponent(location.search)) commit('SAVE_API_KEYS', response?.data);
        return response;
    },

    fetchAPIRequests:async({commit},query)=>{
        const _query = decodeURIComponent(location.search)
        const response = await $api.use('mor','v2').fetch(routes.api_requests(query));
        if(response?.code === 200 && _query === decodeURIComponent(location.search)) commit('SAVE_API_REQUESTS', response?.data);
        return response;
    },

    fetchMORSummary:async({commit})=>{
        const response = await $api.use('mor','v2').fetch(routes.mor_summary);
        if(response?.code === 200) commit('SAVE_MOR_SUMMARY', response?.data);
        return response;
    },

    
    fetchMORTransactions:async({commit},query)=>{
        const _query = decodeURIComponent(location.search)
        const response = await $api.use('mor','v2').fetch(routes.mor_transactions(query));
        if(response?.code === 200 && _query === decodeURIComponent(location.search)) commit('SAVE_MOR_TRANSACTIONS', response);
        return response;
        // SAVE_MOR_WITHDRAWALS
    },

    fetchMORWithdrawals:async({commit},query)=>{
        const _query = decodeURIComponent(location.search)
        const response = await $api.use('mor','v2').fetch(routes.mor_withdrawals(query));
        if(response?.code === 200 && _query === decodeURIComponent(location.search)) commit('SAVE_MOR_WITHDRAWALS', response);
        return response;
        // 
    },

    fetchMORPayouts:async({commit},query)=>{
        const _query = decodeURIComponent(location.search)
        const response = await $api.use('mor','v2').fetch(routes.mor_payouts(query));
        if(response?.code === 200 && _query === decodeURIComponent(location.search)) commit('SAVE_MOR_PAYOUTS', response);
        return response;
    },

    fetchMORUsers:async({commit})=>{
        const response = await $api.use('mor','v2').fetch(routes.mor_users);
        if(response?.code === 200) commit('SAVE_MOR_USERS', response?.data || []);
        return response;
    },

    fetchMORUser:async(_,account_id)=>{
        const response = await $api.use('mor','v2').fetch(routes.mor_user+account_id);
        return response;
    },

    fetchMORVerifications:async({commit},query)=>{
        const _query = decodeURIComponent(location.search)
        const response = await $api.use('mor','v2').fetch(routes.mor_verifications(query));
        if(response?.code === 200 && _query === decodeURIComponent(location.search)) commit('SAVE_MOR_VERIFICATIONS', response?.data || response?.data || []);
        return response;
    },

    fetchPendingMORVerifications:async({commit})=>{
        commit('SAVE_PENDING_MOR_VERIFICATIONS', 0)
        const response = await $api.use('mor','v2').fetch(routes.pending_mor_verifications);
        if(response?.code === 200) {
            const count = (response?.data || [])?.filter(user=>!user?.is_verified)?.length;
            commit('SAVE_PENDING_MOR_VERIFICATIONS', count);
        }
        return response;
    },

    fetchMORCountries:async({commit})=>{
        const response = await $api.use('auth','v2').fetch(routes.mor_countries);
        if(response?.code === 200) commit('SAVE_MOR_COUNTRIES', response?.data);
        return response;
    },

    
    approveMORDoc:async(_, {payload, id})=>{
      return await $api.use('mor','v2').push(routes.approve_mor_doc(id),{payload});
    },

    completeMORWithdrawal:async(_, id)=>{
        return await $api.use('mor','v2').patch(routes.complete_mor_withdrawal(id),{payload:{}});
    },

    saveMORtransaction:async(_, payload)=>{
        return await $api.use('mor','v2').push(routes.record_transaction,{payload});
    },

    sendMORPayout:async(_, payload)=>{
        return await $api.use('mor','v2').push(routes.send_payouts,{payload});
    },
};
