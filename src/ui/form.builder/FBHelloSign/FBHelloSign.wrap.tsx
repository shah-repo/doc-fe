
import React from "react";
import { FBHelloSignPayload, FBHelloSignProps } from ".";
import { FBActionModel } from "../stores/domain/models/FBActionModel";
import FBActionStore from "../stores/ui/FBActionStore";
import FBStore from "../stores/ui/FBStore";
import { store } from "../../../state/store";
import HelloSign from "hellosign-embedded";

export const withFBHelloSign = <T extends FBHelloSignProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    state,
    ...props
  }: T) => {

    async function apiCall(payload: FBHelloSignPayload) {
      const apiCall = new FBActionModel();
      apiCall.set({
        requestMethod: "POST",
        requestUrl: "/hello_sign/template",
        payload,
      });
      const data = await FBActionStore.apiCall(apiCall.toJS() as unknown as FBActionModel);
      helloSignIframe(data);
    }

    function helloSignIframe(data: any) {
      const clientId = store.getState().company.selectedCompany.helloSignAppId;
      const editUrl = data.template.edit_url;
      let client = new HelloSign({
        clientId,
        skipDomainVerification: true,
      });
      client.open(editUrl);
    }

    onClick = () => {
      const payload: FBHelloSignPayload = {
        testMode: 1,
        documentRevisionId: FBStore.docId,
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
