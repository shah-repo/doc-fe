import { Box } from "@material-ui/core";
import React from "react";
import { FBApprovalMatrixRolesProps, FBApprovalRole, FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBDialog, FBMapWrapper, FBProvider, FBSection, FBTextField } from "..";
import { withFBApprovalMatrixRoles } from "./FBApprovalMatrixRoles.wrap";

const FBApprovalMatrixRoles: React.FunctionComponent<FBApprovalMatrixRolesProps> = ({
  onClick,
  dialogState,
  approvalRoles = [],
  disabled,
  name,
}) =>  (
  <FBProvider {...{ dialogState }}>
    <Box mb={5}>
      <FBDialog />
      <FBSection label="form.builder.approval.roles" />
      {approvalRoles && (
        <FBMapWrapper<FBApprovalRole[]> collection={approvalRoles}>
          {(role: FBApprovalRole, index) => (
            <>
              <FBTextField
                key={`fb-role-name-${role.id}`}
                label="form.builder.approval.role"
                name={`${name}.approvalRoles.${index}.name`}
                disabled={true}
              />
              <FBAutocompleteAsync
                key={`fb-role-role-approver-${role.id}`}
                label="form.builder.approving.users"
                name={`${name}.approvalRoles.${index}.employees`}
                placeholder="form.builder.approving.roles.placeholder"
                optionValueType="object"
                multiple={true}
                optionId={FBAutocompleteAsyncOption.employees}
                {...{ disabled }}
              />
              <FBAutocompleteAsync
                key={`fb-role-role-group-${role.id}`}
                label="form.builder.approving.groups"
                name={`${name}.approvalRoles.${index}.groups`}
                placeholder="form.builder.approving.roles.placeholder"
                optionValueType="object"
                multiple={true}
                optionId={FBAutocompleteAsyncOption.group}
                {...{ disabled }}
              />
            </>
          )}
        </FBMapWrapper>
      )}
      <FBButton
        fullWidth={true}
        label="form.builder.add.another.role"
        variant="outlined"
        style={{ margin: 0 }}
        {...{ disabled, onClick }}
      />
    </Box>
  </FBProvider>
);

export default withFBApprovalMatrixRoles(FBApprovalMatrixRoles);
