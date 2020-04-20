import React, { useState } from "react";
import { useIntl } from "react-intl";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { changeRequestEditPath } from "../../change.request/utils/paths";
import DashboardActionTypeBase from "./DashboardActionTypeBase";

interface Props {
  index: number;
  changeRequest: ChangeRequest;
}

export const ChangeRequestApproval: React.FunctionComponent<Props> = ({
  index,
  changeRequest,
}) => {
  const intl = useIntl();
  const [title] = useState(intl.formatMessage(
    { id: "dashboard.title.change.request" },
    { crId: changeRequest.crId },
  ));
  const [description] = useState(intl.formatMessage(
    { id: "dashboard.assigned.change.request" },
    { name: changeRequest.owner.user.name },
  ));

  return (
    <DashboardActionTypeBase
      index={index}
      title={title}
      description={description}
      url={changeRequestEditPath(changeRequest.id)}
    />
  );
};

export default ChangeRequestApproval;
