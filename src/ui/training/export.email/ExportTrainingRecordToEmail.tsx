import { Button } from '@material-ui/core';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { trainingActions } from '../../../state/ducks/training';
import { toastError, toastSuccess } from '../../components/notifications';
import Text from '../../components/Text';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';

interface Props {
  id: string
  color?: string
}

const styles = {
  margin: 0,
  borderRadius: '25px',
};

const ExportTrainingRecordToEmail: React.FunctionComponent<Props> = ({
  id,
  color = 'secondary',
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
      color={color}
      data-cy="exportToEmail"
      style={styles}
      onClick={() => handleTrainingRecordEmail()}
    >
      <Text translation="common.send.to.email" />
    </Button>
  );
};

export default ExportTrainingRecordToEmail;
