import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { FB, FBApprovalSocketMsg, FBButton } from "..";
import { IotService } from "../../../common/utils/iot/mqttClient";
import useMqttSubscription from "../../hooks/useMqttSubscription";
import FBStore from "../stores/ui/FBStore";

const FBApprovalSocket: React.FunctionComponent<{}> = () => {
  const { snackbarState } = FB.useStores();
  const iotService = IotService.getInstance();
  const subscribe = () => {
    iotService.subscribeToTopic(
      `+/document_revisions/${FBStore.docId}/updated`,
      notify
    );
  };
  const unsubscribe = () => {
    iotService.unsubscribeFromTopic(
      `+/document_revisions/${FBStore.docId}/updated`,
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
        onClick={() => window.location.reload()}
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
