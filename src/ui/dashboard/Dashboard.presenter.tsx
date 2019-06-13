import { Button, Grid, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import AsyncGate from "../components/AsyncGate";
import Text from "../components/Text";
import { DOCUMENT_REVISION_CREATE_URL } from "../constants/urls";
import styles from "./Dashboard.styles";
import DocumentReviews from "./DocumentReviews.presenter";
import DocumentTable from "./DocumentTable.presenter";
import { DashboardPresenterParentProps, DocumentActionProps } from "./types";

type DashboardPresenterProps = DashboardPresenterParentProps & DocumentActionProps & WithStyles<typeof styles>;

const DashboardPresenter: React.FunctionComponent<DashboardPresenterProps> = ({
  classes,
  currentUserEmail,
  loadDocumentsAsyncState, loadDocuments, documents,
  loadDocumentsToReviewAsyncState, loadDocumentsToReview, documentsToReview,
  editDocument, previewDocument, cloneDocument,
}) => {
  return (
    <Grid container={true} className={classes.root} spacing={24}>
      <Grid item={true} xs={12} md={9} className={classes.item}>
        <div className={classes.buttons}>
          <RouterLink to={DOCUMENT_REVISION_CREATE_URL} className={classes.createDocumentLink}>
            <Button variant="contained" color="primary">
              <Text translation="dashboard.createDocument" />
            </Button>
          </RouterLink>
        </div>
        <AsyncGate asyncAction={loadDocuments} asyncState={loadDocumentsAsyncState} startActionOnMount={true}>
          <DocumentTable
            documents={documents}
            currentUserEmail={currentUserEmail}
            editDocument={editDocument}
            previewDocument={previewDocument}
            cloneDocument={cloneDocument}
          />
        </AsyncGate>
      </Grid>
      <Grid item={true} xs={12} md={3} className={classes.item}>
        <AsyncGate
          asyncAction={loadDocumentsToReview}
          asyncState={loadDocumentsToReviewAsyncState}
          startActionOnMount={true}
        >
          <DocumentReviews documentsToReview={documentsToReview} />
        </AsyncGate>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(DashboardPresenter);
