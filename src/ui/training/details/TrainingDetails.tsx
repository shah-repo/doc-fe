import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { getFormattedDateString, MomentFormats } from '../../../common/utils/date';
import { TrainingRecordQuery } from '../../../state/ducks/training/types';
import AttachmentIconPresenter from '../../components/common/attachment.icon/presenter';
import Text from '../../components/Text';
import { DialogHandler } from '../../hooks/useDialog';
import ExportTrainingRecordToEmail from '../export.email/ExportTrainingRecordToEmail';
import { styles } from './styles';

interface Props {
  dialog: DialogHandler
  training: TrainingRecordQuery
}

//testing data
const attachments = [
  {
    'createdAt': '2024-04-03T22:12:37.287Z',
    'updatedAt': '2024-04-03T22:12:37.287Z',
    'id': 'd070f625-8825-44fc-9cc2-54264a5f33fb',
    'name': 'DAM-00001.X Supplement for Document Prefix and Approval Matrix ',
    'description': null,
    'type': 'pdf',
    'lineType': 'CLEAN_COPY',
    'version': null,
    's3link': 'attachment_replacements/v1/attachment_replacement.pdf',
    's3linkCleanCopy': null,
    'billIds': [],
    'importMetadataJson': {},
    'cleanCopyStatus': 'NOT_REQUIRED',
    'companyId': 'c796e86f-b8ae-4483-b5e5-87a739875a49',
    'fileSizeS3Link': 298353,
    'fileSizeS3LinkCleanCopy': null,
    'owner': {
      'createdAt': '2023-02-24T23:38:17.700Z',
      'updatedAt': '2024-04-08T22:50:57.579Z',
      'id': 'ca6ae56e-d5fa-4c18-a260-98d08ac80915',
      'companyId': 'c796e86f-b8ae-4483-b5e5-87a739875a49',
      'active': true,
      'slackUserId': null,
    },
    'isComplete': true,
  },
  {
    'createdAt': '2024-04-03T22:12:37.004Z',
    'updatedAt': '2024-04-03T22:12:37.004Z',
    'id': '4d2ef388-af48-488e-b4ff-66d0e2677b94',
    'name': 'DAM-00001.X Supplement for Document Prefix and Approval Matrix ',
    'description': null,
    'type': 'docx',
    'lineType': 'CLEAN_COPY',
    'version': null,
    's3link': 'attachment_replacements/v1/attachment_replacement.docx',
    's3linkCleanCopy': null,
    'billIds': [],
    'importMetadataJson': {},
    'cleanCopyStatus': 'NOT_REQUIRED',
    'companyId': 'c796e86f-b8ae-4483-b5e5-87a739875a49',
    'fileSizeS3Link': 78699,
    'fileSizeS3LinkCleanCopy': null,
    'owner': {
      'createdAt': '2023-02-24T23:38:17.700Z',
      'updatedAt': '2024-04-08T22:50:57.579Z',
      'id': 'ca6ae56e-d5fa-4c18-a260-98d08ac80915',
      'companyId': 'c796e86f-b8ae-4483-b5e5-87a739875a49',
      'active': true,
      'slackUserId': null,
    },
    'isComplete': true,
  },
  {
    'createdAt': '2024-04-03T22:12:26.721Z',
    'updatedAt': '2024-04-03T22:12:26.721Z',
    'id': '6e63d932-1c14-4b21-8144-757d5f6db723',
    'name': 'DAM-00001.W Supplement for Document Prefix and Approval Matrix ',
    'description': null,
    'type': 'pdf',
    'lineType': 'RED_LINE',
    'version': null,
    's3link': 'attachment_replacements/v1/attachment_replacement.pdf',
    's3linkCleanCopy': null,
    'billIds': [],
    'importMetadataJson': {},
    'cleanCopyStatus': 'NOT_REQUIRED',
    'companyId': 'c796e86f-b8ae-4483-b5e5-87a739875a49',
    'fileSizeS3Link': 299389,
    'fileSizeS3LinkCleanCopy': null,
    'owner': {
      'createdAt': '2023-02-24T23:38:17.700Z',
      'updatedAt': '2024-04-08T22:50:57.579Z',
      'id': 'ca6ae56e-d5fa-4c18-a260-98d08ac80915',
      'companyId': 'c796e86f-b8ae-4483-b5e5-87a739875a49',
      'active': true,
      'slackUserId': null,
    },
    'isComplete': true,
  },
  {
    'createdAt': '2024-04-03T22:12:26.698Z',
    'updatedAt': '2024-04-03T22:12:26.698Z',
    'id': 'd8c797ff-e56d-4867-81d8-d1db9481ca5d',
    'name': 'DAM-00001.W Supplement for Document Prefix and Approval Matrix ',
    'description': null,
    'type': 'docx',
    'lineType': 'RED_LINE',
    'version': null,
    's3link': 'attachment_replacements/v1/attachment_replacement.docx',
    's3linkCleanCopy': null,
    'billIds': [],
    'importMetadataJson': {},
    'cleanCopyStatus': 'NOT_REQUIRED',
    'companyId': 'c796e86f-b8ae-4483-b5e5-87a739875a49',
    'fileSizeS3Link': 75770,
    'fileSizeS3LinkCleanCopy': null,
    'owner': {
      'createdAt': '2023-02-24T23:38:17.700Z',
      'updatedAt': '2024-04-08T22:50:57.579Z',
      'id': 'ca6ae56e-d5fa-4c18-a260-98d08ac80915',
      'companyId': 'c796e86f-b8ae-4483-b5e5-87a739875a49',
      'active': true,
      'slackUserId': null,
    },
    'isComplete': true,
  },
];

const TrainingDetails: React.FunctionComponent<Props>
  = ({
    dialog,
    training,
  }) => {
    const classes = styles();
    return (
      <>
        <IconButton className={classes.closeButton} onClick={dialog.close}>
          <CloseIcon data-cy="close-icon" />
        </IconButton>
        <DialogTitle>
          <Grid container>
            <Grid item xs="auto">
              <FontAwesomeIcon icon={regular('graduation-cap')} className={classes.titleIcon} />
            </Grid>
            <Grid item xs={11}>
              <Typography className={classes.dialogTitle}>
                <Text translation="common.training.record" />
              </Typography>
            </Grid>
          </Grid>
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
                  {training.trainingPlan?.document.docId}&nbsp;
                  Rev &nbsp;
                  {training.documentRevision?.displayRevision}
                </Box>
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
                <span>
                  <Text translation="training.acknowledge.completed.statement" />
                </span>
                <span className={classes.itemContentBlack}>
                  &nbsp;
                  {training.trainingPlan?.document.docId}&nbsp;
                  Rev &nbsp;
                  {training.documentRevision?.displayRevision}
                </span>&nbsp;
                <span>
                  on {training.completedAt
                    && <span>
                      &nbsp; {getFormattedDateString(training.completedAt, MomentFormats.MonthDateYear)}
                    </span>
                  }
                </span>
              </Grid>
              <Grid item xs={12} className={classes.item}>
                <Box>
                  <span className={classes.itemContentBlack}>
                    {training.trainingPlan?.employee.user?.name}
                  </span> | Trainee &nbsp;
                </Box>
              </Grid>
              <Grid item xs={12} className={classes.item}>
                <Box display="flex" justifyContent="flex-start">
                  <ExportTrainingRecordToEmail id={training.id} color="primary" />
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.item}>
              <Typography className={classes.label}>
                <Text translation="common.attachments" />
              </Typography>
              <Grid container>
                {attachments.map(attachment => <Grid item xs={6}>
                  <AttachmentIconPresenter attachment={attachment} />
                </Grid>)}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </>
    );
  };

export default TrainingDetails;
