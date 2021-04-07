import { Box } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import React from "react";
import { FBApproversProps, FBAutocompleteAsync, FBAutocompleteAsyncOption, FBInput, FBMapWrapper, FBRequiredApprover, FBText } from "..";
import { withFBApprovers } from "./FBApprovers.wrap";

const FBApprovers: React.FunctionComponent<FBApproversProps> = ({
  renderOption,
  isIncluded,
  onBlur,
  name,
  gutter,
  disabled,
  loading,
  defaultValue,
  groups = {},
  autosave,
}) => (
  <FBInput {...{ name, gutter, disabled, autosave }} type="approvers">
    <FBAutocompleteAsync
      label="form.builder.approvers"
      placeholder="form.builder.start.typing.list"
      optionId={FBAutocompleteAsyncOption.availableApprovers}
      optionValueType="id"
      multiple={true}
      withState={true}
      gutter={false}
      omitFormValue={true}
      name={`fb-approvers-${name}`}
      {...{ loading, renderOption, defaultValue, disabled, autosave, onBlur  }}
    />
    <Box display="flex" flexWrap="wrap">
      <FBMapWrapper<Record<string, FBRequiredApprover>> collection={groups}>
        {(group: FBRequiredApprover, id) => (
          <Box display="flex" key={`fb-approvers-group-${id}`} mr={2.5} >
            <CheckCircleIcon data-cy={`fb-approvers-${group.name}-check-${isIncluded?.(group) ? "marked" : "disabled"}`}
              color={isIncluded?.(group) ? "primary" : "disabled"} />
            <FBText boxProps={{ mt: 0.2, pl: 0.5 }} locale={group.name} />
          </Box>
        )}
      </FBMapWrapper>
    </Box>
  </FBInput>
);

export default withFBApprovers(FBApprovers);
