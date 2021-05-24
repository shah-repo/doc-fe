import { Box } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { getHasSlack } from "../../../common/utils/selectors";
import Config from "../../../config";
import { Permission } from "../../../state/ducks/auth/types";
import { companySelectors } from "../../../state/ducks/company";
import { userManagementActions } from "../../../state/ducks/userManagement";
import { COMPANY_SLACK_URL } from "../../../state/ducks/userManagement/constants";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import AddSlackButtonPresenter from "./AddSlackButton.presenter";

const AddSlackButtonContainer: React.FunctionComponent<{}> = () => {
  const hasSlackPermission = useSelector(getHasSlack(Permission.SLACK_APP_INSTALL));
  const isSlackIntegrationEnabled = useSelector(companySelectors.isSlackIntegrationEnabled);
  const slackTeamId = useSelector(companySelectors.slackTeamId);

  const getSlackUrlAction = useActionCreator(userManagementActions.getSlackUrl);

  const asyncSlack = useAsync<string>({
    onSuccess: (slackUrl) => {
      window.open(slackUrl);
    },
  });

  const onAdd = () => {
    asyncSlack.start(
      getSlackUrlAction,
      Config.SlackCompanyUri,
      COMPANY_SLACK_URL,
      asyncSlack
    );
  };

  return (
    <Box>
      {hasSlackPermission && isSlackIntegrationEnabled && !slackTeamId &&
        <AddSlackButtonPresenter
          addSlack={onAdd}
        />
      }
    </Box>
  );
};

export default AddSlackButtonContainer;
