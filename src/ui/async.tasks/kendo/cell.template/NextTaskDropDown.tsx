import { GridFilterCellProps } from "@progress/kendo-react-grid";
import React from "react";
import { useIntl } from "react-intl";
import { DropdownFilterTemplate } from "../../../components/common/kendo.column.templates/DropdownFilterTemplate";
import {
  DisplayText,
  TranslatedText,
} from "../../../components/common/kendo/helpers";
import { NEXT_TASK } from "../helper";

export const NextTaskDropDown = (props: GridFilterCellProps) => {
  const intl = useIntl();
  const getTranslatedText = (key: string) => intl.formatMessage({ id: key });
  return (
    <DropdownFilterTemplate
      {...props}
      data={NEXT_TASK}
      defaultItem={{
        text: getTranslatedText(TranslatedText[DisplayText.SELECT_NEXT_TASK]),
        value: getTranslatedText(TranslatedText[DisplayText.SELECT_NEXT_TASK]),
      }}
    />
  );
};
