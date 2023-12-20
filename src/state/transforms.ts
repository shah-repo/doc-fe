import { createTransform } from 'redux-persist';
import { UserState } from './ducks/auth/types';
import { WhiteLabelingEnv } from './ducks/company/types';

export const authTransform = createTransform<UserState, UserState>(
  (inboundState) => {
    return {
      ...inboundState,
      employees: inboundState.employees.map(employee => ({
        ...employee,
        company: {
          ...employee.company,
          whiteLabeling: Object.entries(employee.company.whiteLabeling ?? {}).reduce((result, [key, config]: [string, WhiteLabelingEnv]) => ({
            ...result,
            [key]: {
              ...config,
              colors: {},
            },
          }), {}),
          addresses: [],
          acctCodes: [],
        },
      })),
    };
  },
  (outboundState) => {
    return outboundState;
  },
  {
    whitelist: ['user'],
  },
);
