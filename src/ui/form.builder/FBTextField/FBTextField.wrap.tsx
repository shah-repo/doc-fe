import { get, isEmpty, isUndefined } from "lodash";
import { reaction } from "mobx";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { FB, FBTextFieldProps } from "..";
import { THRESHOLD_KEY } from "../../../state/ducks/documentRevisions/constants";
import { useFormContext } from "../../components/forms/FormContext";
import { checkIsDocumentPOAM } from "../../documentRevision/helpers/checkDocumentGroup";
import { isTranslation } from "../../translations/types";

export const withFBTextField = <T extends FBTextFieldProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onFocus,
    multiline,
    rows = 1,
    placeholder = "",
    defaultValue,
    disabled,
    name = "",
    value,
    ...props
  }: T) => {

    const { formState, workspaceState } = FB.useStores();
    const { submitForm } = useFormContext();
    const { workspaceMode: mode } = formState || {};
    const { id } = workspaceState || {};
    const isDocumentPOAM = checkIsDocumentPOAM(workspaceState?.document?.document?.documentType?.groupOptions);
    defaultValue = defaultValue || formState?.getFieldValue(name);

    if (!["justificationOfChange", "descriptionOfChange"].includes(name)) {
      value = value ?? formState?.getFieldValue(name);
    }

    const intl = useIntl();
    disabled = (
      disabled ||
      get(props.hellosignFlowProps, "type") === "HS_DEFINED_FIELD" ||
      formState?.getFieldValue("signatureRequestId")
    );

    (isUndefined(multiline)) && (
      multiline = Boolean(rows && (rows as number) > 1)
    );

    isTranslation(placeholder) && (placeholder = intl.formatMessage({ id: placeholder }));
    onFocus = () => {
      if (formState?.isBackdropOpen) { return; }
      if (!name) { return; }
      if (!id) { return; }
      formState?.lockField({
        fields: [{
          formInput: [{
            [name]: true,
          }],
        }],
        documentRevisionId: id,
      }, name);
    };

    const onBlur = (ev) => {
      if (formState?.isBackdropOpen) {
        ev.target.focus();
        return;
      }
      if (ev?.target?.type === "number" && ev?.target?.step === ".01") {
        ev.target.value = Math.abs(ev.target?.value).toFixed(2).toString();
      }
      if (!name) { return; }
      if (isDocumentPOAM && name === THRESHOLD_KEY && isEmpty(ev.target?.value)) {
        // Setting POAM Item form value back to 0 If the value is removed
        formState?.setFieldValue(name, 0, true);
      }
      formState?.unlockField(name);
      formState?.setFieldAutosave(name);
      if (workspaceState?.isChangeRequest && workspaceState?.autosave &&
         (name.includes(".justificationOfChange") ||  name.includes(".descriptionOfChange"))) {
        submitForm();
        return;
      }
      if (!workspaceState?.autosave && name?.includes("lhrs-start-quantity")) {
        workspaceState?.saveDocRev(formState?.getValues(), true);
      }
    };

    useEffect(() => reaction(
      () => workspaceState?.formInputSync.get(name),
      (value?: string) => {
        formState?.setFieldValue(name, value, true);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    return Component({
      ...(props as T),
      onFocus,
      onBlur,
      multiline,
      placeholder,
      disabled,
      defaultValue,
      name,
      rows,
      mode,
      value,
    });
  };
  return (props: T) => Comp(props);
};
