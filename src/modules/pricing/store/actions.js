import $api from "@/services/service-api";

const routes = {
  list_charges: (type) => `/charge?type=${type}`,
  list_charge_ranges: "/charge-range",
  create_charge: "/charge",
};

export default {
  fetchCharges: async ({ commit }, type) => {
    const response = await $api.use("admin").fetch(routes.list_charges(type));
    if (response?.code === 200)
      commit("SAVE_CHARGES", { data: response?.data, key: type });
    return response;
  },

  fetchChargeRanges: async ({ commit }) => {
    const response = await $api.use("admin").fetch(routes.list_charge_ranges);
    if (response?.code === 200) commit("SAVE_CHARGE_RANGES", response?.data);
    return response;
  },

  createCharge: async (_, payload) => {
    return await $api.use("admin").push(routes.create_charge, { payload });
  },
};
