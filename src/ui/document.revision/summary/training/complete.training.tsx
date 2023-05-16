import { Box, Typography } from '@material-ui/core';
import { isEmpty } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { documentRevisionsSelectors } from '../../../../state/ducks/documentRevisions';
import { Document, DocumentRevision, DocumentRevisionDocument } from '../../../../state/ducks/documentRevisions/types';
import { trainingActions } from '../../../../state/ducks/training';
import { TrainingPlanTransition, TrainingRecord } from '../../../../state/ducks/training/types';
import { ApplicationState } from '../../../../state/reducers';
import { EffectiveDateFormValues, PasswordFormValues } from '../../../change.request/form/types';
import Text from '../../../components/Text';
import { styles as AutoCompleteStyles } from '../../../form.builder/styles/FBAutocomplete.styles';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import TrainingDialog from './dialog/TrainingDialog';

interface Props {
  trainingRecords: TrainingRecord[];
  id: string;
  document: DocumentRevisionDocument;
  docDetails: Partial<DocumentRevision>;
}

const CompleteTraining: React.FunctionComponent<Props> = ({
  trainingRecords,
  id,
  document,
  docDetails,
}) => {
  const dialog = useDialog();
  const async = useAsync();
  const completeTrainingAction = useActionCreator(trainingActions.completeSelfTaughtTraining);
  const doc: Document = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocument(state, document?.id)
  );
  const docHasRetrain = doc?.documentRevisions.filter((item) => item.retrain);

  const openDialog = () => {
    async.reset();
    dialog.open();
  };

  const transition = TrainingPlanTransition.Complete;
  const label = 'training.complete';

  if (!isEmpty(trainingRecords) || isEmpty(docHasRetrain)) {
    return null;
  }

  const onSubmit = (values: PasswordFormValues | EffectiveDateFormValues) => {
    async.start(
      completeTrainingAction,
      id,
      {
        docRev: {
          id,
        },
      },
      values,
      async,
    );
  };

  return (
    <Box mt={5} ml={2}>
      <Typography style={AutoCompleteStyles.labelFont}>
        <Text translation="training.acknowledge.completion.link" />
      </Typography>
      <TrainingDialog
        transitionDialog={dialog}
        openDialog={openDialog}
        onSubmit={onSubmit}
        asyncState={async.asyncState}
        transition={transition}
        label={label}
        docDetails={docDetails}
      />
    </Box>
  );
};

export default CompleteTraining;
