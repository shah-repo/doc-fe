
import _ from "lodash";
import React from "react";
import { FBHelloSignPayload, FBHelloSignPayloadSignature, FBHelloSignProps } from ".";
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
    disabled,
    ...props
  }: T) => {

    disabled = FBStore.mode === "form";

    const signatureId = _.get(store.getState().documentRevisions.byId[FBStore.docId], "formInput.signatureRequestId");
    if (FBStore.mode === "form") {
      if (signatureId === "" || signatureId === undefined) {
        buttonLabel = "form.builder.send.signature";
      } else {
        buttonLabel = "form.builder.cancel.signature";
      }
    } else {
      buttonLabel = "form.builder.attach.template";
    }

    function apiCall(payload: FBHelloSignPayload) {
      const apiCall = new FBActionModel();
      apiCall.set({
        requestMethod: "POST",
        requestUrl: "/hello_sign/template/attach_predefined",
        payload,
      });
      FBActionStore.apiCall(apiCall.toJS() as unknown as FBActionModel);
    }

    function apiCallSig(payload: FBHelloSignPayloadSignature) {
      const apiCallSig = new FBActionModel();
      apiCallSig.set({
        testMode: 1,
        requestMethod: "POST",
        requestUrl: "/hello_sign/send_signature_request",
        payload,
      });
      FBActionStore.apiCall(apiCallSig.toJS() as unknown as FBActionModel);
    }

    function apiCallCancelSig(payload: FBHelloSignPayloadSignature) {
      const apiCallSig = new FBActionModel();
      apiCallSig.set({
        requestMethod: "PATCH",
        requestUrl: "/hello_sign/cancel_signature_request",
        payload,
      });
      FBActionStore.apiCall(apiCallSig.toJS() as unknown as FBActionModel);
    }

    onClick = () => {
      if (FBStore.mode === "form") {
        if (FBStore.docId === "") {
          return alert("Please fill out fields for signature request and save document");
        }
        const items = store.getState().documentRevisions.byId[FBStore.docId].formInput;
        if (_.values(items).some((x) => x === "") || items === null) {
          return alert("Signature Request can be sent only after the fields are filled in and document is saved");
        }
        const payloadSig: FBHelloSignPayloadSignature = {
          documentRevision: {
            id: FBStore.docId,
          },
        };
        if (signatureId === "" || signatureId === undefined) {
          apiCallSig(payloadSig);
        } else {
          apiCallCancelSig(payloadSig);
        }
      } else {
        if (FBStore.docId === "") {
          return alert("Template attachment is available only after the document is created");
        }
        const templateId = _.get(store.getState().documentRevisions.byId[FBStore.docId].formTemplate, "schema[0].templateId");
        const payload: FBHelloSignPayload = {
          templateId,
          documentRevision: {
              id: FBStore.docId,
          },
        };
        if (templateId === "" || templateId === undefined) {
          return alert("Please enter Template ID and save document before attaching template");
        }
        apiCall(payload);
      }
    };

    return Component({
      ...(props as T),
      onClick,
      state,
      buttonLabel,
      disabled,
    });
  };

  return (props: T) => Comp(props);
};
