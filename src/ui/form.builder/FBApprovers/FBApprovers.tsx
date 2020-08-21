import { Box } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import React from "react";
import { FBApproversProps, FBInput, FBMapWrapper, FBRequiredApprover, FBText } from "..";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption } from "../FBAutocompleteAsync";
import { withFBApprovers } from "./FBApprovers.wrap";

const FBApprovers: React.FunctionComponent<FBApproversProps> = ({
  renderOption,
  isIncluded,
  name,
  gutter,
  disabled,
  loading,
  groups = {},
}) => (
  <FBInput {...{ name, gutter, disabled }} type="approvers">
    <FBAutocompleteAsync
      label="form.builder.approvers"
      placeholder="form.builder.start.typing.list"
      optionId={FBAutocompleteAsyncOption.availableApprovers}
      optionValueType="id"
      multiple={true}
      withState={true}
      gutter={false}
      {...{ loading, renderOption, name }}
    />
    <Box display="flex" flexWrap="wrap">
      <FBMapWrapper<Record<string, FBRequiredApprover>> collection={groups}>
        {(group: FBRequiredApprover, id) => (
          <Box display="flex" key={`fb-approvers-group-${id}`} mr={2.5} >
            <CheckCircleIcon color={isIncluded?.(group) ? "primary" : "disabled"} />
            <FBText boxProps={{ mt: 0.2, pl: 0.5 }} locale={group.name} />
          </Box>
        )}
      </FBMapWrapper>
    </Box>
  </FBInput>
);

export default withFBApprovers(FBApprovers);
