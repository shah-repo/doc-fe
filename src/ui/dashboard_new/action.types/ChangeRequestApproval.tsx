import React, { useState } from "react";
import { useIntl } from "react-intl";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { changeRequestEditPath } from "../../change.request/utils/paths";
import DashboardCRBase from "./NewDashboardCRbase";

interface Props {
  index: number;
  changeRequest: ChangeRequest;
}

const ChangeRequestApproval: React.FunctionComponent<Props> = ({
  index,
  changeRequest,
}) => {
  const intl = useIntl();
  console.log("changeRequest::", changeRequest);
  const [crTitle] = useState(intl.formatMessage(
    { id: "dashboard.title.change.request" },
    { crId: changeRequest.crId, name: changeRequest.owner.user.name },
  ));

  return (
    <DashboardCRBase
      crId={changeRequest.id}
      crTitle={crTitle}
      title={changeRequest.title}
      url={changeRequestEditPath(changeRequest.id)}
      crIdName={changeRequest.crId}
      owner={changeRequest.owner.user.name}
      avatar={changeRequest.owner.user.avatar}
      createdAt={getFormattedDateString(changeRequest.createdAt, MomentFormats.DateTime)}
    />
  );
};

export default ChangeRequestApproval;
