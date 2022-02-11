import { GridFilterCellProps } from "@progress/kendo-react-grid";
import React from "react";
import { useIntl } from "react-intl";
import { DropdownFilterTemplate } from "../../../components/common/kendo.column.templates/DropdownFilterTemplate";
import {
  DisplayText,
  TranslatedText,
} from "../../../components/common/kendo/helpers";
import { AsyncStatus } from "../helper";

export const StatusDropDown = (props: GridFilterCellProps) => {
  const intl = useIntl();
  const getTranslatedText = (key: string) => intl.formatMessage({ id: key });
  return (
    <DropdownFilterTemplate
      {...props}
      data={AsyncStatus}
      defaultItem={{
        text: getTranslatedText(TranslatedText[DisplayText.SELECT_STATE]),
        value: getTranslatedText(TranslatedText[DisplayText.SELECT_STATE]),
      }}
    />
  );
};
