import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { TrainingRecordQuery } from "../../../state/ducks/training/types";
import Text from "../../components/Text";
import { DialogHandler } from "../../hooks/useDialog";
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
      <Dialog
        disableBackdropClick={true}
        open={dialog.isOpen}
        classes={{ paper: classes.dialogContent }}
        fullWidth
        maxWidth="md"
      >
        <IconButton className={classes.closeButton} onClick={dialog.close}>
          <CloseIcon />
        </IconButton>
        <DialogTitle>
          <Typography className={classes.dialogTitle}>
            <Text translation={"training.acknowledge.completion"} />
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
                  {training.trainingPlan?.document.docId}
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
             &nbsp; {training.trainingPlan?.document.docId}
                </span>
              </Grid>
              <Grid item xs={12} className={classes.item}>
                <Box>
                  <span className={classes.itemContentBlue}>
                    {training.trainingPlan?.employee.user?.name}
                  </span> | Trainee |
                  <span>
                  &nbsp; {getFormattedDateString(training.completedAt, MomentFormats.MonthDateYearAlt)}
                  </span>
                </Box>
              </Grid>
              <Grid item xs={12} className={classes.item}>
                <Box display="flex" justifyContent="flex-start">
                  <Button
                    variant="outlined"
                    color="secondary"
                    style={{ margin: 0 }}
                  >
                    <Text translation="common.send.to.email" />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  };

export default TrainingDetails;
