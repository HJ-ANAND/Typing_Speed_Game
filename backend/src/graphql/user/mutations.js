import { login, register } from "../../auth/auth.service.js";
export const mutations = {
    register: async (_, { input }) => {
        return register(input);
    },
    login: async (_, { input }) => {
        return login(input);
    },
};
