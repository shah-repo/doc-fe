import { ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as SlackLogo } from '../../../../../assets/images/slack_full_logo.svg';
import { translate } from '../../../../../common/intl';
import { redirectTo } from '../../../../../common/redirectHandler';
import { getHasPermission } from '../../../../../common/utils/selectors';
import Config from '../../../../../config';
import { Permission } from '../../../../../state/ducks/auth/types';
import { companySelectors } from '../../../../../state/ducks/company';
import { userManagementActions } from '../../../../../state/ducks/userManagement';
import { COMPANY_SLACK_URL } from '../../../../../state/ducks/userManagement/constants';
import { Button } from '../../../../components/forms/fields-next';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import EnabledLabel from './EnabledLabel';

const SlackIntergrationItem: React.FC = () => {
  const hasSlackPermission = useSelector(getHasPermission(Permission.SLACK_APP_INSTALL));
  const slackTeamId = useSelector(companySelectors.slackTeamId);
  const isEnabled = useSelector(companySelectors.isSlackIntegrationEnabled);
  const isActive = isEnabled && Boolean(slackTeamId);

  const getSlackUrlAction = useActionCreator(userManagementActions.getSlackUrl);

  const async = useAsync<string>({
    onSuccess: (slackUrl) => {
      if (slackUrl) {
        redirectTo(slackUrl)();
      }
    },
  });

  const toggleIntegration = () => {
    async.start(
      getSlackUrlAction,
      Config.SlackCompanyUri,
      COMPANY_SLACK_URL,
      async,
    );
  };

  if (!hasSlackPermission) {
    return null;
  }

  return (
    <>
      <ListItemText><SlackLogo height={20} /></ListItemText>
      <ListItemSecondaryAction>
        <EnabledLabel isActive={isActive} />
        <Button
          size="small"
          kind="outlined"
          onClick={toggleIntegration}
          disabled={async.isLoading || isActive}
        >
          {translate(isActive ? 'integrations.disable' : 'integrations.enable')}
        </Button>
      </ListItemSecondaryAction>
    </>
  );
};

export default SlackIntergrationItem;
