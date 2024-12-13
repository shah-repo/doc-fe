import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, DialogContent, DialogTitle, Grid, IconButton, Tooltip, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import React from 'react';
import { translate } from '../../../common/intl';
import { getFormattedDateString, MomentFormats } from '../../../common/utils/date';
import { TrainingRecordQuery } from '../../../state/ducks/training/types';
import AttachmentIconPresenter from '../../components/common/attachment.icon/presenter';
import DocumentRevisionDialog from '../../components/common/dialogs/DocumentRevisionDialog';
import { IconButton as IButton } from '../../components/forms/fields-next';
import Text from '../../components/Text';
import { FBFieldName } from '../../form.builder';
import { Trainee, TraineeAttachment } from '../../form.builder/FBTraineeList/types';
import useDialog, { DialogHandler } from '../../hooks/useDialog';
import useHover from '../../hooks/useHover';
import ExportTrainingRecordToEmail from '../export.email/ExportTrainingRecordToEmail';
import ReferenceLink from './ReferenceLink';
import { styles } from './styles';

interface TrainingDetailsProps {
  dialog: DialogHandler
  training: TrainingRecordQuery
}

const TrainingDetails: React.FunctionComponent<TrainingDetailsProps> = ({ dialog, training }) => {
  const classes = styles();

  const referencesIds = training.trainingPlan?.sourceReferencesIds ?? [];
  const references = training.trainingPlan?.sourceReferences ?? [];
  const attachments = training.attachments ?? references.reduce(
    (acc: TraineeAttachment[], item) => {
      const grptTraineeList = (item.formInput?.[FBFieldName.GRPTTraineeList] ?? []) as Trainee[];
      const recordTrainee = grptTraineeList.find(traineeItem => training.id === traineeItem.trainingRecordId);

      if (recordTrainee && !isEmpty(recordTrainee.attachments)) {
        acc.push(...recordTrainee.attachments);
      }

      return acc;
    },
    [],
  );
  const quickViewDialog = useDialog();
  const referenceClassName = cx(classes.refID, classes.itemContentBlue);

  const [docRevRef, isDocRevRefHovered] = useHover<HTMLButtonElement>();
  const [refIdRef, isRefIdRefHovered] = useHover<HTMLButtonElement>();
  const [docRevId, setDocRevId] = React.useState('');
  const [parentRevId, setParentRevId] = React.useState('');

  const onOpenDialog = (docRevId, parentRevId) => {
    setDocRevId(docRevId);
    setParentRevId(parentRevId);
    quickViewDialog.open();
  };

  return (
    <>
      <IconButton className={classes.closeButton} onClick={dialog.close}>
        <CloseIcon data-cy="close-icon" />
      </IconButton>
      <DialogTitle>
        <Box className={classes.dialogTitle}>
          <FontAwesomeIcon
            className={classes.titleIcon}
            icon={regular('graduation-cap')}
          />
          <Text translation="common.training.record" />
        </Box>
      </DialogTitle>
      <DialogContent className={classes.detailsDialogContent}>
        <Grid container>
          <Grid item xs={5}>
            <Grid item xs={12} className={classes.item}>
              <Typography className={classes.label}>
                <Text translation="training.trn.id" />
              </Typography>
              <Box>
                {training.trId}
              </Box>
            </Grid>
            <Grid item xs={12} className={classes.item}>
              <Typography className={classes.label}>
                <Text translation="training.doc.id.rev" />
              </Typography>
              <>
                <ReferenceLink
                  className={referenceClassName}
                  label={translate('common.displayRevision', {
                    docId: training.trainingPlan?.document.docId,
                    displayRevision: training.documentRevision?.displayRevision,
                  })}
                  documentId={training.documentRevision?.documentId}
                  revisionId={training.documentRevision?.id}
                />
                <Tooltip title={translate('commom.quick.view')}>
                  <IButton
                    kind="simple"
                    ref={refIdRef}
                    onClick={() => onOpenDialog(training.documentRevision?.id, training.documentRevision?.documentId)}>
                    <FontAwesomeIcon icon={isRefIdRefHovered ? solid('eye') : regular('eye')} />
                  </IButton>
                </Tooltip>
              </>
            </Grid>
            {!isEmpty(referencesIds) && (
              <Grid item xs={12} className={classes.item}>
                <Typography className={classes.label}>
                  <Text translation="training.ref.id" />
                </Typography>
                {referencesIds.map((item, index, arr) => (
                  <>
                    <ReferenceLink
                      key={item.docId}
                      className={referenceClassName}
                      label={item.docId}
                      documentId={item.documentId}
                      revisionId={item.revisionId}
                    />
                    <Tooltip title={translate('commom.quick.view')}>
                      <IButton
                        kind="simple"
                        ref={docRevRef}
                        onClick={() => onOpenDialog(item.revisionId, item.documentId)}>
                        <FontAwesomeIcon icon={isDocRevRefHovered ? solid('eye') : regular('eye')} />
                      </IButton>
                    </Tooltip>
                    {index < (arr.length - 1) && ', '}
                  </>
                ))}
              </Grid>
            )}
            <Grid item xs={12} className={classes.item}>
              <Typography className={classes.label}>
                <Text translation="common.title" />
              </Typography>
              <Box>
                {training.documentRevision?.name || '-'}
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={7} className={classes.rightContainer} >
            <Grid item xs={12} className={classes.item}>
              {translate('training.acknowledge.completed.statement', {
                revision: (
                  <span className={classes.itemContentBlack}>
                    {translate('common.displayRevision', {
                      docId: training.trainingPlan?.document.docId,
                      displayRevision: training.documentRevision?.displayRevision,
                    })}
                  </span>
                ) as unknown as string,
                date: training.completedAt ? getFormattedDateString(training.completedAt, MomentFormats.MonthDateYear) : null,
              })}
            </Grid>
            <Grid item xs={12} className={classes.item}>
              <Box>
                <span className={classes.itemContentBlack}>
                  {training.trainingPlan?.employee.user?.name}
                </span>
                {' | '}
                <Text translation="common.trainee" />
              </Box>
            </Grid>
            <Grid item xs={12} className={classes.item}>
              <Box display="flex" justifyContent="flex-start">
                <ExportTrainingRecordToEmail id={training.id} />
              </Box>
            </Grid>
          </Grid>
          {Boolean(attachments?.length) && (
            <Grid item xs={12} className={classes.item}>
              <Typography className={classes.label}>
                <Text translation="common.attachments" />
              </Typography>
              <Grid container>
                {attachments?.map(attachment => (
                  <Grid key={attachment.id} item xs={6}>
                    <AttachmentIconPresenter attachment={attachment} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      { quickViewDialog.isOpen
        && <DocumentRevisionDialog dialog={quickViewDialog} {...{ docRevId, parentRevId }} />
      }
    </>
  );
};

export default TrainingDetails;
