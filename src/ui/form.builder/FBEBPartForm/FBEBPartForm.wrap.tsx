import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { EBPartPostBody, FB, FBEBPartFormActions, FBEBPartFormProps, FBFormState } from "..";

export const withFBEBPartForm = <T extends FBEBPartFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onDialogConfirm,
    onDialogClose,
    disabled,
    loading,
    ebId,
    ...props
  }: T) => {

    // MARK: @config
    const { dialogState, ebPartState } = FB.useStores();
    const formState = FB.useRef<FBFormState>(FBFormState, {});

    React.useEffect(() => dialogState?.setActions(
      <FBEBPartFormActions
        {...{ onDialogConfirm, onDialogClose, disabled: ebPartState?.proposedDocIdApi.loading }}
      />
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [ebPartState?.proposedDocIdApi.loading]);

    // MARK: @methods
    onDialogConfirm = () => {
      const formValue = formState.getValues();
      ebPartState?.addNewPartChild(formValue as EBPartPostBody);
      onDialogClose?.();
    };

    onDialogClose = () => dialogState?.closeDialog();

    // MARK: @reactions
    // on document type autocomplete change
    React.useEffect(() => reaction(
      () => formState?.inputState.get("document.documentType.id")?.value,
      (data) => ebPartState?.fetchProposedDocId(data),
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // on fetch proposed doc id
    React.useEffect(() => reaction(
      () => ebPartState?.proposedDocIdApi.data,
      (data) => formState.setFieldValue("document.docId", data?.docId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @observer
    useObserver(() => {
      loading = ebPartState?.proposedDocIdApi.loading;
      disabled = disabled || loading;
    });

    return Component({
      ...(props as T),
      formState,
      ebId,
      disabled,
      loading,
    });
  };

  Comp.displayName = "withFBEBPartForm";
  return Comp;
};
