import { Box, Typography } from '@material-ui/core';
import { isEmpty } from 'lodash';
import React from 'react';
import { Approval, ApprovalStatus, DataProps } from '../../../state/ducks/common/types';
import SummaryField from '../../common/summary/base';
import DateTime from '../../components/DateTime';
import Text from '../../components/Text';
import { isDocumentRevisionApproved } from '../../documentRevision/helpers/documentRevisionStatus';

type Props = DataProps<Approval[]>;

const Approvers: React.FunctionComponent<Props> = ({ dataProp }) => {

  if (isEmpty(dataProp)) {
    return null;
  }

  const approvalRenderer = () => dataProp
    .filter((approval) => approval.status !== ApprovalStatus.Abandoned)
    .map((approval, index) => {
      const { approver, status, reviewedAt } = approval;
      const isApproved = isDocumentRevisionApproved(approval.status);
      const value = (
        <Box>
          <Box>
            <Typography id="userName" variant="h5" component="span">
              <Box component="span" fontWeight="bold">{
                isApproved ? approval.approverName : approver.user.name
              }</Box>
            </Typography>
            <Typography id="statusdate" variant="h5" component="span">
              {isApproved && approval.approverGroups ? ` | ${approval.approverGroups?.join(', ')}` : ''}
              {` | ${status}`}
              {isApproved && reviewedAt && (
                <span>
                  {'| '}
                  <DateTime value={reviewedAt} />
                </span>
              )}
            </Typography>
          </Box>
          <Box mb={4}>
            <Typography id="userName" variant="h5" component="span">{
              isApproved ? approval.approverEmail : approver.user.email
            }
            </Typography>
          </Box>
        </Box>
      );
      return (
        <SummaryField
          key={`${approval.id}${index}`}
          value={value}
        />
      );
    });

  return (
    <Box p={2}>
      <Typography variant="h6">
        <Text translation="common.approvers" />
      </Typography>
      {approvalRenderer()}
    </Box>
  );
};

export default Approvers;
