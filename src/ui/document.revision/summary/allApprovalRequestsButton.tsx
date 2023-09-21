import { Link, Popover, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import React, { useState } from 'react';
import { MomentFormats } from '../../../common/utils/date';
import { STATUS_TYPES_LABEL } from '../../../state/ducks/dashboard.new/my.feeds/types';

import { IAssociatedChangeRequest } from '../../../state/ducks/documentRevisions/types';
import DateTime from '../../components/DateTime';
import Text from '../../components/Text';

import { styles } from './allApprovalRequests.styles';

interface Props {
  associatedChangeRequests: IAssociatedChangeRequest[]
}

const ApprovalRequestTable: React.FunctionComponent<Props> = ({
  associatedChangeRequests,
}) => {
  const classes = styles();
  return (
    <Table className={classes.table} size="small" aria-label="Approval requests table">
      <TableHead>
        <TableRow>
          {
            ['arId', 'revChanges', 'arTitle', 'owner', 'status', 'date'].map((heading) =>
              <TableCell key={heading}>
                <Text message={`documentRevision.allChangeReqyests.table.heading.${heading}`} />
              </TableCell>,
            )
          }
        </TableRow>
      </TableHead>
      <TableBody>
        {associatedChangeRequests.map((changeRequest) => (
          <TableRow key={changeRequest.crId}>
            { ['crId', 'revChanges', 'title', 'owner'].map((fieldName) =>
              <TableCell>{changeRequest[fieldName]}</TableCell>,
            )}
            <TableCell>
              {STATUS_TYPES_LABEL[changeRequest.state]}
            </TableCell>
            <TableCell>
              <DateTime
                value={changeRequest.updatedAt}
                format={MomentFormats.BriefDateTime}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const AllApprovalRequestsButton: React.FunctionComponent<Props> = ({
  associatedChangeRequests,
}) => {
  const classes = styles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const showApprovalRequests = (event) => {
    handlePopoverOpen(event);
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'approvalRequests-popover' : undefined;

  return (
    <div>
      <Link
        component="button"
        id="showAllApprovalRequests"
        data-cy="showAllApprovalRequests"
        onClick={showApprovalRequests}
        className={classes.link}
        color="primary"
      >
        <Text message="documentRevision.changeRequest.all.link.text" />
      </Link>
      <Popover
        id={id}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <ApprovalRequestTable associatedChangeRequests={associatedChangeRequests} />
      </Popover>
    </div>
  );
};

export default AllApprovalRequestsButton;
