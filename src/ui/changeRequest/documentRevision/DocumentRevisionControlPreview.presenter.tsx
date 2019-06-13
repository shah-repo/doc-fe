import React from 'react';
import { WithStyles, withStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Chip from '@material-ui/core/Chip';

import Text from "../../components/Text";
import { DocumentRevision } from '../../../state/ducks/documentRevisions';
import styles from "./DocumentRevisionControlPreview.styles";

interface OwnProps extends WithStyles<typeof styles> {
  documentsInChangeRequest: DocumentRevision[];
  selectAssessmentForm: () => void;
  selectDocumentRevision: (documentRevision: DocumentRevision) => void;
}

export type DocumentRevisionControlPreviewPresenterProps = OwnProps;

export const DocumentRevisionControlPreviewPresenter: React.FunctionComponent<DocumentRevisionControlPreviewPresenterProps> = ({
  documentsInChangeRequest, selectAssessmentForm, selectDocumentRevision, classes,
}) => {
  const renderDocumentRevisions = () => (
    documentsInChangeRequest.map((documentRevision) => (
      <Chip
        className={classes.documentRevision}
        key={documentRevision.id}
        label={documentRevision.name}
        onClick={() => selectDocumentRevision(documentRevision)}
      />
    ))
  )

  return (
    <div className={classes.container}>
      <Button variant="contained" color="primary" onClick={selectAssessmentForm} fullWidth>
        <Text translation="changeRequest.documentControl.assessmentForm" />
      </Button>
      <div className={classes.documentRevisionContainer}>
        {renderDocumentRevisions()}
      </div>
    </div>
  );
};

export default withStyles(styles)(DocumentRevisionControlPreviewPresenter);