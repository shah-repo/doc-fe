import { filterBy } from "@progress/kendo-data-query";
import { MultiSelect, MultiSelectFilterChangeEvent } from "@progress/kendo-react-dropdowns";
import { uniq } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import ExpandableTemplate from "../../../components/common/kendo/ExpandableTemplate";

interface TagsCellProps {
  dataItem: any;
  rowType?: string;
  colSpan?: number | undefined;
  style?: React.CSSProperties;
  className?: string;
  columnIndex?: number;
  field?: string;
  isOfficial: boolean;
}

export const TagsCell = ({
  dataItem,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  field,
  isOfficial,
}: TagsCellProps) => {
  const [result, setResult] = React.useState([]);
  const tags = dataItem[field || ""];

  const allGroups = uniq(useSelector(userManagementSelectors.getOfficialGroups).filter(
    (group) => group.tags && group.tags.length
  ).map((e) => e.tags).flat().sort());

  const [data, setData] = React.useState(allGroups);

  const updateTagField = ({ target }) => {
    dataItem.tags = target?.value;
    setResult(target.value);
  };

  const filterChange = ({ filter }: MultiSelectFilterChangeEvent) => {
    const newData = filterBy(allGroups, filter);
    setData(newData);
  };

  if (rowType === "groupHeader") {
    return null;
  }

  return (
    <td
      id="kendo-expandable-column"
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      {dataItem.inEdit && isOfficial ? (
        <MultiSelect
          data={data}
          value={result}
          filterable={true}
          onFilterChange={filterChange}
          onChange={updateTagField}
        />
      ) : (
        <ExpandableTemplate items={tags.split(",")}  dataId={`${dataItem.id}-${columnIndex}`} />
      )}
    </td>
  );
};
