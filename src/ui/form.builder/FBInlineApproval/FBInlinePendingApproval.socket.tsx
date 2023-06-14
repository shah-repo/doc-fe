import React, { useCallback, useMemo } from 'react';
import { FB } from '..';
import useMqttSubscription from '../../hooks/useMqttSubscription';

const FBInlinePendingApprovalSocket: React.FunctionComponent<{}> = () => {
  const { workspaceState } = FB.useStores();
  const { id } = workspaceState || {};

  const callback = useCallback(() => {
    window.location.reload();
  }, []);
  const topic = useMemo(() =>
    `+/document_revisions/${id}/inline_section/updated`
  , [id]);

  useMqttSubscription(topic, callback);

  return null;
};

export default FBInlinePendingApprovalSocket;
