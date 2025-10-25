import api from "../../../service/api";

const BASE_URL = "api/plans";

export const planApi = {
  getAllPlans: async () => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  getPlanById: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  createPlan: async (planData) => {
    const response = await api.post(BASE_URL, planData);
    return response.data;
  },

  updatePlan: async (id, planData) => {
    const response = await api.put(`${BASE_URL}/${id}`, planData);
    return response.data;
  },

  deletePlan: async (id) => {
    await api.delete(`${BASE_URL}/${id}`);
  },
};