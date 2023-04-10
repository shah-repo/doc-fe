import React from "react";
import { useTranslate } from "../../../../../common/intl";
import DropdownFilter from "../DropdownFilter";
import { GridFilterCellProps } from "@progress/kendo-react-grid";

const StatusFilter: React.FC<GridFilterCellProps> = (props) => {
  const translate = useTranslate();

  return (
    <DropdownFilter
      {...props}
      data={[
        { value: true, text: translate("common.active") },
        { value: false, text: translate("common.inactive") },
      ]}
      defaultItem={{ value: "", text: translate("common.all") }}
    />
  );
};

export default StatusFilter;
