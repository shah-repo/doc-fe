import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { DocumentRevisionSidebarProps, DocumentRevisionSidebarState, SM, SMProvider } from '../../../../..';
import { authSelectors } from '../../../../../../state/ducks/auth';
import { documentRevisionsSelectors } from '../../../../../../state/ducks/documentRevisions';
import { DocumentRevisionStatus } from '../../../../../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../../../../../state/reducers';
import { DOCUMENT_REVISION_OUTPUT_URL } from '../../../../../../ui/constants/urls';
import { checkIsDocumentRecord, checkIsTypeCanBeOutput, checkIsTypeMustBeOutput } from '../../../../../../ui/documentRevision/helpers/checkDocumentGroup';
import { isOwner } from '../../../../../../ui/documentRevision/helpers/documentRevisionPermissions';
import { isDocumentRevisionInDraft, isDocumentRevisionPendingChange } from '../../../../../../ui/documentRevision/helpers/documentRevisionStatus';
import { isFormWithInlineApproval } from '../../../../../../ui/documentRevision/helpers/records';

export const withDocumentRevisionSidebarWrap = <T extends DocumentRevisionSidebarProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    _documentRevisionSidebarState,
    documentRevisions,
    docRevsWithoutCanceled,
    documentRevisionId,
    isInlineApproval,
    selectedDocument,
    showFormMigration,
    isNewOutput,
    canAccess,
    isRecord,
    match,
    intl,
    ...props
  }: T) => {
    const getDocumentRevisions = documentRevisionsSelectors.makeGetDocumentRevisions();
    // MARK: @config
    _documentRevisionSidebarState = SM.useRef(DocumentRevisionSidebarState);
    const { _documentRevisionFormState } = SM.useStores();

    const { documentTypeId, documentId, docId } = _documentRevisionFormState || {};
    isNewOutput = match.path === DOCUMENT_REVISION_OUTPUT_URL;
    intl = useIntl();

    documentRevisions = useSelector((state: ApplicationState) => getDocumentRevisions(state, documentId || ''));

    docRevsWithoutCanceled = useMemo(() => documentRevisions?.filter((docrev) =>
      docrev.status !== DocumentRevisionStatus.Canceled), [documentRevisions]);

    documentRevisionId = _documentRevisionFormState?.documentRevision?.id;

    selectedDocument = useSelector((state: ApplicationState) =>
      documentRevisionsSelectors.getDocumentRevision(state, documentRevisionId as string));
    const { formDocument } = selectedDocument || {};

    isInlineApproval
    = !!docRevsWithoutCanceled?.find(
      (e) => isFormWithInlineApproval(e.formDocument?.formTemplate?.schema),
    )
    || !!isFormWithInlineApproval(selectedDocument?.formDocument?.formTemplate?.schema);

    isRecord
    = !!docRevsWithoutCanceled?.find(
      (e) => checkIsDocumentRecord(e.document?.documentType?.groupOptions))
    || (!!checkIsDocumentRecord(selectedDocument?.document?.documentType?.groupOptions));

    canAccess = selectedDocument?.document.canAccess;

    const currentUserEmail = useSelector(authSelectors.currentUserEmail);
    const groupOptions = selectedDocument?.document?.documentType?.groupOptions;
    const status = selectedDocument ? selectedDocument.status : undefined;
    const isStatusPendingChange = isDocumentRevisionPendingChange(status);
    const isStatusInDraft = isDocumentRevisionInDraft(status);
    const isOutput = checkIsTypeMustBeOutput(groupOptions) || checkIsTypeCanBeOutput(groupOptions);
    const isUserOwner = isOwner(selectedDocument, currentUserEmail);
    showFormMigration = (isOutput && isUserOwner && (isStatusInDraft || isStatusPendingChange));

    // MARK: @state

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    return (
      <SMProvider {...{ _documentRevisionSidebarState }}>
        <Component
          {...props as T}
          {...{
            _documentRevisionSidebarState,
            _documentRevisionFormState,
            documentTypeId,
            documentRevisions,
            docRevsWithoutCanceled,
            documentRevisionId,
            isInlineApproval,
            selectedDocument,
            showFormMigration,
            formDocument,
            documentId,
            canAccess,
            isRecord,
            isNewOutput,
            docId,
            intl,
          }}
        />
      </SMProvider>
    );
  };

  Comp.displayName = 'withDocumentRevisionSidebarWrap';
  return withRouter((props: T) => Comp(props));
};
