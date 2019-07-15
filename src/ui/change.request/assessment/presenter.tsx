import { Box, Grid, Paper, Typography } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { ErrorMessage } from "formik";
import { Field } from "formik";
import { TextField } from "formik-material-ui";
import React from "react";
import { AssessmentType } from "../../../state/ducks/changeRequest";
import Text from "../../components/Text";
import { AssessmentProps } from "../utils/types";
import Item from "./item";
import styles from "./styles";

type Props = AssessmentProps & WithStyles <typeof styles>;

const Presenter: React.FunctionComponent<Props> = ({
  classes,
  form,
}) => {

  const descriptionRenderer = () => (
    <Field
      component={TextField}
      name="assessments.description"
      label={<Text translation="common.description" />}
      className={classes.textField}
      margin="normal"
      variant="filled"
      multiline={true}
      rows="2"
      fullWidth={true}
    />
  );

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
        {descriptionRenderer()}
        <Grid container={true} spacing={3}>
          {itemRenderer()}
        </Grid>
      </Paper>
    </React.Fragment>
  );
};

export default withStyles(styles)(Presenter);
