import { datadogRum } from '@datadog/browser-rum';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { deleteCookie } from '../../common/utils/helpers';
import { authSelectors } from '../../state/ducks/auth';
import { companySelectors } from '../../state/ducks/company';

export const DataDog: React.FunctionComponent<any> = () => {
  const companyId = useSelector(companySelectors.companyIdSelector);
  const companyName = useSelector(companySelectors.companyNameSelector);
  const employeeId = useSelector(authSelectors.currentEmployeeId);
  const userName = useSelector(authSelectors.currentUserName);

  useEffect(() => {
    if (
      companyId.length === 0
      || companyName.length === 0
      || employeeId.length === 0) {
      datadogRum.removeUser();
    } else {
      deleteCookie('_dd_s');
      datadogRum.setUser({
        id: employeeId,
        name: `${userName} (${companyName})`,
      });
    }
  }, [companyId, companyName, employeeId, userName]);

  return null;

};
