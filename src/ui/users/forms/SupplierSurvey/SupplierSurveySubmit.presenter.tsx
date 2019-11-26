import {
  WithStyles,
  withStyles,
} from "@material-ui/core";
import * as React from "react";
import Text from "../../../components/Text";
import styles from "./SupplierSurvey.styles";

const SupplierSurveySubmitPresenter: React.FunctionComponent<WithStyles<typeof styles>> = ({
  classes,
}) => {
  return (
    <div className={classes.root}>
      <Text translation="supplier.survey.submitMessage" />
    </div>
  );
};

export default withStyles(styles)(SupplierSurveySubmitPresenter);
