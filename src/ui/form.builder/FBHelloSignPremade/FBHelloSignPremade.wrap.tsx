
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
        buttonLabel = "Cancel Signature Request";
      }
    } else {
      buttonLabel = "form.builder.create.template";
    }

    function apiCall(payload: FBHelloSignPayload) {
      const apiCall = new FBActionModel();
      apiCall.set({
        requestMethod: "POST",
        requestUrl: "/hello_sign/template",
        payload,
      });
      FBActionStore.apiCall(apiCall.toJS() as unknown as FBActionModel);
    }

    function apiCallSig(payload: FBHelloSignPayload) {
      const apiCallSig = new FBActionModel();
      apiCallSig.set({
        requestMethod: "POST",
        requestUrl: "/hello_sign/send_signature_request",
        payload,
      });
      FBActionStore.apiCall(apiCallSig.toJS() as unknown as FBActionModel);
    }

    function apiCallCancelSig() {
      const apiCallSig = new FBActionModel();
      const signatureId = _.get(store.getState().documentRevisions.byId[FBStore.docId], "formInput.signatureRequestId");
      console.log(signatureId);
      apiCallSig.set({
        requestMethod: "POST",
        requestUrl: "/hello_sign/cancel_signature_request/" + signatureId,
      });
      FBActionStore.apiCall(apiCallSig.toJS() as unknown as FBActionModel);
    }

    onClick = () => {
      const payload: FBHelloSignPayload = {
        testMode: 1,
        documentRevisionId: FBStore.docId,
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
          apiCallCancelSig();
        }
      } else {
        if (FBStore.docId === "") {
          debugger
          return alert("Template creation is available only after the document is created");
        }
        if (store.getState().documentRevisions.byId[FBStore.docId].attachments.length === 0) {
          debugger
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
