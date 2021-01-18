import HelloSign from "hellosign-embedded";
import { includes, isEmpty, keys, pick, values } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { FB, FBHelloSignProps, FBHelloSignState } from "..";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { toastError, toastInfo } from "../../components/notifications";

export const withFBHelloSign = <T extends FBHelloSignProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    helloSignState,
    loadingMessage,
    signatureSent,
    signatureSentMessage,
    waitOverlay,
    buttonLabel,
    disabled,
    name,
    ...props
  }: T) => {

    helloSignState = FB.useRef<FBHelloSignState>(FBHelloSignState);

    const { workspaceState, formState } = FB.useStores();
    const { id } = workspaceState || {};
    const signatureId = formState?.getFieldValue("signatureRequestId");
    const dispatch = useDispatch();
    const intl = useIntl();
    disabled = disabled || !id;
    signatureSentMessage = intl.formatMessage({ id: "form.builder.signature.document.sent" });

    if (id) {
      helloSignState.setBody({
        documentRevision: { id },
      });
    }

    function getButtonLabel() {
      if (workspaceState?.mode !== "form") {
        return "form.builder.create.template";
      }
      if (!signatureId) {
        return "form.builder.send.signature";
      }
      helloSignState?.setSignatureStatus(true);
      return "form.builder.cancel.signature";
    }


    function helloSignIframe(data: any) {
      // using previouslyFinished with 'close' because 'cancel' event doesn't work for some reason
      let previouslyFinished = false;
      const clientId = "24a113b7a770ee49ed3fe30fa6ada0f3";
      // Config.HelloSignClientId;
      const editUrl = data.template.edit_url;
      const client = new HelloSign({
        clientId,
        skipDomainVerification: true,
      });
      client.open(editUrl);
      client.on("finish", () => {
        previouslyFinished = true;
        helloSignState?.setLoadingMessage(
          intl.formatMessage({ id: "form.builder.template.message.retrieving" })
        );
        helloSignState?.setOverlay(true);
      });
      client.on("close", () => {
        helloSignState?.setOverlay(previouslyFinished);
      });
    }

    async function handleForm() {
      const items = formState?.getValues();
      const filteredItems = pick(items, keys(items).filter((x) => !includes(x, "Generated_From_Template")));
      if (values(filteredItems).some((x) => x === "") || filteredItems === null) {
        return toastError(intl.formatMessage({ id: "form.builder.signature.warning" }));
      }
      if (!signatureId) {
        helloSignState?.setLoadingMessage(
          intl.formatMessage({ id: "form.builder.signature.sending" })
        );
        helloSignState?.setOverlay(true);
        const status = await helloSignState?.sendSignatureApi.post();
        helloSignState?.setSignatureStatus(status);
        helloSignState?.setOverlay(false);
        if (status) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          dispatch(documentRevisionsActions.load(id!));
        }
      } else {
        helloSignState?.setOverlay(true);
        helloSignState?.setLoadingMessage(
          intl.formatMessage({ id: "form.builder.signature.cancelling" })
        );
        await helloSignState?.cancelSignatureApi.patch();
        helloSignState?.setOverlay(false);
        return toastInfo(
          "Signature request cancellation requested. This page will be reloaded after the request is completed."
        );
      }
    }

    async function handleDesign() {
      const { attachments, formTemplate: { helloSignTemplateId = null } = {} } = workspaceState?.document || {};
      let msg: string | undefined;
      if (isEmpty(attachments)) {
        msg = intl.formatMessage({ id: "form.builder.template.warning" });
      } else if (helloSignTemplateId) {
        msg = intl.formatMessage({ id: "form.builder.template.created.warning" });
      }
      if (msg) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          formState?.setFieldError(name!, msg);
      } else {
        helloSignState?.setLoadingMessage(
          intl.formatMessage({ id: "form.builder.template.message.loading" })
        );
        helloSignState?.setOverlay(true);
        const data = await helloSignState?.createTemplateApi.post();
        helloSignIframe(data);
      }
    }

    onClick = () => {
      if (!name) { return; }
      (workspaceState?.mode === "form")
        ? handleForm()
        : handleDesign();
    };

    useObserver(() => {
      loadingMessage = helloSignState?.loadingMessage;
      waitOverlay = helloSignState?.waitOverlay;
      signatureSent = helloSignState?.signatureSent;
    });

    return Component({
      ...(props as T),
      onClick,
      loadingMessage,
      waitOverlay,
      buttonLabel: getButtonLabel(),
      signatureSent,
      signatureSentMessage,
      disabled,
      name,
    });
  };

  return (props: T) => Comp(props);
};
