import React from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";
import { DropdownFilterCell } from "./dropdown";

export const BooleanFilterCell = (props) => {
  const intl = useIntl();
  return (
    <DropdownFilterCell
      {...props}
      data={[{
        text: intl.formatMessage({ id: "common.active" }),
        value: true,
      }, {
        text: intl.formatMessage({ id: "common.inactive" }),
        value: false,
      }]}
      defaultItem={{
        text: intl.formatMessage({ id: TranslatedText[DisplayText.ALL] }),
        value: "All",
      }}
    />
  );
};
