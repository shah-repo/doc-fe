import { GridFilterCellProps } from "@progress/kendo-react-grid";
import React from "react";
import { useIntl } from "react-intl";
import { DropdownFilterTemplate } from "../../../components/common/kendo.column.templates/DropdownFilterTemplate";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";
import { dropDownOptions } from "../helper";

export const TaskTypeDropDown = (props: GridFilterCellProps) => {
  const intl = useIntl();
  const getTranslatedText = (key: string) => intl.formatMessage({ id: key });
  return (
    <DropdownFilterTemplate
      {...props}
      data={dropDownOptions}
      defaultItem={{
        text: getTranslatedText(TranslatedText[DisplayText.SELECT_TASK_TYPE]),
        value: getTranslatedText(TranslatedText[DisplayText.SELECT_TASK_TYPE]),
      }}
    />
  );
};
