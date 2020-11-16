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
    disabled,
    ...props
  }: T) => {

    const { formState, workspaceState } = FB.useStores();
    const { mode } = workspaceState || {};
    const intl = useIntl();
    disabled = (
      disabled ||
      get(props.hellosignFlowProps, "type") === "HS_DEFINED_FIELD" ||
      formState?.getFieldValue("signatureRequestId")
    );

    // Set rows to 3 by default for preview form
    (mode === "preview" && rows < 2) && (rows = 3);

    (isUndefined(multiline)) && (
      multiline = Boolean(rows && (rows as number) > 1)
    );

    isTranslation(placeholder) && (placeholder = intl.formatMessage({ id: placeholder }));

    return Component({
      ...(props as T),
      multiline,
      placeholder,
      disabled,
      rows,
    });
  };
  return (props: T) => Comp(props);
};
