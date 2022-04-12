import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBEditor, FBEditorProps, FBInlineApprovalValue, FBTextField } from "..";
import { styles } from "../styles/FBEditorTextField.styles";

const FBEditorInlineApproval: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps: { defaultValue } = {},
  inputProps,
  includeDefaultValue,
  standalone = false,
  ...props
}) => {
  const classes = styles();
  return (
    <FBEditor {...props} {...{ inputProps }}>
      <FBTextField
        label="form.builder.label"
        name="label"
        rules="required"
        className={classes.textfield}
        boxProps={{ mb: 3.125, className: classes.error }}
        labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}
      />
      <FBAutocompleteAsync
        label="common.approvers"
        optionId={FBAutocompleteAsyncOption.availableApprovers}
        name="editorConfig.approvers"
        multiple={true}
        defaultValue={(defaultValue as FBInlineApprovalValue)?.approvers}
        rules="required_without_all:editorConfig.groups,editorConfig.roles"
        inputPropStyle={{ height: 47, borderWidth: 1, borderColor: "#CCD4D9", borderRadius: 3 }}
        labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}
        inputPropStyleSize="small"
      />
      <FBAutocompleteAsync
        label="form.builder.approver.groups"
        optionId={FBAutocompleteAsyncOption.groups}
        name="editorConfig.groups"
        multiple={true}
        defaultValue={(defaultValue as FBInlineApprovalValue)?.groups}
        rules="required_without_all:editorConfig.approvers,editorConfig.roles"
        inputPropStyle={{ height: 47, borderWidth: 1, borderColor: "#CCD4D9", borderRadius: 3 }}
        labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}
        inputPropStyleSize="small"
      />
      <FBAutocompleteAsync
        label="form.builder.approval.roles"
        optionId={FBAutocompleteAsyncOption.approvalRoles}
        name="editorConfig.roles"
        multiple={true}
        defaultValue={(defaultValue as FBInlineApprovalValue)?.roles}
        rules="required_without_all:editorConfig.approvers,editorConfig.groups"
        inputPropStyle={{ height: 47, borderWidth: 1, borderColor: "#CCD4D9", borderRadius: 3 }}
        labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}
        inputPropStyleSize="small"
      />
      {children}
    </FBEditor>
  );
};

export default FBEditorInlineApproval;
