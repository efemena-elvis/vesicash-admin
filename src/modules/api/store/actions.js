import $api from "@/services/service-api";

const routes = {
    api_metrics:'admin/tokens',

    api_keys:(query)=> `admin/tokens/list?${query}`
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
    }
};
