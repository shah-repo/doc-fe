import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import classMerge from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../common/intl';
import { MomentFormats, getFormattedDateString } from '../../../common/utils/date';
import { TrainingRecordQuery } from '../../../state/ducks/training/types';
import Text from '../../components/Text';
import AttachmentIconPresenter from '../../components/common/attachment.icon/presenter';
import { DialogHandler } from '../../hooks/useDialog';
import ExportTrainingRecordToEmail from '../export.email/ExportTrainingRecordToEmail';
import { styles } from './styles';

interface Props {
  dialog: DialogHandler
  training: TrainingRecordQuery
}

const TrainingDetails: React.FunctionComponent<Props> = ({ dialog, training }) => {
  const classes = styles();

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
              <Box className={classes.itemContentBlue}>
                {translate('common.displayRevision', {
                  docId: training.trainingPlan?.document.docId,
                  displayRevision: training.documentRevision?.displayRevision,
                })}
              </Box>
            </Grid>
            <Grid item xs={12} className={classes.item}>
              <Typography className={classes.label}>
                <Text translation="training.ref.id" />
              </Typography>
              <Link to="TODO path to parent doc" className={classMerge(classes.refID, classes.itemContentBlue)}>Ref ID</Link>
            </Grid>
            <Grid item xs={12} className={classes.item}>
              <Typography className={classes.label}>
                <Text translation="common.title" />
              </Typography>
              <Box>
                {training.documentRevision?.name}
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
          {Boolean(training.attachments?.length) && (
            <Grid item xs={12} className={classes.item}>
              <Typography className={classes.label}>
                <Text translation="common.attachments" />
              </Typography>
              <Grid container>
                {training.attachments?.map(attachment => (
                  <Grid key={attachment.id} item xs={6}>
                    <AttachmentIconPresenter attachment={attachment} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </>
  );
};

export default TrainingDetails;
