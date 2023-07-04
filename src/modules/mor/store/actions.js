import $api from "@/services/service-api";

const routes = {
    api_metrics:'admin/tokens',

    api_keys:(query)=> `admin/tokens/list?${query}`,

    api_requests:(query)=>`admin/list-feature-request?${query}`,

    update_request: `admin/feature-request`,

    mor_summary:'https://mor.cn.vesicash.com/v2/admin/transactions/summary',

    record_transaction:`https://mor.cn.vesicash.com/v2/admin/transaction/record`,

    send_payouts:'https://mor.cn.vesicash.com/v2/admin/payout/to-wallet',

    mor_transactions: (query)=> `https://mor.cn.vesicash.com/v2/admin/transactions/get?limit=15${query}`,

    mor_withdrawals: (query)=> `https://mor.cn.vesicash.com/v2/admin/withdrawal/get-all?limit=15${query}`,

    mor_payouts: (query)=> `https://mor.cn.vesicash.com/v2/admin/payouts/get?limit=15${query}`,

    mor_users: 'https://mor.cn.vesicash.com/v2/admin/settings/get',

    mor_user:'https://mor.cn.vesicash.com/v2/admin/settings/get?search=',

    mor_verifications: (query)=>`https://mor.cn.vesicash.com/v2/admin/settings/get?${query}`,

    mor_countries:'https://mor.cn.vesicash.com/v2/countries/mor',

    approve_mor_doc: (id) => `https://mor.cn.vesicash.com/v2/admin/settings/${id}/document`
};

export default {
    fetchAPIMetrics:async({commit})=>{
        const response = await $api.fetch(routes.api_metrics);
        if(response?.code === 200) commit('SAVE_API_METRICS', response?.data);
        return response;
    },

    fetchAPIkeys:async({commit},query)=>{
        const _query = decodeURIComponent(location.search)
        const response = await $api.fetch(routes.api_keys(query));
        if(response?.code === 200 && _query === decodeURIComponent(location.search)) commit('SAVE_API_KEYS', response?.data);
        return response;
    },

    fetchAPIRequests:async({commit},query)=>{
        const _query = decodeURIComponent(location.search)
        const response = await $api.fetch(routes.api_requests(query));
        if(response?.code === 200 && _query === decodeURIComponent(location.search)) commit('SAVE_API_REQUESTS', response?.data);
        return response;
    },

    fetchMORSummary:async({commit})=>{
        const response = await $api.fetch(routes.mor_summary);
        if(response?.code === 200) commit('SAVE_MOR_SUMMARY', response?.data);
        return response;
    },

    
    fetchMORTransactions:async({commit},query)=>{
        const _query = decodeURIComponent(location.search)
        const response = await $api.fetch(routes.mor_transactions(query));
        if(response?.code === 200 && _query === decodeURIComponent(location.search)) commit('SAVE_MOR_TRANSACTIONS', response);
        return response;
        // SAVE_MOR_WITHDRAWALS
    },

    fetchMORWithdrawals:async({commit},query)=>{
        const _query = decodeURIComponent(location.search)
        const response = await $api.fetch(routes.mor_withdrawals(query));
        if(response?.code === 200 && _query === decodeURIComponent(location.search)) commit('SAVE_MOR_WITHDRAWALS', response);
        return response;
        // 
    },

    fetchMORPayouts:async({commit},query)=>{
        const _query = decodeURIComponent(location.search)
        const response = await $api.fetch(routes.mor_payouts(query));
        if(response?.code === 200 && _query === decodeURIComponent(location.search)) commit('SAVE_MOR_PAYOUTS', response);
        return response;
    },

    fetchMORUsers:async({commit})=>{
        const response = await $api.fetch(routes.mor_users);
        if(response?.code === 200) commit('SAVE_MOR_USERS', response?.data || []);
        return response;
    },

    fetchMORUser:async(_,account_id)=>{
        const response = await $api.fetch(routes.mor_user+account_id);
        return response;
    },

    fetchMORVerifications:async({commit},query)=>{
        const _query = decodeURIComponent(location.search)
        const response = await $api.fetch(routes.mor_verifications(query));
        if(response?.code === 200 && _query === decodeURIComponent(location.search)) commit('SAVE_MOR_VERIFICATIONS', response?.data || response?.data || []);
        return response;
    },

    fetchMORCountries:async({commit})=>{
        const response = await $api.fetch(routes.mor_countries);
        if(response?.code === 200) commit('SAVE_MOR_COUNTRIES', response?.data);
        return response;
    },

    updateAPIRequests:async(_, payload)=>{
        return await $api.push(routes.update_request,{payload});
    },

    approveMORDoc:async(_, {payload, id})=>{
      return await $api.push(routes.approve_mor_doc(id),{payload});
    },

    saveMORtransaction:async(_, payload)=>{
        return await $api.push(routes.record_transaction,{payload});
    },

    sendMORPayout:async(_, payload)=>{
        return await $api.push(routes.send_payouts,{payload});
    },
};
