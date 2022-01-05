import { DropDownList } from "@progress/kendo-react-dropdowns/dist/npm/DropDownList/DropDownList";
import { orderBy } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { GroupTag } from "../../../../state/ducks/auth/types";
import { DOC_TYPE_GROUP, REVISION_STAGE_OPTIONS } from "../../../../state/ducks/documentRevisions/documentType/types";
import Tooltip from "../../../components/common/kendo/Tooltip";
import { enumToOptions, translatedOptions } from "../../transform";


const getDSByType = (type) => enumToOptions(type).map((o) => ({
  text: o.label,
  value: o.value,
}));

interface DataSourceProps {
  text: string;
  value: string | boolean;
}
interface ResultProps {
  dataSource: DataSourceProps[];
  operator: string;

}
export const getDropDownDataSource: (f: string) => ResultProps = (field: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const intl = useIntl();
  const revisionStageOptions = translatedOptions(intl, REVISION_STAGE_OPTIONS).map((o) => ({
    text: o.label,
    value: o.value,
  }));
  const statusOptions = [{ text: "Active", value: true }, { text: "Inactive", value: false }];
  const result: ResultProps = {
    dataSource: [],
    operator: "eq",
  };
  switch (field) {
    case "defaultRevStage":
      result.dataSource = orderBy(revisionStageOptions, "text");
      return result;
    case "hiddenForCreationForUsersWithoutTags":
      result.dataSource = orderBy(getDSByType(GroupTag), "text");
      return result;
    case "hiddenForCreationForUsersWithoutTagsFormatted":
      result.dataSource = orderBy(getDSByType(GroupTag), "text");
      result.operator = "contains";
      return result;
    case "group":
      result.dataSource = orderBy(getDSByType(DOC_TYPE_GROUP), "text");
      return result;
    case "active":
      result.dataSource = statusOptions;
      return result;
    default:
      return result;
  }
};

export const EditDropdownCellFormatter = (props) => {
  const localizedData: ResultProps = getDropDownDataSource(props.field);
  const isEdit: boolean = props.dataItem.inEdit;
  const handleChange = (e) => {
    if (props.onChange) {
      props.onChange({
        dataIndex: 0,
        dataItem: props.dataItem,
        field: props.field,
        syntheticEvent: e.syntheticEvent,
        value: e.target.value.value,
      });
    }
  };

  const { dataItem } = props;
  const field = props.field || "";
  const dataValue = dataItem[field] === null ? "" : dataItem[field];
  if (props.rowType === "groupHeader") {
    return null;
  }
  return (
    <td>
      {isEdit ? (
        <DropDownList
          onChange={handleChange}
          value={localizedData.dataSource.find((c) => c.value === dataValue)}
          data={localizedData.dataSource}
          textField="text"
          dataItemKey="value"
        />
      ) : (
        <Tooltip data={dataValue} />
      )}
    </td>
  );
};
