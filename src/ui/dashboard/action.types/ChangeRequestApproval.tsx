import React, { useState } from "react";
import { useIntl } from "react-intl";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { changeRequestEditPath } from "../../change.request/utils/paths";
import DashboardCRBase from "./DashboardCRbase";

interface Props {
  index: number;
  changeRequest: ChangeRequest;
}

export const ChangeRequestApproval: React.FunctionComponent<Props> = ({
  index,
  changeRequest,
}) => {
  const intl = useIntl();
  const [crTitle] = useState(intl.formatMessage(
    { id: "dashboard.title.change.request" },
    { crId: changeRequest.crId, name: changeRequest.owner.user.name },
  ));

  return (
    <DashboardCRBase
      changeRequest={changeRequest}
      crTitle={crTitle}
      url={changeRequestEditPath(changeRequest.id)}
    />
  );
};

export default ChangeRequestApproval;
