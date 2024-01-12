import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as SlackLogo } from '../../../../../assets/images/slack_full_logo.svg';
import { translate } from '../../../../../common/intl';
import { redirectTo } from '../../../../../common/redirectHandler';
import { getHasSlack } from '../../../../../common/utils/selectors';
import Config from '../../../../../config';
import { Permission } from '../../../../../state/ducks/auth/types';
import { companySelectors } from '../../../../../state/ducks/company';
import { userManagementActions } from '../../../../../state/ducks/userManagement';
import { COMPANY_SLACK_URL } from '../../../../../state/ducks/userManagement/constants';
import { Button } from '../../../../components/forms/fields-next';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';

const SlackIntergrationItem: React.FC = () => {
  const hasSlackPermission = useSelector(getHasSlack(Permission.SLACK_APP_INSTALL));
  const slackTeamId = useSelector(companySelectors.slackTeamId);
  const isEnabled = useSelector(companySelectors.isSlackIntegrationEnabled);
  const isActive = isEnabled && Boolean(slackTeamId);

  const getSlackUrlAction = useActionCreator(userManagementActions.getSlackUrl);

  const asyncSlack = useAsync<string>({
    onSuccess: (slackUrl) => {
      if (slackUrl) {
        redirectTo(slackUrl)();
      }
    },
  });

  const enableIntegration = () => {
    asyncSlack.start(
      getSlackUrlAction,
      Config.SlackCompanyUri,
      COMPANY_SLACK_URL,
      asyncSlack,
    );
  };

  if (!hasSlackPermission) {
    return null;
  }

  return (
    <>
      <ListItemText><SlackLogo height={20} /></ListItemText>
      <ListItemSecondaryAction>
        {isActive ? (
          <>
            <FontAwesomeIcon icon={regular('circle-check')} style={{ fontSize: '20px', color: '#0DB78D', marginRight: '4px', verticalAlign: 'text-bottom' }} />
            <span style={{ marginRight: '8px', verticalAlign: 'middle' }}>{translate('integrations.enabled')}</span>
            <Button size="small" kind="outlined" disabled style={{ verticalAlign: 'middle' }}>
              {translate('integrations.disable')}
            </Button>
          </>
        ) : (
          <Button size="small" kind="outlined" onClick={enableIntegration}>
            {translate('integrations.enable')}
          </Button>
        )}
      </ListItemSecondaryAction>
    </>
  );
};

export default SlackIntergrationItem;
