
import { makeStyles } from "@material-ui/core";
import HelloSign from "hellosign-embedded";
import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { FBHelloSignPayload, FBHelloSignProps } from ".";
import { FB } from "..";
import Config from "../../../config";
import { documentRevisionsActions, documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { FBActionModel } from "../stores/domain/models/FBActionModel";
import FBActionStore from "../stores/ui/FBActionStore";
import FBStore from "../stores/ui/FBStore";
import { CANCEL_SIGNATURE_REQUEST_URL, CREATE_TEMPLATE_URL, SEND_SIGNATURE_REQUEST_URL } from "./constants";
import FBHelloSignState from "./FBHelloSign.state";

export const withFBHelloSign = <T extends FBHelloSignProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    buttonLabel,
    waitOverlay,
    helloSignState,
    backdropStyle,
    loadingMessage,
    signatureSent,
    signatureSentMessage,
    onClick,
    ...props
  }: T) => {
    const loadAction = useActionCreator(documentRevisionsActions.load);
    const async = useAsync();
    helloSignState = FB.useRef<FBHelloSignState>(FBHelloSignState);
    const intl = useIntl();
    const documentById = useSelector(documentRevisionsSelectors.byId);
    const signatureId = FBStore.getValue("signatureRequestId");
    signatureSentMessage = intl.formatMessage({ id: "form.builder.signature.document.sent" });

    const useStyles = makeStyles((theme) => ({
      backdrop: {
        zIndex: 1550,
        color: "#fff",
      },
    }));

    backdropStyle = useStyles();

    useObserver(() => {
      waitOverlay = helloSignState && helloSignState.waitOverlay;
      loadingMessage = helloSignState && helloSignState.loadingMessage;
      signatureSent = helloSignState && helloSignState.signatureSent;
    });

    const getButtonLabel = () => {
      if (FBStore.mode !== "form") {
        return "form.builder.create.template";
      }

      if (!signatureId) {
        return "form.builder.send.signature";
      }
      helloSignState && helloSignState.setSignatureStatus(true);
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
      if (!data) {
        return helloSignState && helloSignState.setOverlay(false);
      }
      helloSignIframe(data);
    }

    async function apiCallSig(payload: FBHelloSignPayload) {
      const apiCallSig = new FBActionModel();
      apiCallSig.set({
        requestMethod: "POST",
        requestUrl: SEND_SIGNATURE_REQUEST_URL,
        payload,
      });
      const status = await FBActionStore.apiCall(apiCallSig.toJS() as unknown as FBActionModel);
      helloSignState && helloSignState.setSignatureStatus(status);
      helloSignState && helloSignState.setOverlay(false);

      const id = FBStore.docId;
      if (status) {
        async.start(loadAction, id, async);
      }
    }

    async function apiCallCancelSig(payload: FBHelloSignPayload) {
      const apiCallSig = new FBActionModel();
      apiCallSig.set({
        requestMethod: "PATCH",
        requestUrl: CANCEL_SIGNATURE_REQUEST_URL,
        payload,
      });
      await FBActionStore.apiCall(apiCallSig.toJS() as unknown as FBActionModel);
      helloSignState && helloSignState.setOverlay(false);
    }

    function helloSignIframe(data: any) {
      // using previouslyFinished with 'close' because 'cancel' event doesn't work for some reason
      let previouslyFinished = false;
      const clientId =  Config.HelloSignClientId;
      const editUrl = data.template.edit_url;
      const client = new HelloSign({
        clientId,
        skipDomainVerification: true,
      });
      client.open(editUrl);
      client.on("finish", () => {
        previouslyFinished = true;
        helloSignState && helloSignState.setLoadingMessage(
          intl.formatMessage({ id: "form.builder.template.message.retrieving" })
        );
        helloSignState && helloSignState.setOverlay(true);
      });
      client.on("close", () => {
        helloSignState && helloSignState.setOverlay(previouslyFinished);
      });
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
        const filteredItems = _.pick(items, _.keys(items).filter((x) => !_.includes(x, "Generated_From_Template")));
        if (_.values(filteredItems).some((x) => x === "") || filteredItems === null) {
          return alert(intl.formatMessage({ id: "form.builder.signature.warning" }));
        }
        if (!signatureId) {
          helloSignState && helloSignState.setLoadingMessage(
            intl.formatMessage({ id: "form.builder.signature.sending" })
          );
          helloSignState && helloSignState.setOverlay(true);
          apiCallSig(payload);
        } else {
          /*
          helloSignState && helloSignState.setOverlay(true);
          helloSignState && helloSignState.setLoadingMessage(
            intl.formatMessage({ id: "form.builder.signature.cancelling" })
          );
          */
          apiCallCancelSig(payload);
        }
      } else {
        if (FBStore.docId === "") {
          return alert(intl.formatMessage({ id: "form.builder.template.notification" }));
        }
        if (documentById[FBStore.docId].attachments.length === 0) {
          return alert(intl.formatMessage({ id: "form.builder.template.warning" }));
        }
        if (_.get(documentById[FBStore.docId].formTemplate, "helloSignTemplateId")) {
          return alert(intl.formatMessage({ id: "form.builder.template.created.warning" }));
        }
        helloSignState && helloSignState.setLoadingMessage(
          intl.formatMessage({ id: "form.builder.template.message.loading" })
        );
        helloSignState && helloSignState.setOverlay(true);
        apiCall(payload);
      }
    };

    return Component({
      ...(props as T),
      onClick,
      buttonLabel,
      waitOverlay,
      backdropStyle,
      loadingMessage,
      signatureSent,
      signatureSentMessage,
      helloSignState,
    });
  };

  return (props: T) => Comp(props);
};
