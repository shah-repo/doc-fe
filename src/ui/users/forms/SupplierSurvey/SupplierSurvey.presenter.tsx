import {
    withStyles,
    WithStyles,
  } from "@material-ui/core";
import * as React from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import { supplierSurveyActions } from "../../../../state/ducks/supplierSurvey";
import { AsyncState } from "../../../../state/types";
import AsyncGate from "../../../components/AsyncGate";
import styles from "./SupplierSurvey.styles";

interface Props extends WithStyles<typeof styles> {
    token: string;
    loadSupplierSurvey: typeof supplierSurveyActions.loadSupplierSurveyList;
    loadSupplierSurveyListAsyncState: AsyncState;
    supplierSurvey: DocumentRevision[];
  }
const SupplierSurveyPresenter: React.FunctionComponent<Props> = ({
  classes,
  loadSupplierSurvey,
  loadSupplierSurveyListAsyncState,
}) => (
    <AsyncGate
      asyncAction={loadSupplierSurvey}
      asyncState={loadSupplierSurveyListAsyncState}
      startActionOnMount={true}
    >
      <div className={classes.root}>
        "Supplier Survey"
      </div>
    </AsyncGate>
  );

export default withStyles(styles)(SupplierSurveyPresenter);
