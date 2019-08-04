import { Box, Grid, Paper, Typography } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { ErrorMessage } from "formik";
import React from "react";
import { AssessmentType } from "../../../../state/ducks/changeRequest";
import FilledInputField from "../../../components/forms/fields/FilledInput";
import Text from "../../../components/Text";
import { AssessmentProps } from "../../utils/types";
import Item from "./item";
import styles from "./styles";

export type Props = AssessmentProps & WithStyles <typeof styles>;

export const Presenter: React.FunctionComponent<Props> = ({
  classes,
  form,
}) => {

  const itemRenderer = () => {
    return Object.values(AssessmentType).map((type) => (
      <Grid key={type} item={true} xs={true}>
        <Item type={type} form={form} />
      </Grid>
    ));
  };

  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <Box component="span" className={classes.error}>
          <ErrorMessage name="assessments" />
        </Box>
        <Typography variant="h5" component="h3">
          <Text translation="common.assessments" />
        </Typography>
        <FilledInputField
          name="assessments.description"
          label="common.description"
          inputProps={{ multiline: true, rows: "2" }}
        />
        <Grid container={true} spacing={3}>
          {itemRenderer()}
        </Grid>
      </Paper>
    </React.Fragment>
  );
};

export default withStyles(styles)(Presenter);
