import React from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";
import gridConfiguration from "../column.definition";
import { DropdownFilterCell } from "./dropdown";

export const BooleanFilterCell = (props: any) => {
  const intl = useIntl();
  return (
    <DropdownFilterCell
      {...props}
      data={gridConfiguration.booleanFilterCellOptions}
      defaultItem={{
        text: intl.formatMessage({ id: TranslatedText[DisplayText.ALL] }),
        value: intl.formatMessage({ id: TranslatedText[DisplayText.ALL] }),
      }}
    />
  );
};
