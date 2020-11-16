import { get, isUndefined } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { FB, FBTextFieldProps } from "..";
import { isTranslation } from "../../translations/types";

export const withFBTextField = <T extends FBTextFieldProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    multiline,
    rows = 1,
    placeholder = "",
    defaultValue,
    disabled,
    name,
    ...props
  }: T) => {

    const { formState, workspaceState } = FB.useStores();
    const { mode } = workspaceState || {};
    defaultValue = formState?.getFieldValue(name);
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

    return Component({
      ...(props as T),
      multiline,
      placeholder,
      disabled,
      defaultValue,
      name,
      rows,
      mode,
    });
  };
  return (props: T) => Comp(props);
};
