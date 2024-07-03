import { Box } from '@material-ui/core';
import React from 'react';
import { FBApproversProps, FBAutocompleteAsync, FBAutocompleteAsyncOption, FBInput, FBMapWrapper, FBRequiredApprover } from '..';
import Approvers from '../../change.request/summary/approvers';
import ApprovalApprovedGroup from '../FBApprovals/ApprovalApprovedGroup';
import { withFBApprovers } from './FBApprovers.wrap';

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
  changeRequestApprovals,
  approvalApprovedGroup,
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
      {...{ loading, renderOption, defaultValue, disabled, autosave, onBlur }}
    />
    <Box display="flex" flexDirection="row" flexWrap="wrap">
      <Box display="flex" flexWrap="wrap" mt={1}>
        {approvalApprovedGroup ? approvalApprovedGroup.map((groupName: string, index: number) => (
          <ApprovalApprovedGroup groupName={groupName} key={index} checked />
        )) : (
          <FBMapWrapper<Record<string, FBRequiredApprover>> collection={groups}>
            {(group: FBRequiredApprover, id) => (
              <Box display="flex" key={`fb-approvers-group-${id}`} mr={2.5}>
                <ApprovalApprovedGroup groupName={group.name} key={id} checked={isIncluded?.(group) } />
              </Box>
            )}
          </FBMapWrapper>
        )}
      </Box>
      <Box flexBasis="100%" >
        {changeRequestApprovals && changeRequestApprovals.length > 0 && (
          <Approvers dataProp={changeRequestApprovals} />
        )}
      </Box>
    </Box>
  </FBInput>
);

export default withFBApprovers(FBApprovers);
