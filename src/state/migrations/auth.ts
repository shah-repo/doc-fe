import { DEFAULT_EMPLOYEE } from '../ducks/auth/reducers';
import { WhiteLabelingEnv } from '../ducks/company/types';

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
  3: (state: any) => ({
    ...state,
    user: {
      ...state.user,
      employees: state.user.employees.map(employee => ({
        ...employee,
        company: {
          ...employee.company,
          whiteLabeling: Object.entries(employee.company.whiteLabeling ?? {}).reduce((result, [key, config]) => ({
            ...result,
            [key]: {
              ...(config as WhiteLabelingEnv),
              colors: {},
            },
          }), {}),
          addresses: [],
          acctCodes: [],
        },
      })),
    },
  }),
};
