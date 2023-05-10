import $api from "@/services/service-api";

const routes = {
    api_metrics:'admin/tokens',

    api_keys:(query)=> `admin/tokens/list?${query}`,

    api_requests:(query)=>`admin/list-feature-request?${query}`,

    update_request: `admin/feature-request`
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

    updateAPIRequests:async(_, payload)=>{
        return await $api.push(routes.update_request,{payload});
    }
};
