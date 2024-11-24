import { Box, Collapse, LinearProgress, ListItemText, Popover, TextField } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { SortDirection } from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ErrorIcon from '@material-ui/icons/Error';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { AxiosRequestConfig } from 'axios';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import React, { ReactElement, useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { intl } from '../../../common/intl';
import { MomentFormats } from '../../../common/utils/date';
import apiClient from '../../../state/apiClient';
import { BULK_MIGRATION_GET_SCAN_RESULTS, BULK_MIGRATION_START_REVS_MIGRATION } from '../../../state/ducks/company/constants';
import { store } from '../../../state/store';
import DateTime from '../../components/DateTime';
import { toastError, toastSuccess } from '../../components/notifications';
import UserAvatarListItem from '../../documentRevision/Sidebar/common/UserAvatarListItem';
import { FBButton } from '../../form.builder';
import { Colors } from '../../layout/theme-next';
import UtilColors from '../../layout/theme/utils/colors';
import { ISelectedDetails, ISupplierScanResultRev, MIGRATION_STATUS_ENUM } from './interface';
import MigrationConfirmationDialog from './MigrationConfirmation.dialog';

const INITIAL_ROWS_COUNT = 25;

const headCells = [
  { id: 'docId', disablePadding: true, label: 'Doc Id', width: '10%', searchAllowed: true, orderingAllowed: true },
  { id: 'name', disablePadding: false, label: 'Name', width: '25%', searchAllowed: true, orderingAllowed: true },
  { id: 'owner', disablePadding: false, label: 'Owner', width: '15%', searchAllowed: true, orderingAllowed: true },
  { id: 'fieldsUnmatched', disablePadding: false, label: 'Fields Unmatched', width: '24%' },
  { id: 'proposedAction', disablePadding: false, label: 'Proposed Action', width: '10%' },
  { id: 'haveConcerns', alignRight: true, disablePadding: false, label: 'Have Concerns', width: '8%' },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(4),
    '& > *': {
      borderBottom: 'unset',
    },
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  popoverPaper: {
    padding: theme.spacing(1),
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  progress: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  primaryText: {
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '21px',
    color: UtilColors.dark_jungle_green,
  },
  flexBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'items-center',
  },
  flexBoxColumn: {
    display: 'flex',
    flexDirection: 'column',
    gridGap: theme.spacing(0.25, 1),
  },
  dateTimeLabel: {
    fontSize: 12,
    padding: theme.spacing(0, 1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  '.MuiTablePagination-selectIcon': {
    top: '0px',
    left: '1px',
  },
}));

const EnhancedTableHead: React.FC<{
  classes: {[key: string]: any}
  onSelectAllClick: (event) => void
  order: SortDirection
  orderBy: string
  numSelected: number
  rowCount: number
  onRequestSort: (e, property: string) => void
  onSearchTextChange: (value: string, fieldName: string) => void
}> = ({
  classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, onSearchTextChange,
}) => {
  const searchTextChanged = (value: string, fieldName: string) => {
    onSearchTextChange(value, fieldName);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        <TableCell
          style={{ width: '8%', padding: '8px 4px' }}>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'Select All Suppliers' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ width: `${headCell.width}`, overflow: 'hidden', padding: '8px 4px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>
                <span>{headCell.label}</span>
              </div>
              {headCell.searchAllowed
              && <TextField size="small" variant="outlined" placeholder="Search"
                onChange={e => searchTextChanged(e.target.value, headCell.id)} />
              }
            </div>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const ExpandableRow: React.FC<{
  row: ISupplierScanResultRev
  handleSelection: (event, row: ISupplierScanResultRev) => void
  handleRejection: (event, docRevId: string) => void
  isItemSelected: boolean
  labelId: string
  isItemRejected: boolean
  onIconHovered: (event, content: ReactElement) => void
  handlePopoverClose: () => void
}> = ({
  row, handleSelection, handleRejection, isItemSelected,
  labelId, isItemRejected, onIconHovered, handlePopoverClose,
}) => {
  const [rowOpen, setRowOpen] = React.useState(false);
  const classes = useStyles();

  const getRowColor = (row: ISupplierScanResultRev) => {
    if (row.status === MIGRATION_STATUS_ENUM.IN_PROGRESS) {
      return Colors.secondaryLight;
    }

    if (row.status === MIGRATION_STATUS_ENUM.FAILED) {
      return UtilColors.error_bg;
    }
  };

  const handleIconHover = (event) => {
    const contentEl: ReactElement
    = <>
      { row.runDetails[0]?.runAt && row.runDetails[0]?.completedAt
           && <>
             <>
            Completed At: <DateTime
                 value={row.runDetails[0]?.completedAt}
                 format={MomentFormats.BriefDateTime}
                 className={cx(classes.dateTimeLabel)}
               /> • Started At: <DateTime
                 value={row.runDetails[0]?.runAt}
                 format={MomentFormats.BriefDateTime}
                 className={cx(classes.dateTimeLabel)}
               />
             </>
             {
              row.runDetails[0]?.failureReason
                && <><br />{row.runDetails[0]?.failureReason?.message ?? 'Something went wrong'}</>
             }
           </>
      }
      { row.runDetails[0]?.runAt && !row.runDetails[0]?.completedAt
           && <>
            Started At: <DateTime
               value={row.runDetails[0]?.runAt}
               format={MomentFormats.BriefDateTime}
               className={cx(classes.dateTimeLabel)}
             /> • In PROGRESS
           </>
      }
      { !row.runDetails[0]?.runAt
           && <>
            Not Attempted Yet
           </>
      }
    </>;
    onIconHovered(event, contentEl);
  };

  return (
    <React.Fragment>
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        selected={isItemSelected}
        style={{ backgroundColor: getRowColor(row) }}
      >
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setRowOpen(!rowOpen)}>
            {rowOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell padding="checkbox"
          onClick={(event) => row.status !== MIGRATION_STATUS_ENUM.COMPLETED && handleSelection(event, row)}>
          <div style={{ display: 'flex', alignItems: 'center' }}
            onMouseEnter={handleIconHover}
            onMouseLeave={handlePopoverClose}
          >
            { row.status !== MIGRATION_STATUS_ENUM.COMPLETED && <Checkbox
              checked={isItemSelected}
              inputProps={{ 'aria-labelledby': labelId }}
            /> }
            {
              row.status === MIGRATION_STATUS_ENUM.COMPLETED
              && <DoneAllIcon style={{ color: Colors.success }} />
            }
            {
              row.status === MIGRATION_STATUS_ENUM.FAILED
              && <ErrorIcon style={{ color: Colors.error }} />
            }
            {
              row.status === MIGRATION_STATUS_ENUM.IN_PROGRESS
              && <HourglassEmptyIcon style={{ color: Colors.warning }} />
            }
          </div>
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none">
          {row.docId}
        </TableCell>
        <TableCell align="left">
          <p className={classes.flexBoxColumn}>
            <span><b>{row.docRevName}</b></span>
            <span>Rev {row.displayRevision} • {row.displayStatus}</span>
          </p>
        </TableCell>
        <TableCell align="left">
          <ListItemText
            primary={(
              <Typography data-cy="user-name" className={classes.primaryText}>{row.name}</Typography>)}
            secondary={<></>}
          />
          { row.owner?.user && <UserAvatarListItem
            name={<div>{row.owner?.user.name}</div>}
            user={row.owner?.user}
            secondaryComponent={<></>}
          /> }
        </TableCell>
        {/* <TableCell align="left">{JSON.stringify(row.originalFormInput)}</TableCell>
        <TableCell align="left">{JSON.stringify(row.newFormInput)}</TableCell> */}
        <TableCell align="left" style={{ overflow: 'hidden', wordWrap: 'break-word' }}>
          {JSON.stringify(row.fieldNamesUnmatched)}
          {/* <ReactJson src={row.fieldNamesUnmatched} collapsed={1} /> */}
        </TableCell>
        <TableCell style={{ overflow: 'hidden', wordWrap: 'break-word' }}>{row.proposedAction}</TableCell>
        <TableCell align="right" padding="checkbox" onClick={(event) => handleRejection(event, row.docRevId)}>
          { !row.status && <Checkbox
            checked={isItemRejected}
            inputProps={{ 'aria-labelledby': labelId }}
          /> }
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={rowOpen} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Form Input Comparison
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '50%' }}>Original Form Input</TableCell>
                    <TableCell style={{ width: '50%' }}>New Form Input </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow style={{ verticalAlign: 'baseline' }}>
                    <TableCell align="left">
                      {row.originalFormInput && <ReactJson src={row.originalFormInput} collapsed={1} /> }
                      {!row.originalFormInput && <span>No FormInput</span> }
                    </TableCell>
                    <TableCell align="left">
                      {row.newFormInput && <ReactJson src={row.newFormInput} collapsed={1} /> }
                      {!row.newFormInput && <span>No FormInput</span> }
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const RevsTable: React.FC<{
  scanId: string
}> = ({
  scanId,
}) => {
  const classes = useStyles();
  const [searchQueries, setSearchQueries] = React.useState<{[key: string]: string}>({});
  const [order, setOrder] = React.useState<SortDirection>('desc');
  const [orderBy, setOrderBy] = React.useState('createdAt');
  const [selected, setSelected] = useState<ISelectedDetails[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(INITIAL_ROWS_COUNT);

  const [rows, setRows] = useState<ISupplierScanResultRev[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [isConfirmationDialogVisible, setIsConfirmationDialogVisible] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [popoverContent, setPopoverContent] = useState<ReactElement>(<></>);

  const handlePopoverOpen = (event, content) => {
    setAnchorEl(event.currentTarget);
    setPopoverContent(content);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverContent(<></>);
  };

  function catchAxiosException (exception: any) {
    setIsLoading(false);
    if (exception?.response?.status === 504) {
      setErrorMessage(intl.formatMessage({ id: 'api.error.gateway.timeout' }));
    } else {
      toastError(exception?.response.data?.message);
      setErrorMessage(exception?.response.data?.message);
    }
  }

  useEffect(() => {
    if (scanId) {
      fetchScanSupplierRevisions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanId, searchQueries, page, rowsPerPage, orderBy, order]);

  function fetchScanSupplierRevisions () {
    setIsLoading(true);
    setErrorMessage('');

    const requestConfig: AxiosRequestConfig = {
      method: 'post',
      url: `${BULK_MIGRATION_GET_SCAN_RESULTS}/${scanId}?offset=${page}&limit=${rowsPerPage}&orderBy=${orderBy}&sortOrder=${(order as string).toLocaleUpperCase()}`,
      data: {
        searchQueries,
      },
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
      // cancelToken: call.token,
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        setIsLoading(false);
        const { items, totalCount }: {items: ISupplierScanResultRev[], totalCount: number} = data;

        setRows(items);
        setTotalCount(totalCount);
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchTextChange = (value: string, propertyId: string) => {
    const newSearchQueries = {
      ...searchQueries, [propertyId]: value,
    };
    setSearchQueries(newSearchQueries);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelectedDetails: ISelectedDetails[] = rows.map((n) => ({ id: n.docRevId, action: n.proposedAction }));
      setSelected(newSelectedDetails);
      return;
    }
    setSelected([]);
  };

  const handleSelection = (event, row: ISupplierScanResultRev) => {
    const selectedIndex = selected.findIndex(entry => entry.id === row.docRevId);
    let newSelected: ISelectedDetails[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, { id: row.docRevId, action: row.proposedAction });
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleRejection = (event, id: string) => {
    // Will update DB
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const confirmSubmission = () => {
    setIsConfirmationDialogVisible(true);
  };

  const handleMigrationConfirmationDialogClose = () => {
    setIsConfirmationDialogVisible(false);
  };

  const handleMigrationConfirmation = () => {
    // Take all the ones selected & send to BE
    setIsLoading(true);
    setErrorMessage('');

    const requestConfig: AxiosRequestConfig = {
      method: 'post',
      url: `${BULK_MIGRATION_START_REVS_MIGRATION}`,
      data: {
        revIds: selected.map(entry => entry.id),
      },
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
      // cancelToken: call.token,
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        setIsLoading(false);
        handleMigrationConfirmationDialogClose();
        toastSuccess('Supplier Migration job request has been placed. Please check back in some time.');
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  };

  const isSelected = (id: string) => selected.findIndex(entry => entry.id === id) > -1;
  const hasConcerns = (id: string) => selected.findIndex(entry => entry.id === id) > -1;
  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} style={{ maxHeight: '60vh', overflow: 'hidden', overflowY: 'auto' }}>
        {!isEmpty(errorMessage) && <div style={{ color: 'red' }}>{errorMessage}</div>}
        <Toolbar
          className={cx(classes.root, classes.flexBox, {
            [classes.highlight]: selected.length > 0,
          })}
          style={{ marginBottom: '4px' }}
        >
          <Typography variant="h6" id="tableTitle" component="div">Supplier Revs
            <Typography color="inherit" variant="subtitle1" component="div">
              {selected.length} selected
            </Typography>
          </Typography>

          { selected.length > 0 && <FBButton
            label="Migrate Suppliers"
            dataCy="migrate-suppliers-btn"
            onClick = {confirmSubmission}
            variant="contained"
            color="primary"
          /> }

          <TablePagination
            rowsPerPageOptions={[25, 50, 100]}
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Toolbar>
        <div>
          {isLoading && <LinearProgress className={classes.progress} data-cy="saving-progress-bar" />}
          <Table
            style={{ width: '100%', tableLayout: 'fixed' }}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="Supplier Revs Table"
            stickyHeader
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              onSearchTextChange={handleSearchTextChange}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.map((row, index) => {
                const isItemSelected = isSelected(row.docRevId);
                const isItemRejected = hasConcerns(row.docRevId);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <ExpandableRow row={row} handleSelection={handleSelection} handleRejection={handleRejection}
                    isItemSelected={isItemSelected} labelId={labelId} key={row.docRevId} isItemRejected={isItemRejected}
                    onIconHovered={(event, content) => handlePopoverOpen(event, content)}
                    handlePopoverClose={handlePopoverClose}
                  />
                );
              })}
              {/* {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
          <Popover
            style={{ pointerEvents: 'none' }}
            classes={{
              paper: classes.popoverPaper,
            }}
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            {popoverContent}
          </Popover>
        </div>
      </Paper>
      {
        isConfirmationDialogVisible && <MigrationConfirmationDialog
          isOpen={isConfirmationDialogVisible}
          handleClose={handleMigrationConfirmationDialogClose}
          selectedDetails={selected}
          handleConfirmation={handleMigrationConfirmation}
        />
      }
    </div>
  );
};

export default RevsTable;
