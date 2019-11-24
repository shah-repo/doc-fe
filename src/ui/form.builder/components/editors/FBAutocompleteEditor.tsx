import { Box } from "@material-ui/core";
import React from "react";
import autocompleteEditorList from "../../stores/domain/collections/FBAutocompleteEditorCollection";
import FBCheckbox from "../inputs/FBCheckbox";
import FBSelect from "../inputs/FBSelect";
import FBLabelEditor from "./FBLabelEditor";
import FBPlaceholderEditor from "./FBPlaceholderEditor";

// *NOTE: for demo only. Will be removed
// export const tempOtions: FBAutocompleteConfig[] = [
//   {
//     id: "1",
//     url: DOCUMENT_REVISION_ROOT_URL,
//     label: "Document revisions",
//     renderKey: "name",
//   },
//   {
//     id: "2",
//     url: CHANGE_REQUEST_ROOT_URL,
//     label: "Change requests",
//     renderKey: "title",
//   },
//   {
//     id: "3",
//     url: `${CHANGE_REQUEST_ROOT_URL}/available_approvers`,
//     label: "Approvers",
//     renderKey: "email",
//   },
// ];

// const options = tempOtions.map((config) => ({
//   value: config.id,
//   text: config.label,
// }));

const FBAutocompleteEditor: React.FunctionComponent<{}> = () => (
  <Box>
    <FBLabelEditor />
    <FBPlaceholderEditor />
    <FBSelect
      label="form.builder.select.options"
      options={autocompleteEditorList.options()}
      name="autocompleteId"
    />
    <FBCheckbox label="form.builder.multi.select" name="multiple" />
  </Box>
);

export default FBAutocompleteEditor;
