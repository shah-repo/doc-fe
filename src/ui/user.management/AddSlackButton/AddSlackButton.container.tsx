import { Box } from "@material-ui/core";
import React from "react";
import { connect, useSelector } from "react-redux";
import { getHasSlack } from "../../../common/utils/selectors";
import Config from "../../../config";
import { Permission } from "../../../state/ducks/auth/types";
import { companySelectors } from "../../../state/ducks/company";
import { userManagementActions } from "../../../state/ducks/userManagement";
import { COMPANY_SLACK_URL } from "../../../state/ducks/userManagement/constants";
import { ApplicationState } from "../../../state/reducers";
import useAsync from "../../hooks/useAsync";
import AddSlackButtonPresenter from "./AddSlackButton.presenter";

interface DispatchProps {
  getSlackUrl: typeof userManagementActions.getSlackUrl;
}

interface StateProps {
  isSlackIntegrationEnabled: boolean;
  slackTeamId: string;
}

type Props = DispatchProps & StateProps;

const AddSlackButtonContainer: React.FunctionComponent<Props> = ({
  isSlackIntegrationEnabled,
  getSlackUrl,
  slackTeamId,
}) => {
  const hasSlackPermission = useSelector(getHasSlack(Permission.SLACK_APP_INSTALL));

  const asyncSlack = useAsync<string>({
    onSuccess: (slackUrl) => {
      window.open(slackUrl);
    },
  });

  const onAdd = () => {
    asyncSlack.start(getSlackUrl, Config.SlackCompanyUri, COMPANY_SLACK_URL, asyncSlack);
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

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isSlackIntegrationEnabled: companySelectors.isSlackIntegrationEnabled(state),
  slackTeamId: companySelectors.slackTeamId(state),
});

export default connect<StateProps, DispatchProps, {}, ApplicationState>(mapStateToProps, {
  getSlackUrl: userManagementActions.getSlackUrl,
})(AddSlackButtonContainer);
