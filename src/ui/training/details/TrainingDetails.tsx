import { Box, DialogContent, DialogTitle, Grid, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { TrainingRecordQuery } from "../../../state/ducks/training/types";
import Text from "../../components/Text";
import { DialogHandler } from "../../hooks/useDialog";
import ExportTrainingRecordToEmail from "../export.email/ExportTrainingRecordToEmail";
import { styles } from "./styles";

interface Props {
  dialog: DialogHandler;
  training: TrainingRecordQuery;
}

const TrainingDetails: React.FunctionComponent<Props> =
  ({
    dialog,
    training,
  }) => {
    const classes = styles();

    return (
      <>
        <IconButton className={classes.closeButton} onClick={dialog.close}>
          <CloseIcon data-cy="close-icon"/>
        </IconButton>
        <DialogTitle>
          <Typography className={classes.dialogTitle}>
            <Text translation={"common.training.record"}/>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={6}>
              <Grid item xs={12} className={classes.item}>
                <Typography className={classes.label}>
                  <Text translation="training.trn.id" />
                  <Box className={classes.itemContentBlue}>
                    {training.trId}
                  </Box>
                </Typography>
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
            <Grid item xs={6} >
              <Grid item xs={12} className={classes.item}>
                <span className={classes.label}>
                  <Text translation="training.acknowledge.completed.statement"/>
                </span>
                <span className={classes.itemContentBlue}>
                  &nbsp;
                  {training.trainingPlan?.document.docId}&nbsp;
                  Rev &nbsp;
                  {training.documentRevision?.displayRevision}
                </span>
              </Grid>
              <Grid item xs={12} className={classes.item}>
                <Box>
                  <span className={classes.itemContentBlue}>
                    {training.trainingPlan?.employee.user?.name}
                  </span> | Trainee &nbsp;
                  { training.completedAt &&
                    <span>
                    | &nbsp; {getFormattedDateString(training.completedAt, MomentFormats.DateTime)}
                    </span>
                  }
                </Box>
              </Grid>
              <Grid item xs={12} className={classes.item}>
                <Box display="flex" justifyContent="flex-start">
                  <ExportTrainingRecordToEmail id={training.id}/>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </>
    );
  };

export default TrainingDetails;
