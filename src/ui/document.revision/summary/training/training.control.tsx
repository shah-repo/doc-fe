import { Box, Typography } from '@material-ui/core';
import React, { useMemo } from 'react';
import { trainingActions } from '../../../../state/ducks/training';
import { TrainingPlanTransition } from '../../../../state/ducks/training/types';
import { EffectiveDateFormValues } from '../../../change.request/form/types';
import Text from '../../../components/Text';
import { PasswordFormValues } from '../../../components/transitionDialog/types';
import { styles as AutoCompleteStyles } from '../../../form.builder/styles/FBAutocomplete.styles';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import { TrainingControlProps } from '../../utils/types';
import TrainingDialog from './dialog/TrainingDialog';

type Props = TrainingControlProps;

const TrainingControl: React.FunctionComponent<Props> = ({
  dataProp,
  documentRevisionId,
  docDetails,
}) => {
  const applyTransition = useActionCreator(trainingActions.applyTransition);
  const dialog = useDialog();
  const async = useAsync({ onSuccess: dialog.close });

  const trainingRecord = useMemo(() =>
    dataProp
    && dataProp.find((record) => !record.completedAt && record.isValid)
  , [dataProp]);

  if (!trainingRecord) {
    return null;
  }

  const transition = TrainingPlanTransition.Complete;
  const label = 'training.complete';

  const openDialog = () => {
    async.reset();
    dialog.open();
  };

  const onSubmit = (values: PasswordFormValues | EffectiveDateFormValues) => {
    async.start(
      applyTransition,
      trainingRecord.id,
      documentRevisionId,
      values,
      transition,
      async,
    );
  };

  return (
    <Box mt={3.75} mb={3.75} ml={2}>
      <Typography style={AutoCompleteStyles.labelFont}>
        <Text translation="training.acknowledge.completion.link" />
        <TrainingDialog
          transitionDialog={dialog}
          openDialog={openDialog}
          onSubmit={onSubmit}
          asyncState={async.asyncState}
          transition={transition}
          label={label}
          docDetails={docDetails}
          trId={trainingRecord.trId}
        />
      </Typography>
    </Box>
  );
};

export default TrainingControl;
