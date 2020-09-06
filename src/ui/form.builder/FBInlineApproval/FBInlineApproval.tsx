import { Box } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import React from "react";
import { FBAutocomplete, FBInlineApprovalProps, FBInput, FBText } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBInlineApproval } from "./FBInlineApproval.wrap";

const FBInlineApproval: React.FunctionComponent<FBInlineApprovalProps> = ({
  label = "form.builder.approvers",
  disabled,
  options,
  ...props
}) => (
  <FBInput {...props} type="inlineapproval">
    <Box
      py={1}
      mb={4}
      display="flex"
      border={1}
      borderLeft={0}
      borderRight={0}
      borderTop={0}
      borderColor={Colors.red}
    >
      <ErrorIcon style={{ color: Colors.medium_red }} />
      <Box ml={1} display="flex" mt={0.3}>
        <FBText boxProps={{ flexGrow: 1 }} locale="form.builder.approval.waiting" />
      </Box>
    </Box>
    <FBAutocomplete
      {...{ label, disabled, options }}
      name={props.name}
      gutter={false}
      optionLabelKey="name"
      optionValueKey="id"
      groupByKey="type"
    />
  </FBInput>
);

export default withFBInlineApproval(FBInlineApproval);
