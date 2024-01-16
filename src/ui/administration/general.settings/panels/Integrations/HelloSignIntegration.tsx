import React from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as HelloSignLogo } from '../../../../../assets/images/hello-sign.svg';
import { getHasPermission } from '../../../../../common/utils/selectors';
import { Permission } from '../../../../../state/ducks/auth/types';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import IntegrationItem from './IntegrationItem';

const HelloSignIntergrationItem: React.FC = () => {
  const hasPermission = useSelector(getHasPermission(Permission.COMPANY_UPDATE_CURRENT));
  const isActive = useSelector(companySelectors.getCompanyMine).helloSignIntegrationEnabled;
  const isAvailable = false;

  const changeCompanyAction = useActionCreator(companyActions.updateCompanyMine);
  const async = useAsync();

  if (!hasPermission || !isAvailable) {
    return null;
  }

  const toggleIntegration = (value: boolean) => () => {
    async.start(changeCompanyAction, { helloSignIntegrationEnabled: value }, async);
  };

  return (
    <IntegrationItem
      isActive={isActive}
      isDisabled={async.isLoading}
      onToggle={toggleIntegration(!isActive)}
    >
      <HelloSignLogo height={20} />
    </IntegrationItem>
  );
};

export default HelloSignIntergrationItem;
