import React, { useState } from "react";
import { useIntl } from "react-intl";
import { getFormattedStartOfDayDateString } from "../../../common/utils/date";
import { TrainingRecord } from "../../../state/ducks/training";
import { documentDetailsPath } from "../../document.revision/utils/paths";
import DashboardActionTypeBase from "./DashboardActionTypeBase";

interface OwnProps {
  key: number;
  trainingRecord: TrainingRecord;
}

type Props = OwnProps;

export const TrainingRequest: React.FunctionComponent<Props> = ({
  key,
  trainingRecord,
}) => {
  const intl = useIntl();
  const [title] = useState(intl.formatMessage(
    { id: "dashboard.title.training" },
    { docId: trainingRecord?.trainingPlan?.document.docId },
  ));
  const [description] = useState(intl.formatMessage(
    { id: "dashboard.assigned.training" },
    { dueDate: getFormattedStartOfDayDateString(trainingRecord.dueOn) },
  ));

  return (
    <DashboardActionTypeBase
      key={key}
      title={title}
      description={description}
      url={documentDetailsPath(trainingRecord.trainingPlan?.document.id || "")}
    />
  );
};

export default TrainingRequest;
