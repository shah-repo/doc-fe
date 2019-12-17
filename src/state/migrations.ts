import { DEFAULT_EMPLOYEE } from "./ducks/auth/reducers";

export default {
  0: (state: any) => {
    return {
      ...state,
      auth: {
        ...state.auth,
        user: {
          ...state.auth.user,
          employees: [],
        },
      },
    };
  },
  1: (state: any) => {
    return {
      ...state,
      auth: {
        ...state.auth,
        user: {
          ...state.auth.user,
          employee: DEFAULT_EMPLOYEE,
        },
      },
    };
  },
};
