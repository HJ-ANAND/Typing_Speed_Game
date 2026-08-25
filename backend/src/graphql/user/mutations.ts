import { login, register } from "../../auth/auth.service.js";

export const mutations = {
  register: async (
    _: unknown,
    { input }: { input: {
      name: string;
      email: string;
      password: string;
    } },
  ) => {
    return register(input);
  },

  login: async (
    _: unknown,
    { input }: { input: {
      email: string;
      password: string;
    } },
  ) => {
    return login(input);
  },
};
