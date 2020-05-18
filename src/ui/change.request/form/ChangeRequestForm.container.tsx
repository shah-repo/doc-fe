import { Grid, WithStyles, withStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Group } from "../../../state/ducks/auth/types";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { DocumentRevision, documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { AsyncState } from "../../../state/types";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
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
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const [documentTypeGroups, setDocumentTypeGroups] = useState<any[]>([]);
  const [selectedDocumentRevision, setSelectedDocumentRevision] = useState<string | null>(null);
  const [documentRevisionsList, setDocumentRevisionsList] = useState<string[]>(
    initialValues.documentRevisions,
  );
  const [documentsInCrById, setDocumentsInCrById] = useState({});

  const async = useAsync({
    onSuccess: (response: Group[] = []) => {
      setDocumentTypeGroups([
        ...documentTypeGroups,
        response,
      ]);
    },
  });
  const getGroupsByStage = useActionCreator(documentRevisionsActions.loadGroupsByStage);

  useEffect(() => {
    if (changeRequest && changeRequest.documentRevisions) {
      setDocumentsInCrById(
        changeRequest.documentRevisions.reduce(
          (acc, docRev: DocumentRevision) => ({ ...acc, [docRev.id]: docRev }),
          {},
        ),
      );
      changeRequest.documentRevisions.map((docRev) => async.start(
        getGroupsByStage,
        docRev.id,
        async,
      ));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(changeRequest || {}).documentRevisions]);

  const alertIfFormDirty = () => {
    if (!isFormDirty) {
      return true;
    }
    alert(<Text message="common.unsaved.changes"/>);
    return false;
  };

  const selectDocumentRevision = (documentRevisionId: string) => {
    alertIfFormDirty() && setSelectedDocumentRevision(documentRevisionId);
  };

  const selectAssessmentForm = () => {
    alertIfFormDirty() && setSelectedDocumentRevision(null);
  };

  const onDirtyFlagChange = (dirty: boolean) => setIsFormDirty(dirty);

  const transformedDocTypeGroups = [].concat(...documentTypeGroups);

  return (
    <Grid container={true} className={classes.whiteContainer}>
      <Grid container={true} spacing={4}>
        <Grid item={true} xs={12} sm={3} md={2}>
          <DocumentRevisionControlContainer
            setDocumentRevisionsList={setDocumentRevisionsList}
            documentsInChangeRequest={documentRevisionsList}
            selectDocumentRevision={selectDocumentRevision}
            selectAssessmentForm={selectAssessmentForm}
            selectedDocumentRevision={selectedDocumentRevision}
            documentsInCrById={documentsInCrById}
            setDocumentTypeGroups={setDocumentTypeGroups}
            documentTypeGroups={documentTypeGroups}
          />
        </Grid>
        <ChangeRequestFormPresenter
          initialValues={initialValues}
          onSubmit={onSubmit}
          asyncState={asyncState}
          doNotPrompt={doNotPrompt}
          onDirtyFlagChange={onDirtyFlagChange}
          changeRequest={changeRequest}
          selectedDocumentRevision={selectedDocumentRevision}
          documentRevisionsList={documentRevisionsList}
          documentTypeGroups={transformedDocTypeGroups}
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ChangeRequestFormContainer);
