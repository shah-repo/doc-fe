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
};
