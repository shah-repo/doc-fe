import { ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as HelloSignLogo } from '../../../../../assets/images/hello-sign.svg';
import { translate } from '../../../../../common/intl';
import { getHasPermission } from '../../../../../common/utils/selectors';
import { Permission } from '../../../../../state/ducks/auth/types';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import { Button } from '../../../../components/forms/fields-next';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import EnabledLabel from './EnabledLabel';

const HelloSignIntergrationItem: React.FC = () => {
  const canUpdateCompany = useSelector(getHasPermission(Permission.COMPANY_UPDATE_CURRENT));
  const isActive = useSelector(companySelectors.getCompanyMine).helloSignIntegrationEnabled;
  const async = useAsync();
  const changeCompanyAction = useActionCreator(companyActions.updateCompanyMine);

  if (!canUpdateCompany) {
    return null;
  }

  const toggleIntegration = (value: boolean) => () => {
    async.start(changeCompanyAction, { helloSignIntegrationEnabled: value }, async);
  };

  return (
    <>
      <ListItemText><HelloSignLogo height={20} /></ListItemText>
      <ListItemSecondaryAction>
        <EnabledLabel isActive={isActive} />
        <Button
          size="small"
          kind="outlined"
          onClick={toggleIntegration(!isActive)}
          disabled={async.isLoading}
        >
          {translate(isActive ? 'integrations.disable' : 'integrations.enable')}
        </Button>
      </ListItemSecondaryAction>
    </>
  );
};

export default HelloSignIntergrationItem;
