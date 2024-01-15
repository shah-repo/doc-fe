import React from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as SlackLogo } from '../../../../../assets/images/slack_full_logo.svg';
import { redirectTo } from '../../../../../common/redirectHandler';
import { getHasPermission } from '../../../../../common/utils/selectors';
import Config from '../../../../../config';
import { Permission } from '../../../../../state/ducks/auth/types';
import { companySelectors } from '../../../../../state/ducks/company';
import { userManagementActions } from '../../../../../state/ducks/userManagement';
import { COMPANY_SLACK_URL } from '../../../../../state/ducks/userManagement/constants';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import IntegrationItem from './IntegrationItem';

const SlackIntergrationItem: React.FC = () => {
  const hasPermission = useSelector(getHasPermission(Permission.SLACK_APP_INSTALL));
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

  if (!hasPermission) {
    return null;
  }

  return (
    <IntegrationItem
      isActive={isActive}
      isDisabled={async.isLoading || isActive}
      onToggle={toggleIntegration}
    >
      <SlackLogo height={20} />
    </IntegrationItem>
  );
};

export default SlackIntergrationItem;
