import { Fab, WithStyles, withStyles } from "@material-ui/core";
import React from "react";

import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import Text from "../../components/Text";
import styles from "./DocumentRevisionControlPreview.styles";
import DocumentRevisionItemPresenter from "./DocumentRevisionItem.presenter";

interface OwnProps extends WithStyles<typeof styles> {
  documentsInChangeRequest: DocumentRevision[];
  selectAssessmentForm: () => void;
  selectDocumentRevision: (documentRevision: DocumentRevision) => void;
  selectedDocumentRevision: string | null;
}

export type DocumentRevisionControlPreviewPresenterProps = OwnProps;

export const DocumentRevisionControlPreviewPresenter: React.FunctionComponent<
  DocumentRevisionControlPreviewPresenterProps
> = ({
  documentsInChangeRequest,
  selectAssessmentForm,
  selectDocumentRevision,
  selectedDocumentRevision,
  classes,
}) => {
  const renderDocumentRevisions = () =>
    documentsInChangeRequest.map((documentRevision) => (
      <DocumentRevisionItemPresenter
        key={documentRevision.id}
        documentRevision={documentRevision}
        selectedDocumentRevision={selectedDocumentRevision!}
        onClick={() => selectDocumentRevision(documentRevision)}
      />
    ));

  return (
    <div className={classes.container}>
      <Fab
        color="primary"
        variant="extended"
        size="large"
        onClick={selectAssessmentForm}
      >
        <Text translation="changeRequest.documentControl.changeRequestForm" />
      </Fab>
      <div className={classes.documentRevisionContainer}>
        {renderDocumentRevisions()}
      </div>
    </div>
  );
};

export default withStyles(styles)(DocumentRevisionControlPreviewPresenter);
