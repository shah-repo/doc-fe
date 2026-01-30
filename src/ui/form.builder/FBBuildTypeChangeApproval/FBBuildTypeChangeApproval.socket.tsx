import { get, maxBy } from 'lodash';
import { reaction } from 'mobx';
import React from 'react';
import { FB, FBApprovalSocketProps, FBFieldName } from '..';
import { documentVersionPath } from '../../document.revision/utils/paths';
import FBBuildTypeChangeApprovalState from './FBBuildTypeChangeApproval.state';

const FBBuildTypeChangeApprovalSocket: React.FunctionComponent<FBApprovalSocketProps> = ({
  name,
}) => {
  const { workspaceState } = FB.useStores();
  const { documentId } = workspaceState || {};

  const inlineApprovalState: FBBuildTypeChangeApprovalState = get(FB.useStores(), `${FBFieldName.ApprovalState}-${name}`);

  React.useEffect(() => reaction(
    () => inlineApprovalState?.documentApi.data,
    (data) => {
      if (!documentId) { return; }
      const { documentRevisions } = data || {};
      const documentRevision = maxBy(documentRevisions, 'version');
      if (!documentRevision) { return; }
      const { version: lastVersion = 0 } = documentRevision;
      const { version = 0 } = workspaceState?.document || {};
      if (lastVersion > version) {
        window.location.href = documentVersionPath(documentRevision.id, documentId);
      }
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);

  return null;
};

export default FBBuildTypeChangeApprovalSocket;
