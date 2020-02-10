import _ from "lodash";
import React from "react";
import { FBHelloSignPayload, FBHelloSignProps, FBHelloSignTypeMap } from ".";
import { FBActionModel } from "../stores/domain/models/FBActionModel";
import FBActionStore from "../stores/ui/FBActionStore";
import FBStore from "../stores/ui/FBStore";

export const withFBHelloSign = <T extends FBHelloSignProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    ...props
  }: T) => {

    function renderFilesPayload(payloadFiles: string[] = [], name: string = "files"): string[] {
      const uploadedFiles = _.get(FBStore.getValues(), name!, []);
      return _.union(payloadFiles, _.map(uploadedFiles, "s3link"));
    }

    function apiCall(payload: FBHelloSignPayload) {
      const apiCall = new FBActionModel();
      apiCall.set({
        requestMethod: "POST",
        requestUrl: "",
        payload,
      });

      FBActionStore.apiCall(apiCall.toJS() as unknown as FBActionModel);
    }

    onClick = () => {
      const schema = FBStore.getSchema();
      const payload: FBHelloSignPayload = {
        files: [],
        mergeFields: [],
      };

      _.map(schema, (schemaItem) => {
        const { type, name } = schemaItem;
        if (_.isUndefined(type) && _.isUndefined(name)) {
          return;
        }

        // Create payload
        switch (type) {
          case "fileupload": // Uploaded files from the form
            payload.files = renderFilesPayload(payload.files, name!);
            break;
          case "hellosign":
            payload.files = renderFilesPayload(payload.files);
            break;
          default: // Other schema items
            payload.mergeFields = _.union(payload.mergeFields, [{
              name: (schemaItem.label as string) || name!,
              type: FBHelloSignTypeMap[type!] || "text",
            }]);
        }
      });

      apiCall(payload);
    };

    return Component({
      ...(props as T),
      onClick,
    });
  };

  return (props: T) => Comp(props);
};
