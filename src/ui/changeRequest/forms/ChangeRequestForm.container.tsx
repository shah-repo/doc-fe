import { Grid, WithStyles, withStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { AsyncState } from "../../../state/types";
import DocumentRevisionControlContainer from "../documentRevision/DocumentRevisionControl.container";
import { ChangeRequestFormPresenter } from "./ChangeRequestForm.presenter";
import styles from "./styles";
import { ChangeRequestFormValues } from "./types";

interface OwnProps {
  initialValues: ChangeRequestFormValues;
  onSubmit: (values: ChangeRequestFormValues) => void;
  asyncState: AsyncState;
  changeRequest?: ChangeRequest;
  doNotPrompt?: boolean;
}

type ChangeRequestFormContainerProps = OwnProps &
WithStyles<typeof styles>;

export const ChangeRequestFormContainer: React.FunctionComponent<
ChangeRequestFormContainerProps
> = ({
  classes,
  onSubmit,
  asyncState,
  initialValues,
  changeRequest,
  doNotPrompt,
}) => {
  const [documentRevisionsList, setDocumentRevisionsList] = useState<string[]>(
    initialValues.documentRevisions,
  );
  const [documentsInCrById, setDocumentsInCrById] = useState({});

  useEffect(() => {
    if (changeRequest && changeRequest.documentRevisions) {
      setDocumentsInCrById(
        changeRequest.documentRevisions.reduce(
          (acc, docRev: DocumentRevision) => ({ ...acc, [docRev.id]: docRev }),
          {},
        ),
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(changeRequest || {}).documentRevisions]);


  return (
    <Grid container={true} className={classes.whiteContainer}>
      <Grid container={true} spacing={4}>
        <Grid item={true} xs={12} sm={3} md={2}>
          <DocumentRevisionControlContainer
            setDocumentRevisionsList={setDocumentRevisionsList}
            documentsInChangeRequest={documentRevisionsList}
            documentsInCrById={documentsInCrById}
          />
        </Grid>
        <ChangeRequestFormPresenter
          initialValues={initialValues}
          onSubmit={onSubmit}
          asyncState={asyncState}
          doNotPrompt={doNotPrompt}
          changeRequest={changeRequest}
          documentRevisionsList={documentRevisionsList}
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ChangeRequestFormContainer);
