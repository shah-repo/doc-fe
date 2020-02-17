import _ from "lodash";
import React from "react";
import Iframe from "react-iframe";
import { FBHelloSignPayload, FBHelloSignProps, FBHelloSignTypeMap } from ".";
import { FB } from "..";
import { FBDialogState } from "../FBDialog";
import FBStore from "../stores/ui/FBStore";
import { FBActionModel } from "../stores/domain/models/FBActionModel";
import FBActionStore from "../stores/ui/FBActionStore";

export const withFBHelloSign = <T extends FBHelloSignProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    state,
    ...props
  }: T) => {

    state = FB.useRef<FBDialogState>(FBDialogState);

    function renderFilesPayload(payloadFiles: string[] = [], name: string = "files"): string[] {
      // const uploadedFiles = _.get(FBStore.getValues(), name!, []);
      const hardCodedLink = ["https://drive.google.com/file/d/1xRC91lVs17gSaoRG92VkiipA3jsZHJDl/view?usp=sharing"];
      return hardCodedLink;
      // return _.union(payloadFiles, _.map(uploadedFiles, "s3link"));
    }

    function apiCall(payload: FBHelloSignPayload) {
      const apiCall = new FBActionModel();
      apiCall.set({
        requestMethod: "POST",
        requestUrl: "/hello_sign/template",
        testMode: 1,
        payload,
      });

      FBActionStore.apiCall(apiCall.toJS() as unknown as FBActionModel);
      debugger
      state?.openDialog();
      state?.config({
        maxWidth: "lg",
        content: (
          <Iframe url="https://app.hellosign.com/editor/embeddedTemplate?token=8a1dde0444d4a95767e8d977fc11501b&root_snapshot_guids%5B0%5D=3bfe00573193451aee9e02495aa3e0f9edf6001c&snapshot_access_guids%5B0%5D=3d8e480a&guid=29e7a52a8674f340f9f59897989449d63163c08c&client_id=f1aa746e24a4d06fc577c95649020718&debug=0&user_culture=en_US&parent_url=https%3A%2F%2Ffb.enlil.io%2F&skip_domain_verification=1&ux_version=2&js_version=2.6.0" width="100%" height="100%" />
        ),
      });
    }

    onClick = () => {
      const schema = FBStore.getSchema();
      const payload: FBHelloSignPayload = {
        testMode: 1,
        clientId: "fc237e25-5f12-4976-b037-52cf3ecdef1f",
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
      state,
    });
  };

  return (props: T) => Comp(props);
};
