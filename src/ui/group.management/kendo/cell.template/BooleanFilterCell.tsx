import React from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";
import { DropdownFilterCell } from "./Dropdown";

export const BooleanFilterCell = (props: any) => {
  const intl = useIntl();
  return (
    <DropdownFilterCell
      {...props}
      data={[{
        text: intl.formatMessage({ id: "common.official" }),
        value: true,
      }, {
        text: intl.formatMessage({ id: "common.unofficial" }),
        value: false,
      }]}
      defaultItem={{
        text: intl.formatMessage({ id: TranslatedText[DisplayText.ALL] }),
        value: "All",
      }}
    />
  );
};
