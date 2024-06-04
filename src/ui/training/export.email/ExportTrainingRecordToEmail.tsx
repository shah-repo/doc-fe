import * as React from 'react';
import { useIntl } from 'react-intl';
import { trainingActions } from '../../../state/ducks/training';
import Text from '../../components/Text';
import { Button } from '../../components/forms/fields-next';
import { toastError, toastSuccess } from '../../components/notifications';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';

interface Props {
  id: string
}

const ExportTrainingRecordToEmail: React.FunctionComponent<Props> = ({
  id,
}) => {
  const intl = useIntl();
  const exportTrainingRecordEmail = useActionCreator(trainingActions.exportTrainingRecord);

  const async = useAsync({
    onSuccess: () => {
      toastSuccess(intl.formatMessage({ id: 'common.send.to.email.success' }));
    },
    onError: () => {
      toastError(intl.formatMessage({ id: 'common.send.to.email.error' }));
    },
  });

  const handleTrainingRecordEmail = () => {
    async.start(exportTrainingRecordEmail, id, async);
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      data-cy="exportToEmail"
      onClick={() => handleTrainingRecordEmail()}
    >
      <Text translation="common.send.to.email" />
    </Button>
  );
};

export default ExportTrainingRecordToEmail;
