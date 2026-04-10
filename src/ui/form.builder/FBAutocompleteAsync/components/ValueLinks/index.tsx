import { List, ListItem } from '@material-ui/core';
import { useObserver } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { FBAutocompleteAsyncState } from '../../..';
import { DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import FB from '../../../helpers/FB';
import { FBAutocompleteAsyncOption, FBAutocompleteAsyncProps } from '../../FBAutocompleteAsync.types';

interface ValueLinksProps {
  name: FBAutocompleteAsyncProps['name']
  optionId: FBAutocompleteAsyncProps['optionId']
  state?: FBAutocompleteAsyncState
}

interface DocumentRevisionLinkProps {
  documentId: string
  revisionId: string
}

const DOCUMENT_REVISION_STATUSES = [
  DocumentRevisionStatus.Draft,
  DocumentRevisionStatus.PendingChange,
  DocumentRevisionStatus.InReview,
  DocumentRevisionStatus.Approved,
  DocumentRevisionStatus.Released,
];

const findLatestRevision = (revisions) => {
  return revisions
    .filter((revision) => DOCUMENT_REVISION_STATUSES.includes(revision.status))
    .sort((a, b) => b.version - a.version)
    .at(0);
};

const DocumentRevisionLink: React.FC<DocumentRevisionLinkProps> = ({
  documentId,
  revisionId,
  children,
}) => {
  return (
    <Link to={documentVersionPath(revisionId, documentId)} target="_blank" rel="noopener noreferrer">
      {children}
    </Link>
  );
};

const DocumentLatestRevisionLinks = ({ value }) => {
  if (!value) {
    return null;
  }

  return (
    <List>
      {value?.map((value) => {
        const revision = findLatestRevision(value?.documentRevisions);
        if (!revision) {
          return null;
        }
        return (
          <ListItem key={value.id}>
            <DocumentRevisionLink documentId={value.id} revisionId={revision.id}>
              {value.docId}
            </DocumentRevisionLink>
          </ListItem>
        );
      })}
    </List>
  );
};

const ValueLinks: React.FC<ValueLinksProps> = ({ name = '', optionId, state }) => {
  const { formState } = FB.useStores();

  const value = useObserver(() => {
    const formValue = formState?.newValues.get(name) ?? formState?.getFieldValue(name);
    return state?.sliceValue(formValue);
  });

  switch (optionId) {
    case FBAutocompleteAsyncOption.allDocuments:
      return <DocumentLatestRevisionLinks value={value} />;
    default:
      return null;
  }
};

export default ValueLinks;
