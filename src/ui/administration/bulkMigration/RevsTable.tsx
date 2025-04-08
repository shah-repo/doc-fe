import { Box, Collapse, FormControlLabel, LinearProgress, ListItemText, Popover, Switch, TextField } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
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
import RefreshIcon from '@material-ui/icons/Refresh';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import React, { ReactElement, useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { Link } from 'react-router-dom';
import { MomentFormats } from '../../../common/utils/date';
import DateTime from '../../components/DateTime';
import { documentVersionPath } from '../../document.revision/utils/paths';
import UserAvatarListItem from '../../documentRevision/Sidebar/common/UserAvatarListItem';
import UtilColors from '../../layout/theme/utils/colors';
import { ISelectedDetails, ISupplierScanResultRev, MIGRATION_STATUS_ENUM, SortDirection } from './interface';
import useStyles from './styles';
import { useBulkMigration } from './useBulkMigration';

const INITIAL_ROWS_COUNT = 25;

const headCells = [
  { id: 'docId', disablePadding: true, label: 'Doc Id', width: '12%', searchAllowed: true, orderingAllowed: true },
  { id: 'name', disablePadding: false, label: 'Name', width: '27%', searchAllowed: true, orderingAllowed: true },
  { id: 'owner', disablePadding: false, label: 'Owner', width: '17%', searchAllowed: true, orderingAllowed: true },
  { id: 'fieldsUnmatched', disablePadding: false, label: 'Fields Unmatched', width: '26%' },
  { id: 'proposedAction', disablePadding: false, label: 'Proposed Action', width: '10%' },
];

const EnhancedTableHead: React.FC<{
  onSelectAllClick: (event) => void
  order: SortDirection
  orderBy: string
  numSelected: number
  rowCount: number
  onRequestSort: (e, property: string) => void
  onSearchTextChange: (value: string, fieldName: string) => void
}> = ({
  onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, onSearchTextChange,
}) => {
  const classes = useStyles();
  const searchTextChanged = (value: string, fieldName: string) => {
    onSearchTextChange(value, fieldName);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        <TableCell className={classes.revsTableCheckboxCell}>
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
            align="left"
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ width: `${headCell.width}` }}
            className={classes.revsTableHeaderCell}
          >
            <div className={classes.simpleColumnFlex}>
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
  isItemSelected: boolean
  labelId: string
  onIconHovered: (event, content: ReactElement) => void
  handlePopoverClose: () => void
  scanId: string
}> = ({
  row, handleSelection, isItemSelected,
  labelId, onIconHovered, handlePopoverClose, scanId,
}) => {
  const [rowOpen, setRowOpen] = React.useState(false);

  const {
    rowMapping,
    getPreviewForDocRevRevsTable,
  } = useBulkMigration();

  const classes = useStyles();

  const getRowColor = (row: ISupplierScanResultRev) => {
    if (row.status === MIGRATION_STATUS_ENUM.IN_PROGRESS) {
      return UtilColors.inProgress;
    }

    if (row.status === MIGRATION_STATUS_ENUM.FAILED) {
      return UtilColors.failed;
    }

    if (row.status === MIGRATION_STATUS_ENUM.COMPLETED || row.isAlreadyUpgraded) {
      return UtilColors.done;
    }

    if (row.isMapped) {
      return UtilColors.alice_blue;
    }

    return UtilColors.default;
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
            className={cx(classes.revsTableDateTimeLabel)}
          /> • Started At: <DateTime
            value={row.runDetails[0]?.runAt}
            format={MomentFormats.BriefDateTime}
            className={cx(classes.revsTableDateTimeLabel)}
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
               className={cx(classes.revsTableDateTimeLabel)}
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

  const updateRow = (updatedRow: ISupplierScanResultRev) => {
    row = updatedRow;
  };

  const handleRowSelection = (event, row) => {
    row.isSelected = event.target.checked as boolean;
    handleSelection(event, row);
  };

  const linkHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  return (
    <React.Fragment>
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        selected={isItemSelected}
        style={{ backgroundColor: row.isSelected ? UtilColors.selected : getRowColor(row) }}
      >
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setRowOpen(!rowOpen)}>
            {rowOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell padding="checkbox"
          onClick={(event) => row.status !== MIGRATION_STATUS_ENUM.COMPLETED && handleRowSelection(event, row)}>
          <div className={classes.checkboxRowContent}
            onMouseEnter={handleIconHover}
            onMouseLeave={handlePopoverClose}
          >
            { row.status !== MIGRATION_STATUS_ENUM.COMPLETED && !row.isAlreadyUpgraded && <Checkbox
              checked={isItemSelected}
              inputProps={{ 'aria-labelledby': labelId }}
            /> }
            {
              (row.status === MIGRATION_STATUS_ENUM.COMPLETED || row.isAlreadyUpgraded)
              && <DoneAllIcon className={classes.checkboxRowContentDone} />
            }
            {
              row.status === MIGRATION_STATUS_ENUM.FAILED
              && <ErrorIcon className={classes.checkboxRowContentFailed} />
            }
            {
              row.status === MIGRATION_STATUS_ENUM.IN_PROGRESS
              && <HourglassEmptyIcon className={classes.checkboxRowContentInProgress} />
            }
          </div>
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none">
          <Link
            to={documentVersionPath(row.docRevId, row.documentId)}
            target="_blank"
            className={classes.link}
            onClick={linkHandler}
          >
            {row.docId}
          </Link>
        </TableCell>
        <TableCell align="left">
          <p className={classes.revsTableFlexBoxColumn}>
            <span><b>{row.docRevName}</b></span>
            <span>Rev {row.displayRevision} • {row.displayStatus}</span>
          </p>
        </TableCell>
        <TableCell align="left">
          <ListItemText
            primary={(
              <Typography data-cy="user-name" className={classes.revsTablePrimaryText}>{row.name}</Typography>)}
            secondary={<></>}
          />
          { row.owner?.user && <UserAvatarListItem
            name={<div>{row.owner?.user.name}</div>}
            user={row.owner?.user}
            secondaryComponent={<></>}
          /> }
        </TableCell>
        <TableCell align="left" className={classes.tableCellHiddenOverflow}>
          {row.isMapped ? JSON.stringify(row.fieldNamesUnmatched)
            : <>{
              rowMapping ? <span>Mapping... </span> : <span>NOT MAPPED
                <TrackChangesIcon onClick={e => getPreviewForDocRevRevsTable(scanId, row, updateRow)} className={classes.cursorPointer} /></span>
            }
            </>
          }
        </TableCell>
        <TableCell className={classes.tableCellHiddenOverflow}>{row.proposedAction}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className={classes.zeroTopBottomPadding} colSpan={8}>
          <Collapse in={rowOpen} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Form Input Comparison
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.width50}>Original Form Input</TableCell>
                    <TableCell className={classes.width50}>New Form Input </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className={classes.verticalAlignTableRow}>
                    <TableCell align="left">
                      {row.originalFormInput && <ReactJson src={row.originalFormInput} collapsed={1} /> }
                      {!row.originalFormInput && <span>No FormInput</span> }
                    </TableCell>
                    <TableCell align="left">
                      {row.newFormInput && row.isMapped && <ReactJson src={row.newFormInput} collapsed={1} /> }
                      {!row.newFormInput && <span>No FormInput</span> }
                      {!row.isMapped && <span>NOT MAPPED</span> }
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
  handleSelectedRowsChange: (selected: ISelectedDetails[]) => void
  updateRevsTable: number
}> = ({
  scanId,
  handleSelectedRowsChange,
  updateRevsTable,
}) => {
  const classes = useStyles();
  const [searchQueries, setSearchQueries] = React.useState<{[key: string]: string}>({});
  const [order, setOrder] = React.useState<SortDirection>('desc');
  const [orderBy, setOrderBy] = React.useState('createdAt');
  const [selected, setSelected] = useState<ISelectedDetails[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(INITIAL_ROWS_COUNT);

  const {
    isLoading,
    errorMessage,
    rows,
    totalCount,
    fetchScanSupplierRevisions,
  } = useBulkMigration();

  const [isShowActionableRows, setIsShowActionableRows] = useState<boolean>(true);

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

  useEffect(() => {
    if (scanId) {
      fetchScanSupplierRevisions(scanId, page, rowsPerPage, orderBy, order, isShowActionableRows, searchQueries);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateRevsTable, scanId, searchQueries, page, rowsPerPage, orderBy, order, isShowActionableRows]);

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

  useEffect(() => {
    handleSelectedRowsChange(selected);
  }, [selected.length]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.findIndex(entry => entry.id === id) > -1;

  return (
    <Paper>
      {!isEmpty(errorMessage) && (
        <div className={classes.errMsgStyle}>{errorMessage}</div>
      )}
      <Toolbar
        className={cx(classes.revsTableRoot, classes.revsTableFlexBox, classes.marginBottom8, {
          [classes.revsTableSelectedHighlight]: selected.length > 0,
        })}
      >
        <Typography variant="h6" id="tableTitle" component="div">
            Supplier Revs <RefreshIcon className={classes.revsTableRefreshIcon}
            onClick={e => fetchScanSupplierRevisions(scanId, page, rowsPerPage, orderBy, order, isShowActionableRows, searchQueries)}
          />
          <Typography color="inherit" variant="subtitle1" component="div">
            {selected.length} selected
          </Typography>
        </Typography>

        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={isShowActionableRows}
              onChange={event => setIsShowActionableRows(event.target.checked)}
              color="primary"
              classes= {{
                switchBase: classes.switchBase,
              }}
            />
          }
          label="Actionable Rows"
          className={classes.mappingSwitcher}
          labelPlacement="bottom"
        />

        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Toolbar>
      <div className={classes.revsTableBody}>
        {isLoading && <LinearProgress className={classes.revsTableProgress} data-cy="saving-progress-bar" />}
        <Table
          className={classes.revsTableFixedLayout}
          aria-labelledby="tableTitle"
          size="medium"
          aria-label="Supplier Revs Table"
          stickyHeader
        >
          <EnhancedTableHead
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
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <ExpandableRow row={row} handleSelection={handleSelection}
                  isItemSelected={isItemSelected} labelId={labelId} key={row.docRevId}
                  onIconHovered={(event, content) => handlePopoverOpen(event, content)}
                  handlePopoverClose={handlePopoverClose}
                  scanId={scanId}
                />
              );
            })}
          </TableBody>
        </Table>
        <Popover
          className={classes.noPointerEvents}
          classes={{
            paper: classes.revsTablePopoverPaper,
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
  );
};

export default RevsTable;
