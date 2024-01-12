import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        {isActive ? (
          <>
            <FontAwesomeIcon icon={regular('circle-check')} style={{ fontSize: '20px', color: '#0DB78D', marginRight: '4px', verticalAlign: 'text-bottom' }} />
            <span style={{ marginRight: '8px', verticalAlign: 'middle' }}>{translate('integrations.enabled')}</span>
            <Button size="small" kind="outlined" onClick={toggleIntegration(false)} style={{ verticalAlign: 'middle' }}>
              {translate('integrations.disable')}
            </Button>
          </>
        ) : (
          <Button size="small" kind="outlined" onClick={toggleIntegration(true)}>
            {translate('integrations.enable')}
          </Button>
        )}
      </ListItemSecondaryAction>
    </>
  );
};

export default HelloSignIntergrationItem;
