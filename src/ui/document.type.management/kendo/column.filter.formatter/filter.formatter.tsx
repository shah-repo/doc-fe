// import { DropDownList } from "@progress/kendo-react-dropdowns/dist/npm/DropDownList/DropDownList";
import { DropDownList } from "@progress/kendo-react-dropdowns/dist/npm/DropDownList/DropDownList";
import { get } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { GroupTag } from "../../../../state/ducks/auth/types";
import { DOC_TYPE_GROUP, REVISION_STAGE_OPTIONS } from "../../../../state/ducks/documentRevisions/documentType/types";
import { enumToOptions, translatedOptions } from "../../transform";
import gridConfiguration from "../columns/column.definition";
import { DropdownFilterCell } from "./dropdown";


const getDSByType = (type) => enumToOptions(type).map((o) => ({
  text: o.label,
  value: o.value,
}));

const getDropDownDataSource = (field: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const intl = useIntl();
  const revisionStageOptions = translatedOptions(intl, REVISION_STAGE_OPTIONS).map((o) => ({
    text: o.label,
    value: o.value,
  }));
  const statusOptions = [{ text: "Active", value: true }, { text: "Inactive", value: false }];
  switch (field) {
    case "defaultRevStage":
      return revisionStageOptions;
    case "hiddenForCreationForUsersWithoutTags":
      return getDSByType(GroupTag);
    case "group":
      return getDSByType(DOC_TYPE_GROUP);
    case "active":
      return statusOptions;
    default:
      return [];
  }
};

export const BooleanFilterCell = (props: any) => (
  <DropdownFilterCell
    {...props}
    data={gridConfiguration.booleanFilterCellOptions}
    defaultItem={{ text: "All", value: "All" }}
  />
);

export const DropdownFilterCellTemplate = (props: any) => {
  const dataSource = getDropDownDataSource(props.field);
  return (
    <DropdownFilterCell
      {...props}
      data={dataSource}
      defaultItem={{ text: "", value: "" }}
    />
  );
};

// MOVE IN ANOTHER FILE
export const EditDropdownCellFormatter = (props) => {
  const localizedData = getDropDownDataSource(props.field);
  const isEdit = get(props.dataItem, "inEdit");
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
  return (
    <td>
      {isEdit ? (
        <DropDownList
          onChange={handleChange}
          value={localizedData.find((c) => c.value === dataValue)}
          data={localizedData}
          textField="text"
        />
      ) : (
        dataValue.toString()
      )}
    </td>
  );
};
