import moment from "moment";
import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { getFormattedStartOfDayDateString } from "../../../common/utils/date";
import { TrainingRecord } from "../../../state/ducks/training";
import { documentDetailsPath } from "../../document.revision/utils/paths";
import DashboardActionTypeBase from "./DashboardActionTypeBase";

interface OwnProps {
  index: number;
  trainingRecord: TrainingRecord;
}

type Props = OwnProps;

const TrainingRequest: React.FunctionComponent<Props> = ({
  index,
  trainingRecord,
}) => {
  const isDue = useMemo(() => moment().isAfter(trainingRecord.dueOn), [trainingRecord.dueOn]);
  const intl = useIntl();
  const [title] = useState(intl.formatMessage(
    { id: "dashboard.title.training" },
    { docId: trainingRecord?.trainingPlan?.document.docId },
  ));
  const [description] = useState(intl.formatMessage(
    { id: "dashboard.assigned.training" },
    { dueDate: getFormattedStartOfDayDateString(trainingRecord.dueOn) },
  ));
  const [alertMessage] = useState(() => {
    if (!isDue) {
      return "";
    }
    return ` - ${
      intl.formatMessage(
        { id: "common.overdue" },
      )
    }`;
  });

  return (
    <DashboardActionTypeBase
      url={documentDetailsPath(trainingRecord.trainingPlan?.document.id || "")}
      alert={isDue}
      {...{
        alertMessage,
        description,
        index,
        title,
      }}
    />
  );
};

export default TrainingRequest;
