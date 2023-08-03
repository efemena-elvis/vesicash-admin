import $api from "@/services/service-api";

const routes = {
    api_metrics:'/tokens',

    api_keys:(query)=> `/tokens/list?${query}`,

    api_requests:(query)=>`/list-feature-request?${query}`,

    update_request: `/feature-request`
};

export default {
    fetchAPIMetrics:async({commit})=>{
        const response = await $api.use('admin').fetch(routes.api_metrics);
        if(response?.code === 200) commit('SAVE_API_METRICS', response?.data);
        return response;
    },

    fetchAPIkeys:async({commit},query)=>{
        const _query = decodeURIComponent(location.search)
        const response = await $api.use('admin').fetch(routes.api_keys(query));
        if(response?.code === 200 && _query === decodeURIComponent(location.search)) commit('SAVE_API_KEYS', response?.data);
        return response;
    },

    fetchAPIRequests:async({commit},query)=>{
        const _query = decodeURIComponent(location.search)
        const response = await $api.use('admin').fetch(routes.api_requests(query));
        if(response?.code === 200 && _query === decodeURIComponent(location.search)) commit('SAVE_API_REQUESTS', response?.data);
        return response;
    },

    updateAPIRequests:async(_, payload)=>{
        return await $api.use('admin').push(routes.update_request,{payload});
    }
};
