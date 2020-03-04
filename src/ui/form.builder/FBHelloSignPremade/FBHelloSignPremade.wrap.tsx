
import _ from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { FBHelloSignPayload, FBHelloSignPayloadSignature, FBHelloSignProps } from ".";
import { documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import {
  ATTACH_TEMPLATE_URL,
  CANCEL_SIGNATURE_REQUEST_URL,
  SEND_SIGNATURE_REQUEST_URL,
} from "../FBHelloSign/constants";
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

    const intl = useIntl();
    const documentById = useSelector(documentRevisionsSelectors.byId);
    disabled = FBStore.mode === "form";

    const signatureId = _.get(documentById[FBStore.docId], "formInput.signatureRequestId");
    const getButtonLabel = () => {
      if (FBStore.mode !== "form") {
        return "form.builder.attach.template";
      }

      if (!signatureId) {
        return "form.builder.send.signature";
      }

      return "form.builder.cancel.signature";
    };
    buttonLabel = getButtonLabel();

    function apiCall(payload: FBHelloSignPayload) {
      const apiCall = new FBActionModel();
      apiCall.set({
        requestMethod: "POST",
        requestUrl: ATTACH_TEMPLATE_URL,
        payload,
      });
      FBActionStore.apiCall(apiCall.toJS() as unknown as FBActionModel);
    }

    function apiCallSig(payload: FBHelloSignPayloadSignature) {
      const apiCallSig = new FBActionModel();
      apiCallSig.set({
        testMode: 1,
        requestMethod: "POST",
        requestUrl: SEND_SIGNATURE_REQUEST_URL,
        payload,
      });
      FBActionStore.apiCall(apiCallSig.toJS() as unknown as FBActionModel);
    }

    function apiCallCancelSig(payload: FBHelloSignPayloadSignature) {
      const apiCallSig = new FBActionModel();
      apiCallSig.set({
        requestMethod: "PATCH",
        requestUrl: CANCEL_SIGNATURE_REQUEST_URL,
        payload,
      });
      FBActionStore.apiCall(apiCallSig.toJS() as unknown as FBActionModel);
    }

    onClick = () => {
      if (FBStore.mode === "form") {
        if (FBStore.docId === "") {
          return alert(intl.formatMessage({ id: "form.builder.signature.notification" }));
        }
        const items = documentById[FBStore.docId].formInput;
        if (_.values(items).some((x) => x === "") || items === null) {
          return alert(intl.formatMessage({ id: "form.builder.signature.warning" }));
        }
        const payloadSig: FBHelloSignPayloadSignature = {
          documentRevision: {
            id: FBStore.docId,
          },
        };
        if (!signatureId) {
          apiCallSig(payloadSig);
        } else {
          apiCallCancelSig(payloadSig);
        }
      } else {
        if (FBStore.docId === "") {
          return alert(intl.formatMessage({ id: "form.builder.attach.template.notification" }));
        }
        const templateId = _.get(documentById.formTemplate, "schema[0].templateId");
        const payload: FBHelloSignPayload = {
          templateId,
          documentRevision: {
              id: FBStore.docId,
          },
        };
        if (templateId === "" || templateId === undefined) {
          return alert(intl.formatMessage({ id: "form.builder.attach.template.warning" }));
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
