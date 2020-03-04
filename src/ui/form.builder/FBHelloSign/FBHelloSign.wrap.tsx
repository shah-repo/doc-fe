
import HelloSign from "hellosign-embedded";
import _ from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { FBHelloSignPayload, FBHelloSignProps } from ".";
import { companySelectors } from "../../../state/ducks/company";
import { documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { FBActionModel } from "../stores/domain/models/FBActionModel";
import FBActionStore from "../stores/ui/FBActionStore";
import FBStore from "../stores/ui/FBStore";
import {
  CANCEL_SIGNATURE_REQUEST_URL,
  CREATE_TEMPLATE_URL,
  SEND_SIGNATURE_REQUEST_URL,
} from "./constants";

export const withFBHelloSign = <T extends FBHelloSignProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    buttonLabel,
    onClick,
    state,
    ...props
  }: T) => {

    const intl = useIntl();
    const documentById = useSelector(documentRevisionsSelectors.byId);
    const selectedCompany = useSelector(companySelectors.getSelectedCompany);
    const signatureId = _.get(documentById[FBStore.docId], "formInput.signatureRequestId");

    const getButtonLabel = () => {
      if (FBStore.mode !== "form") {
        return "form.builder.create.template";
      }

      if (!signatureId) {
        return "form.builder.send.signature";
      }

      return "form.builder.cancel.signature";
    };
    buttonLabel = getButtonLabel();

    async function apiCall(payload: FBHelloSignPayload) {
      const apiCall = new FBActionModel();
      apiCall.set({
        requestMethod: "POST",
        requestUrl: CREATE_TEMPLATE_URL,
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
        requestUrl: SEND_SIGNATURE_REQUEST_URL,
        payload,
      });
      FBActionStore.apiCall(apiCallSig.toJS() as unknown as FBActionModel);
    }

    function apiCallCancelSig(payload: FBHelloSignPayload) {
      const apiCallSig = new FBActionModel();
      apiCallSig.set({
        requestMethod: "PATCH",
        requestUrl: CANCEL_SIGNATURE_REQUEST_URL,
        payload,
      });
      FBActionStore.apiCall(apiCallSig.toJS() as unknown as FBActionModel);
    }

    function helloSignIframe(data: any) {
      const clientId = selectedCompany.helloSignAppId;
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
          return alert(intl.formatMessage({ id: "form.builder.signature.notification" }));
        }
        const items = documentById[FBStore.docId].formInput;
        if (_.values(items).some((x) => x === "") || items === null) {
          return alert(intl.formatMessage({ id: "form.builder.signature.warning" }));
        }
        if (!signatureId) {
          apiCallSig(payload);
        } else {
          apiCallCancelSig(payload);
        }
      } else {
        if (FBStore.docId === "") {
          return alert(intl.formatMessage({ id: "form.builder.template.notification" }));
        }
        if (documentById[FBStore.docId].attachments.length === 0) {
          return alert(intl.formatMessage({ id: "form.builder.template.warning" }));
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
