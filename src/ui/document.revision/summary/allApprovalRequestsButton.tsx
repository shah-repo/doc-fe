import { Link, Popover, Table, TableBody, TableCell, TableHead, TableRow, Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import { MomentFormats } from '../../../common/utils/date';

import { IAssociatedChangeRequest } from '../../../state/ducks/documentRevisions/types';
import DateTime from '../../components/DateTime';
import Text from '../../components/Text';
import Colors from '../../layout/theme/utils/colors';

interface Props {
  associatedChangeRequests: IAssociatedChangeRequest[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(1, 2, 1, 1),
      marginTop: theme.spacing(0.5),
      backgroundColor: Colors.white,
      boxShadow: `4px 4px 8px 4px ${Colors.blue_bell}`,
      right: theme.spacing(1.25),
      maxWidth: 'fit-content',
    },
    link: {
      color: Colors.navy,
    },
    table: {
      width: '100%',
    },
    heading: {
      color: Colors.dark_gray,
    },
  }),
);

const ApprovalRequestTable: React.FunctionComponent<Props> = ({
  associatedChangeRequests,
}) => {
  const classes = useStyles();
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
            <TableCell component="th" scope="row">{changeRequest.crId}</TableCell>
            <TableCell>{changeRequest.revChanges}</TableCell>
            <TableCell>{changeRequest.title}</TableCell>
            <TableCell>{changeRequest.owner}</TableCell>
            <TableCell>{changeRequest.state}</TableCell>
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
  const classes = useStyles();
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
