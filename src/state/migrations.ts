import { DEFAULT_EMPLOYEE } from "./ducks/auth/reducers";

export default {
  0: (state: any) => ({
    ...state,
    auth: {
      ...state.auth,
      user: {
        ...state.auth.user,
        employees: [],
      },
    },
  }),
  1: (state: any) => ({
    ...state,
    auth: {
      ...state.auth,
      user: {
        ...state.auth.user,
        employee: DEFAULT_EMPLOYEE,
      },
    },
  }),
  2: (state: any) => ({
    ...state,
    auth: {
      ...state.auth,
      user: {
        ...state.auth.user,
        employee: DEFAULT_EMPLOYEE,
      },
      groups: {
        ...state.auth.groups,
      },
    },
  }),
};
