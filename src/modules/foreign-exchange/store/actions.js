import $api from "@/services/service-api";

const routes = {
    fetch_fx_stats:"/business/rates/statistics",
    update_rate:"/rate",
    fetch_fx_txn:(query)=> `/exchange-transactions?${query}`,
    fetch_fx_rates:(query)=> `/rates?${query}`
};

export default {
    fetchFXStats: async ({commit}) => {
        const response = await $api.use('admin').fetch(routes.fetch_fx_stats);
        if(response?.code === 200) commit('SAVE_FX_STATS', response?.data);
        return response;
    },

    updateRate: async(_,payload)=>{
        return $api.use('admin').push(routes.update_rate,{payload})
    },

    fetchFXTxns: async ({commit}, query="") => {
     const response = await $api.use('admin').fetch(routes.fetch_fx_txn(query));
     const _query = query ? `?${query}` : query;
     if(response?.code === 200 && decodeURIComponent(location.search) === _query) commit('SAVE_FX_TXN',response?.data);
     return response;
    },

    fetchFXRates: async ({commit}, query="") => {
        const response = await $api.use('admin').fetch(routes.fetch_fx_rates(query));
        const _query = query ? `?${query}` : query;
        if(response?.code === 200 && decodeURIComponent(location.search) === _query) commit('SAVE_FX_RATES',response?.data);
        return response;
       }
};
