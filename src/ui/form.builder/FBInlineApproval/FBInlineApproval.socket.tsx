import { get, maxBy } from 'lodash';
import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import React, { useCallback, useMemo } from 'react';
import { FB, FBApprovalSocketProps, FBFieldName, FBInlineApprovalState } from '..';
import { SM } from '../../../App';
import { documentVersionPath } from '../../document.revision/utils/paths';
import useMqttSubscription from '../../hooks/useMqttSubscription';

let apiTriggered = false;

const FBInlineApprovalSocket: React.FunctionComponent<FBApprovalSocketProps> = ({
  name,
}) => {
  const { workspaceState } = FB.useStores();
  const { id, documentId } = workspaceState || {};
  const { _documentRevisionFormState } = SM.useStores();

  useObserver(() => {
    if (!(workspaceState?.documentRevApi.loading || _documentRevisionFormState?.loading)) {
      console.log('making false again');
      apiTriggered = false;
    }
  },
  );

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
    console.log('Triggerring ', documentId, name);
    if (!apiTriggered) {
      apiTriggered = true;
    inlineApprovalState?.getDocument(documentId);
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , []);

  const topic = useMemo(() => `+/document_revisions/${id}/updated`, [id]);

  useMqttSubscription(topic, callback);

  return null;
};

export default FBInlineApprovalSocket;
