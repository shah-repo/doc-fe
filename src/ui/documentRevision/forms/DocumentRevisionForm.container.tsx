import { Box, Grid } from "@material-ui/core";
import classNames from "classnames";
import { Formik, FormikHelpers as FormikActions, FormikProps } from "formik";
import { get } from "lodash";
import React, { useMemo } from "react";
import { connect } from "react-redux";
import {
  Document,
  DocumentRevision,
  documentRevisionsActions,
  documentRevisionsSelectors,
  DocumentRevisionStatus,
} from "../../../state/ducks/documentRevisions";
import {
  DocumentType,
  DocumentTypeByIdState,
  documentTypeSelectors,
} from "../../../state/ducks/documentRevisions/documentType";
import { documentsActions } from "../../../state/ducks/documents";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { SelectOption } from "../../components/forms/fields/Select";
import ChangeRequestLink from "../../document.revision/summary/changeRequestLink";
import DocumentHeader from "../../document.revision/summary/header";
import styles from "./DocumentRevisionForm.container.style";
import DocumentRevisionFormPresenter from "./DocumentRevisionForm.presenter";
import { DocumentRevisionFormValues } from "./types";

interface StateProps {
  availableReferences: OptionType[];
  loadAsyncState: AsyncState;
  documentRevisions: DocumentRevision[];
  documentTypes: DocumentType[];
  documentTypesById: DocumentTypeByIdState;
  document: Document;
}

interface DispatchProps {
  loadDocumentRevisions: typeof documentRevisionsActions.loadList;
}

interface OwnProps {
  initialValues: DocumentRevisionFormValues;
  asyncState: AsyncState;
  onSubmit: (
    values: DocumentRevisionFormValues,
    actions: FormikActions<DocumentRevisionFormValues>,
  ) => void;
  showRevisionTypeChange?: boolean;
  setDocId?: typeof documentsActions.setDocumentProposedId;
  doNotPrompt?: boolean;
  onDirtyFlagChange?: (dirty: boolean) => void;
  documentRevision: DocumentRevision;
  proposedDocId?: string;
  loadDocumentProposedId?: typeof documentsActions.loadDocumentProposedId;
}

export type DocumentRevisionFormContainerProps = OwnProps &
  StateProps &
  DispatchProps;

const getAvailableReferences = documentRevisionsSelectors.makeGetAvailableReferences();
const mapStateToProps = (
  state: ApplicationState,
  props: OwnProps,
): StateProps => ({
  availableReferences: getAvailableReferences(state, props.initialValues),
  loadAsyncState: documentRevisionsSelectors.getLoadListAsyncState(state),
  documentRevisions: documentRevisionsSelectors.getDocumentRevisionsList(state),
  documentTypes: documentTypeSelectors.getDocumentTypeFormOptions(state),
  documentTypesById: documentTypeSelectors.byId(state),
  document: documentRevisionsSelectors.getDocument(
    state,
    get(props.initialValues, "document.id")!,
  ),
});

export const DocumentRevisionFormContainer: React.FunctionComponent<
  DocumentRevisionFormContainerProps
> = ({
  onSubmit,
  initialValues,
  asyncState,
  documentRevisions,
  availableReferences,
  showRevisionTypeChange,
  loadDocumentRevisions,
  loadAsyncState,
  loadDocumentProposedId,
  proposedDocId,
  setDocId,
  doNotPrompt,
  onDirtyFlagChange,
  documentRevision,
  documentTypes,
  documentTypesById,
  document,
}) => {
  const docTypes = useMemo(
    () =>
      documentTypes.map((document) => ({
        value: document.id,
        text: document.documentTypeName,
      })),
    [documentTypes],
  );

  const otherTypes: SelectOption[] = useMemo(
    () =>
      documentTypes.reduce((acc: SelectOption[], document) => {
        if (document.group === "OTHER") {
          acc.push({ value: document.id, text: document.documentTypeName });
        }
        return acc;
      }, []),
    [documentTypes],
  );

  document = document || ({} as Document);
  const classes = styles();

  const render = (props: FormikProps<DocumentRevisionFormValues>) => {
    return (
      <DocumentRevisionFormPresenter
        {...props}
        asyncState={asyncState}
        documentRevisions={documentRevisions}
        availableReferences={availableReferences}
        showRevisionTypeChange={showRevisionTypeChange}
        loadDocumentProposedId={loadDocumentProposedId}
        proposedDocId={proposedDocId}
        setDocId={setDocId}
        doNotPrompt={doNotPrompt}
        onDirtyFlagChange={onDirtyFlagChange}
        documentTypes={docTypes}
        otherDocumentTypes={otherTypes}
        documentTypesById={documentTypesById}
      />
    );
  };

  // TODO: check why are we loading all document revisions
  // if it's really necessary maybe it can be loaded through the DataFetcherContainer
  // it will be loaded only once instead every time this component is mounted
  const loadAction = () =>
    loadDocumentRevisions([
      DocumentRevisionStatus.Released,
      DocumentRevisionStatus.Deprecated,
      DocumentRevisionStatus.Obsolete,
      DocumentRevisionStatus.PendingChange,
      DocumentRevisionStatus.Draft,
    ]);

  return (
    <AsyncGate
      asyncState={loadAsyncState}
      asyncAction={loadAction}
      startActionOnMount={true}
    >
      {documentRevision && <DocumentHeader dataProp={documentRevision} />}
      <Grid
        className={classNames(classes.container, {
          [classes.borderContainer]: documentRevision,
        })}
      >
        <Box ml={3}>
          {!showRevisionTypeChange && (
            <ChangeRequestLink dataProp={documentRevision} />
          )}
        </Box>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {render}
        </Formik>
      </Grid>
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    loadDocumentRevisions: documentRevisionsActions.loadList,
  },
)(DocumentRevisionFormContainer);
