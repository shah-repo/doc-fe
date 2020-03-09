import { Fab, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import Text from "../../components/Text";
import { documentVersionPath } from "../../document.revision/utils/paths";
import styles from "./DocumentRevisionControlPreview.styles";
import DocumentRevisionItemPresenter from "./DocumentRevisionItem.presenter";


interface OwnProps extends WithStyles<typeof styles> {
  documentsInChangeRequest: DocumentRevision[];
}

export type DocumentRevisionControlPreviewPresenterProps = OwnProps;

export const DocumentRevisionControlPreviewPresenter: React.FunctionComponent<DocumentRevisionControlPreviewPresenterProps> = ({
  documentsInChangeRequest,
  classes,
}) => {
  const openLink = (documentRevision) => () =>
    window.open(documentVersionPath(documentRevision.id, documentRevision.document.id), "_blank");
  const renderDocumentRevisions = () =>
    documentsInChangeRequest.map((documentRevision) => (
      <DocumentRevisionItemPresenter
        key={documentRevision.id}
        documentRevision={documentRevision}
        onClick={openLink(documentRevision)}
      />
    ));

  return (
    <div className={classes.container}>
      <Fab
        color="primary"
        variant="extended"
        size="large"
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
