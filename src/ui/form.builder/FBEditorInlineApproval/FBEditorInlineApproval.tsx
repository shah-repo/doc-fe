import React from 'react';
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBEditor, FBEditorProps, FBInlineApprovalValue, FBTextField } from '..';
import Colors from '../../layout/theme/utils/colors';
import { styles as FBAutoCompleteStyles } from '../styles/FBAutocomplete.styles';
import { styles } from '../styles/FBEditorTextField.styles';

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
        labelProps={FBAutoCompleteStyles.labelProps}
      />
      <FBAutocompleteAsync
        label="common.approvers"
        optionId={FBAutocompleteAsyncOption.availableApprovers}
        name="editorConfig.approvers"
        multiple={true}
        defaultValue={(defaultValue as FBInlineApprovalValue)?.approvers}
        rules="required_without_all:editorConfig.groups,editorConfig.roles"
        inputPropStyle={{ borderColor: Colors.gray_goose, borderRadius: 3 }}
        labelProps={FBAutoCompleteStyles.labelProps}
        inputPropStyleSize="small"
        boxProps={{ marginBottom: 3.125 }}
      />
      <FBAutocompleteAsync
        label="form.builder.approver.groups"
        optionId={FBAutocompleteAsyncOption.groups}
        name="editorConfig.groups"
        multiple={true}
        defaultValue={(defaultValue as FBInlineApprovalValue)?.groups}
        rules="required_without_all:editorConfig.approvers,editorConfig.roles"
        inputPropStyle={{ borderColor: Colors.gray_goose, borderRadius: 3 }}
        labelProps={FBAutoCompleteStyles.labelProps}
        inputPropStyleSize="small"
        boxProps={{ marginBottom: 3.125 }}
      />
      <FBAutocompleteAsync
        label="form.builder.approval.roles"
        optionId={FBAutocompleteAsyncOption.approvalRoles}
        name="editorConfig.roles"
        multiple={true}
        defaultValue={(defaultValue as FBInlineApprovalValue)?.roles}
        rules="required_without_all:editorConfig.approvers,editorConfig.groups"
        inputPropStyle={{ borderColor: Colors.gray_goose, borderRadius: 3 }}
        labelProps={FBAutoCompleteStyles.labelProps}
        inputPropStyleSize="small"
        boxProps={{ marginBottom: 3.125 }}
      />
      {children}
    </FBEditor>
  );
};

export default FBEditorInlineApproval;
