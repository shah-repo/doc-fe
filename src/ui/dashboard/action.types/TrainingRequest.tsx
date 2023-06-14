import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { getFormattedStartOfDayDateString } from '../../../common/utils/date';
import { TrainingRecord } from '../../../state/ducks/training/types';
import { documentVersionPath } from '../../document.revision/utils/paths';
import DashboardActionTypeBase from './DashboardActionTypeBase';

interface Props {
  index: number
  trainingRecord: TrainingRecord
}

const TrainingRequest: React.FunctionComponent<Props> = ({
  index,
  trainingRecord,
}) => {
  const isDue = useMemo(() => moment().isAfter(trainingRecord.dueOn), [trainingRecord.dueOn]);
  const intl = useIntl();

  const docRevId = trainingRecord.documentRevision.id || '';
  const docId = trainingRecord.trainingPlan?.document.id || '';

  const [title] = useState(intl.formatMessage(
    { id: 'dashboard.title.training' },
    {
      docId: trainingRecord?.trainingPlan?.document.docId,
      version: trainingRecord?.documentRevision?.displayRevision,
      docTitle: trainingRecord?.documentRevision?.name,
    },
  ));

  const [description] = useState(intl.formatMessage(
    { id: 'dashboard.assigned.training' },
    { dueDate: getFormattedStartOfDayDateString(trainingRecord.dueOn) },
  ));

  const [alertMessage] = useState(() => {
    if (!isDue) {
      return '';
    }
    return ` - ${
      intl.formatMessage(
        { id: 'common.overdue' },
      )
    }`;
  });

  return (
    <DashboardActionTypeBase
      url={documentVersionPath(docRevId, docId)}
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
