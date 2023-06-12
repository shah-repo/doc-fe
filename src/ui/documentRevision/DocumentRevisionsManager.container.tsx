import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { SMBox } from '../../App';
import { documentRevisionsSelectors } from '../../state/ducks/documentRevisions';
import { DocumentGroupType } from '../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, DocumentRevisionStatus } from '../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../state/reducers';
import { documentVersionPath } from '../document.revision/utils/paths';
import { FB, FBBookmarkState, FBProvider } from '../form.builder';
import FBStore from '../form.builder/FBStore/FBStore';
import useDocumentTitle from '../hooks/useDocumentTitle';
import DocumentRevisionDisplayContainer from './DocumentRevisionDisplay.container';
import { getDocRevIdToRedirect, shouldRedirectToLatestReleased } from './helpers/redirect';


interface StateProps {
  documentRevisions: DocumentRevision[];
  docId: string;
}

interface OwnProps {
  documentId: string;
  documentRevisionId: string | null;
  isNewVersion: boolean;
  isNewOutput: boolean;
  deprecatedAt: string;
}

type DocumentRevisionManagerContainerProps = OwnProps & StateProps;

// TO-DO Move To Context Folder
export let documentRevisionStatusContextFromDocList = React.createContext<undefined | DocumentRevisionStatus>(undefined);
export let documentRevisionTypeGroupsFromDocListContext = React.createContext<undefined | DocumentGroupType>(undefined);

const getDocumentRevisions = documentRevisionsSelectors.makeGetDocumentRevisions();
const mapStateToProps = (
  state: ApplicationState,
  props: OwnProps,
): StateProps => ({
  documentRevisions: getDocumentRevisions(state, props.documentId),
  docId: documentRevisionsSelectors.getDocId(state, props.documentId),
});

const DocumentRevisionManagerContainer: React.FunctionComponent<
DocumentRevisionManagerContainerProps
> = ({
  isNewVersion,
  isNewOutput,
  documentId,
  documentRevisionId,
  documentRevisions,
  deprecatedAt,
  docId,
}) => {
  useDocumentTitle(docId);

  const bookmarkState = FB.useRef<FBBookmarkState>(FBBookmarkState);
  const selectedDocument = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, documentRevisionId as string));

  const status = selectedDocument ? selectedDocument.status : undefined;

  documentRevisionStatusContextFromDocList = React.createContext(status);
  documentRevisionTypeGroupsFromDocListContext = React.createContext(selectedDocument?.document.documentType.group);

  useEffect(() => () => {
    documentRevisionStatusContextFromDocList = React.createContext<undefined | DocumentRevisionStatus>(undefined);
    documentRevisionTypeGroupsFromDocListContext = React.createContext<undefined | DocumentGroupType>(undefined);
    FBStore.selectedApprover = [];
  }, []);

  if (shouldRedirectToLatestReleased(documentRevisions, documentRevisionId)) {
    const docRevIdToRedirect = getDocRevIdToRedirect(documentRevisions, deprecatedAt);
    return (
      <Redirect to={documentVersionPath(docRevIdToRedirect, documentId)} />
    );
  }

  return (
    <FBProvider {...{ bookmarkState }}>
      <SMBox stretchY="100%">
        {documentRevisionId && !isNewOutput && (
          <DocumentRevisionDisplayContainer
            documentRevisionId={documentRevisionId}
            isNewVersion={isNewVersion}
            documentId={documentId}
          />
        )}
        {documentRevisionId && isNewOutput && (
          <DocumentRevisionDisplayContainer
            documentRevisionId={documentRevisionId}
            isNewOutput={isNewOutput}
            documentId={documentId}
          />
        )}
      </SMBox>
    </FBProvider>
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(DocumentRevisionManagerContainer);
