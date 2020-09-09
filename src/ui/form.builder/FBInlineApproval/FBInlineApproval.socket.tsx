import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { get } from "lodash";
import React from "react";
import { FB, FBApprovalSocketMsg, FBApprovalSocketProps, FBButton, FBFieldName, FBInlineApprovalState } from "..";
import { IotService } from "../../../common/utils/iot/mqttClient";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const FBInlineApprovalSocket: React.FunctionComponent<FBApprovalSocketProps> = ({
  name,
}) => {
  const { snackbarState, workspaceState } = FB.useStores();
  const { id, documentId } = workspaceState || {};
  const inlineApprovalState: FBInlineApprovalState = get(FB.useStores(), `${FBFieldName.ApprovalState}-${name}`);
  const iotService = IotService.getInstance();

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
        onClick={() => inlineApprovalState?.getDocument(documentId)}
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

export default FBInlineApprovalSocket;
