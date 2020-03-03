
import HelloSign from "hellosign-embedded";
import _ from "lodash";
import React from "react";
import { FBHelloSignPayload, FBHelloSignProps } from ".";
import { store } from "../../../state/store";
import { FBActionModel } from "../stores/domain/models/FBActionModel";
import FBActionStore from "../stores/ui/FBActionStore";
import FBStore from "../stores/ui/FBStore";

export const withFBHelloSign = <T extends FBHelloSignProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    buttonLabel,
    onClick,
    state,
    ...props
  }: T) => {

    const signatureId = _.get(store.getState().documentRevisions.byId[FBStore.docId], "formInput.signatureRequestId");
    if (FBStore.mode === "form") {
      if (signatureId === "" || signatureId === undefined) {
        buttonLabel = "form.builder.send.signature";
      } else {
        buttonLabel = "form.builder.cancel.signature";
      }
    } else {
      buttonLabel = "form.builder.create.template";
    }

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

    function apiCallSig(payload: FBHelloSignPayload) {
      const apiCallSig = new FBActionModel();
      apiCallSig.set({
        testMode: 1,
        requestMethod: "POST",
        requestUrl: "/hello_sign/send_signature_request",
        payload,
      });
      FBActionStore.apiCall(apiCallSig.toJS() as unknown as FBActionModel);
    }

    function apiCallCancelSig(payload: FBHelloSignPayload) {
      const apiCallSig = new FBActionModel();
      apiCallSig.set({
        requestMethod: "PATCH",
        requestUrl: "/hello_sign/cancel_signature_request",
        payload,
      });
      FBActionStore.apiCall(apiCallSig.toJS() as unknown as FBActionModel);
    }

    function helloSignIframe(data: any) {
      const clientId = store.getState().company.selectedCompany.helloSignAppId;
      const editUrl = data.template.edit_url;
      const client = new HelloSign({
        clientId,
        skipDomainVerification: true,
      });
      client.open(editUrl);
    }

    onClick = () => {
      const payload: FBHelloSignPayload = {
        documentRevision: {
          id: FBStore.docId,
        },
      };

      if (FBStore.mode === "form") {
        if (FBStore.docId === "") {
          return alert("Please fill out fields for signature request and save document");
        }
        const items = store.getState().documentRevisions.byId[FBStore.docId].formInput;
        if (_.values(items).some((x) => x === "") || items === null) {
          return alert("Signature Request can be sent only after the fields are filled in and document is saved");
        }
        if (signatureId === "" || signatureId === undefined) {
          apiCallSig(payload);
        } else {
          apiCallCancelSig(payload);
        }
      } else {
        if (FBStore.docId === "") {
          return alert("Template creation is available only after the document is created");
        }
        if (store.getState().documentRevisions.byId[FBStore.docId].attachments.length === 0) {
          return alert("No attachments uploaded, upload attachment and save document to create template");
        }
        apiCall(payload);
      }
    };

    return Component({
      ...(props as T),
      onClick,
      state,
      buttonLabel,
    });
  };

  return (props: T) => Comp(props);
};
