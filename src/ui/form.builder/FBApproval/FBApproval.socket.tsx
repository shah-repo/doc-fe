import { get, maxBy } from 'lodash';
import { reaction } from 'mobx';
import React, { useCallback, useMemo } from 'react';
import { FB, FBApprovalSocketProps, FBApprovalState, FBFieldName } from '..';
import { documentVersionPath } from '../../document.revision/utils/paths';
import useMqttSubscription from '../../hooks/useMqttSubscription';

const FBApprovalSocket: React.FunctionComponent<FBApprovalSocketProps> = ({
  name,
}) => {
  const { workspaceState } = FB.useStores();
  const { id, documentId } = workspaceState || {};
  const approvalState: FBApprovalState = get(FB.useStores(), `${FBFieldName.ApprovalState}-${name}`);

  React.useEffect(() => reaction(
    () => approvalState?.getDocumentApi.data,
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
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);


  const callback = useCallback(() => {
    approvalState?.getDocument(documentId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const topic = useMemo(() => `+/document_revisions/${id}/updated`, [id]);

  useMqttSubscription(topic, callback);

  return null;
};

export default FBApprovalSocket;
