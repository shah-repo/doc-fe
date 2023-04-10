import React from "react";
import { useTranslate } from "../../../../../common/intl";
import DropdownFilter from "../DropdownFilter";
import { GridFilterCellProps } from "@progress/kendo-react-grid";

const BooleanFilter: React.FC<GridFilterCellProps> = (props) => {
  const translate = useTranslate();

  return (
    <DropdownFilter
      {...props}
      data={[
        { value: true, text: translate("common.true") },
        { value: false, text: translate("common.false") },
      ]}
      defaultItem={{ value: "", text: translate("common.all") }}
    />
  );
};

export default BooleanFilter;
