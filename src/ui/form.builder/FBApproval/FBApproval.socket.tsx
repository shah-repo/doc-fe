import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { get, last } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBApprovalSocketMsg, FBApprovalSocketProps, FBApprovalState, FBButton, FBFieldName } from "..";
import { IotService } from "../../../common/utils/iot/mqttClient";
import { documentVersionPath } from "../../document.revision/utils/paths";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const FBApprovalSocket: React.FunctionComponent<FBApprovalSocketProps> = ({
  name,
}) => {
  const { snackbarState, workspaceState } = FB.useStores();
  const { id, documentId } = workspaceState || {};
  const approvalState: FBApprovalState = get(FB.useStores(), `${FBFieldName.ApprovalState}-${name}`);
  const iotService = IotService.getInstance();

  useObserver(() => {
    if (!documentId) { return; }
    const { documentRevisions } = approvalState?.getDocumentApi.data || {};
    const documentRevision = last(documentRevisions);
    if (!documentRevision) { return; }
    window.location.href = documentVersionPath(documentRevision.id, documentId);
  });
  
  const subscribe = () => {
    iotService.subscribeToTopic(
      `+/document_revisions/${id}/updated`,
      notify
    );
  };
  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(
      `+/document_revisions/${id}/updated`,
    );
  };

  const snackbarAction = () => (
    <>
      <FBButton
        label="form.builder.reload"
        variant="text"
        color="secondary"
        size="small"
        // TODO: replace merged document into workspace context and force rerender entire workspace
        onClick={() => approvalState?.getDocument(documentId)}
      />
      <IconButton  size="small" onClick={() => snackbarState?.setOpen(false)}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );
  const notify = (resp: string) => {
    const { data: { message = "" } = {} } = JSON.parse(resp) as Partial<FBApprovalSocketMsg>;

    snackbarState?.config({
      open: true,
      message,
      action: snackbarAction(),
    });
  };
  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default FBApprovalSocket;
