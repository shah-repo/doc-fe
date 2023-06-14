import { get, maxBy } from 'lodash';
import { reaction } from 'mobx';
import React, { useCallback, useMemo } from 'react';
import { FB, FBApprovalSocketProps, FBFieldName, FBInlineApprovalState } from '..';
import { documentVersionPath } from '../../document.revision/utils/paths';
import useMqttSubscription from '../../hooks/useMqttSubscription';

const FBInlineApprovalSocket: React.FunctionComponent<FBApprovalSocketProps> = ({
  name,
}) => {
  const { workspaceState } = FB.useStores();
  const { id, documentId } = workspaceState || {};
  const inlineApprovalState: FBInlineApprovalState = get(FB.useStores(), `${FBFieldName.ApprovalState}-${name}`);

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
  const callback = useCallback(() => {
      inlineApprovalState?.getDocument(documentId);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , []);

  const topic = useMemo(() => `+/document_revisions/${id}/updated`, [id]);

  useMqttSubscription(topic, callback);

  return null;
};

export default FBInlineApprovalSocket;
