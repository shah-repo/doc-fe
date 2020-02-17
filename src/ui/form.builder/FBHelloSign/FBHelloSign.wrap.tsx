import _ from "lodash";
import React from "react";
import Iframe from "react-iframe";
import { FBHelloSignPayload, FBHelloSignProps } from ".";
import { FB } from "..";
import { FBDialogState } from "../FBDialog";
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

    function apiCall(payload: FBHelloSignPayload) {
      const apiCall = new FBActionModel();
      apiCall.set({
        requestMethod: "POST",
        requestUrl: "/hello_sign/template",
        payload
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
      const payload: FBHelloSignPayload = {
        testMode: 1,
        documentRevisionId: "c46eaa47-e257-4eb5-bb5a-94e083d0cc94"
      };

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
