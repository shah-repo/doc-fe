import { get, isUndefined } from "lodash";
import { reaction } from "mobx";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { FB, FBTextFieldProps } from "..";
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
    const { workspaceMode: mode } = formState || {};
    const { id } = workspaceState || {};
    defaultValue = defaultValue || formState?.getFieldValue(name);
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
      if (!name) { return; }
      if (!id) { return; }
      formState?.lockFields({
        fields: [{
          formInput: [{
            [name]: true,
          }],
        }],
        documentRevisionId: id,
      }, name);
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
