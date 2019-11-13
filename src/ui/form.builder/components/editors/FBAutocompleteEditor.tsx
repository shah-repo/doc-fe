import { Box } from "@material-ui/core";
import React from "react";
import { CHANGE_REQUEST_ROOT_URL } from "../../../../state/ducks/changeRequest/constants";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../../state/ducks/documentRevisions/constants";
import { FBAutocompleteConfig } from "../../types/autocomplete";
import FBCheckbox from "../inputs/FBCheckbox";
import FBSelect from "../inputs/FBSelect";
import FBLabelEditor from "./FBLabelEditor";
import FBPlaceholderEditor from "./FBPlaceholderEditor";
import { SelectOption } from "../../../components/forms/fields/Select";

// *NOTE: for demo only. Will be removed
export const tempOtions: FBAutocompleteConfig[] = [
  {
    id: "1",
    value: "documentRevision",
    url: DOCUMENT_REVISION_ROOT_URL,
    text: "Document revisions",
    renderKey: "name",
  },
  {
    id: "2",
    value: "changeRequest",
    url: CHANGE_REQUEST_ROOT_URL,
    text: "Change requests",
    renderKey: "title",
  },
  {
    id: "3",
    value: "approvers",
    url: `${CHANGE_REQUEST_ROOT_URL}/available_approvers`,
    text: "Approvers",
    renderKey: "email",
  },
];

const FBAutocompleteEditor: React.FunctionComponent<{}> = () => (
  <Box>
    <FBLabelEditor />
    <FBPlaceholderEditor />
    <FBSelect label="form.builder.select.options" options={tempOtions as SelectOption[]} name="autocompleteList" />
    <FBCheckbox label="form.builder.multi.select" name="isMulti" />
  </Box>

);

export default FBAutocompleteEditor;
