import { Box, Button } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import cx from 'classnames';
import { camelCase, sortBy } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { GroupTag } from '../../../state/ducks/auth/types';
import { PageDetails } from '../../../state/ducks/documentRevisions/documentType/types';
import { pageDetailsSelectors } from '../../../state/ducks/pageDetails';
import Text from '../../components/Text';
import { HOME_URL } from '../../constants/urls';
import useDialog from '../../hooks/useDialog';
import useGetHasTag from '../../hooks/useGetHasTag';
import Colors from '../../layout/theme/utils/colors';
import { PageDetailsForm } from '../add.page.details/container';
import { PageDetailsFormContainer } from '../form/container';

const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(6, 6, 2),
      height: '100%',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      height: theme.spacing(7.5),
      fontSize: theme.spacing(2),
      fontWeight: 'bold',
    },
    row: {
      height: theme.spacing(6),
      fontSize: theme.spacing(2.5),
      fontWeight: 'bold',
      backgroundColor: Colors.light_gray,
      cursor: 'pointer',
    },
    cell: {
      padding: theme.spacing(0),
    },
    containingBox: {
      overflow: 'auto',
      flexGrow: 1,
    },
    thead: {
      '& th': {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      },
    },
  })
);

function Row(props: { row: PageDetails }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = styles();

  return (
    <React.Fragment>
      <TableRow className={classes.row} onClick={() => setOpen(!open)}>
        <TableCell>
          <IconButton size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" data-cy={`page-detail.${camelCase(row.category)}`}>
          {row.category}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className={classes.cell} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <PageDetailsFormContainer pageDetails={row}/>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const PageDetailsManagementContainer: React.FC = () => {
  const classes = styles();
  const dialog = useDialog();

  const pageDetails = useSelector(pageDetailsSelectors.allPageDetails);

  const canManagePageDetails = useGetHasTag(GroupTag.PAGE_DETAILS_MANAGEMENT);

  if (!canManagePageDetails) {
    return <Redirect to={HOME_URL} />;
  }

  return (
    <Box className={classes.root}>
      <Box display="flex" justifyContent="flex-end">
        <Button onClick={dialog.open} variant="outlined">
          <Text translation={'common.add.page.details'} />
        </Button>
      </Box>
      <Box width="100%" className={cx(classes.containingBox, 'containing-box-scrollbar')}>
        <Table>
          <TableHead className={classes.thead}>
            <TableRow>
              <TableCell />
              <TableCell className={classes.header}>
                <Text translation={'page.details'} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortBy(pageDetails, 'category').map((row) => <Row key={row.category} row={row} />)}
          </TableBody>
        </Table>
      </Box>
      <PageDetailsForm {...{ dialog }}/>
    </Box>

  );
};

export default PageDetailsManagementContainer;
