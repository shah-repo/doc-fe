import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBEBPartFormActions, FBEBPartFormProps, FBFormState } from "..";

export const withFBEBPartForm = (
  Component: React.FunctionComponent<FBEBPartFormProps>,
) => {
  const Comp = ({
    ebId,
    ebPartState,
    ...props
  }) => {

    // MARK: @config
    let loading = false;
    let disabled = false;
    const { dialogState } = FB.useStores();
    const formState = FB.useRef<FBFormState>(FBFormState, {});

    React.useEffect(() => {
      dialogState?.setActions(
        <FBEBPartFormActions {...{ onDialogConfirm, onDialogClose, disabled }} />
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabled]);

    // MARK: @methods
    const onDialogConfirm = () => {
      const formValue = formState.getValues();
      ebPartState.addNewPartChild(formValue);
      onDialogClose();
    };

    const onDialogClose = () => {
      dialogState?.closeDialog();
    };

    // MARK: @reactions
    // on document type autocomplete change
    React.useEffect(() => reaction(
      () => formState?.inputState.get("document.documentType.id")?.value,
      (data) => ebPartState.fetchProposedDocId(data),
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // on fetch proposed doc id
    React.useEffect(() => reaction(
      () => ebPartState.proposedDocIdApi.data,
      (data) => formState.setFieldValue("document.docId", data.docId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @observer
    useObserver(() => {
      loading = (
        ebPartState?.loading
        || ebPartState?.proposedDocIdApi.loading
        || ebPartState?.newChildApi.loading
        || ebPartState?.existingChildApi.loading
      );
      disabled = disabled || loading;
    });

    return Component({
      ...(props),
      formState,
      ebId,
      disabled,
      loading,
    });
  };
  Comp.displayName = "withFBEBPartForm";
  return Comp;
};
