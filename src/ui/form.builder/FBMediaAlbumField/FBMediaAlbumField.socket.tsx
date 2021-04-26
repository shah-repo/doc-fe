import { get, map, union } from "lodash";
import React from "react";
import { FB, FBDifference, FBMediaAlbumFieldSocketProps } from "..";
import { IotService } from "../../../common/utils/iot/mqttClient";
import useMqttSubscription from "../../hooks/useMqttSubscription";

const FBMediaAlbumFieldSocket: React.FunctionComponent<FBMediaAlbumFieldSocketProps> = ({
  fieldName,
  id,
}) => {
  const mediaAlbumFieldState = get(FB.useStores(), `mediaAlbumFieldState_${fieldName}`);
  const { workspaceState, formState } = FB.useStores();
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
  const notify = (msg: any) => {
    if (!fieldName) { return; }
    workspaceState?.loadDocRev(formState?.getValues(), (diffSchema?: any, diffInput?: FBDifference[]) => {
      if (diffSchema) {}
      if (diffInput) {
        if (!formState) { return; }
        let type: FBDifference["type"] = "add";
        const attachDiff = diffInput.reduce((result, diff) => {
          if (diff.path.join(".") === fieldName) {
            type = diff.type;
            result = union(result, map(diff.vals, "id") as string[]);
          }
          return result;
        }, [] as string[]);
        if (attachDiff.length === 0) { return; }
        const currentValue = formState.getFieldValue(fieldName) as string[];
        if (type === "add") {
          mediaAlbumFieldState.getFiles(attachDiff);
          formState.setFieldValue(fieldName, union(currentValue, attachDiff));
        } else if (type === "rm") {
          map(attachDiff, (id) => mediaAlbumFieldState.removeFile(id));
        }
      }
    });
  };
  useMqttSubscription(subscribe, unsubscribe);

  return null;
};

export default FBMediaAlbumFieldSocket;
