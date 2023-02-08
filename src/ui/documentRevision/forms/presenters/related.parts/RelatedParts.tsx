import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid, Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";

import cx from "classnames";
import React, { ChangeEvent, useEffect, useState } from "react";
import { DocumentRevision, DocumentRevisionStatus } from "../../../../../state/ducks/documentRevisions/types";
import { RelatedPartsListItem, RELATED_PARTS_STATUS } from "../../../../../state/ducks/relatedParts/types";
import { FBButton } from "../../../../form.builder";


import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import InfoIcon from "@material-ui/icons/Info";
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";

import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import Text from "../../../../components/Text";
import useStyles from "./RelatedPart.styles";
import RelatedPartsState from "./RelatedParts.state";


const ParentPartSelector: React.FunctionComponent<{
  status: RELATED_PARTS_STATUS;
  parentStatusChanged: (value: string) => void;
  relatedPartsState: RelatedPartsState;
}> = ({
  status,
  parentStatusChanged,
  relatedPartsState,
}) => {
  const [disable, setDisable] = useState({
    disable1: false,
    disable2: false,
    disable3: false,
  });

  const classes = useStyles();

  useEffect(() => {
    disableOptions(status);
  }, [status]);


  const disableOptions = (value: RELATED_PARTS_STATUS) => {
    switch (value) {
      // case RELATED_PARTS_STATUS.PARENT_NO:
      //   setDisable({ disable1: false, disable2: true, disable3: true });
      //   break;
      case RELATED_PARTS_STATUS.PARENT_TOGETHER:
        setDisable({ disable1: true, disable2: false, disable3: true });
        break;
      case RELATED_PARTS_STATUS.PARENT_SEPARATE:
        setDisable({ disable1: true, disable2: true, disable3: false });
        break;
      default:
        break;
    }
  };

  const parentStatusHandler = (
    value: RELATED_PARTS_STATUS
  ) => {
    if (relatedPartsState.viewOnlyMode) {
      return false;
    }

    disableOptions(value);
    parentStatusChanged(value);
  };

  return (
    <div>
      <div className={classes.title}>
        <Typography
          className={cx(classes.titleHeading, {
            [classes.smallText]: relatedPartsState.viewOnlyMode,
          })}
          variant="body1"
          id="tableTitle"
        >
          <Text translation="relatedParts.parentPart.question"/>
        </Typography>
        <Tooltip title="Parent part info" placement="right"
          classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }}
          arrow>
          <InfoIcon color="primary" />
        </Tooltip>
      </div>
      <FormControl className={cx({
        [classes.smallText]: relatedPartsState.viewOnlyMode,
      })}>
        <RadioGroup row value={status} onChange={(e) => parentStatusHandler(e.target.value as RELATED_PARTS_STATUS)}
          id="partTypeSelector"
        >
          <FormControlLabel
            value={RELATED_PARTS_STATUS.PARENT_NO}
            control={<Radio color="primary" disableRipple={true} />}
            label={<Text translation="relatedParts.parentPart.answer.no"/>}
            disabled={disable.disable1}
          />
          <FormControlLabel
            value={RELATED_PARTS_STATUS.PARENT_TOGETHER}
            control={<Radio color="primary" disableRipple={true} />}
            label={<Text translation="relatedParts.parentPart.answer.yes.together"/>}
            disabled={disable.disable2}
          />
          <FormControlLabel
            value={RELATED_PARTS_STATUS.PARENT_SEPARATE}
            control={<Radio color="primary" disableRipple={true} />}
            label={<Text translation="relatedParts.parentPart.answer.yes.separate"/>}
            disabled={disable.disable3}
          />
        </RadioGroup>
      </FormControl>
    </div>
  );

};


const RelatedPartGrid: React.FunctionComponent<{
  documentRevision: DocumentRevision;
  createNewDocument: (details? : {docId: string; name: string}) => void;
  viewRelatedPart: (docRevId: string, documentId: string) => void;
  fetchRelatedParts;
  voidRelatedPart;
  relatedPartsState: RelatedPartsState;
}> = ({
  documentRevision,
  createNewDocument,
  viewRelatedPart,
  fetchRelatedParts,
  voidRelatedPart,
  relatedPartsState,
}) => {
  const classes = useStyles();

  const [isEditRowVisible, setIsEditRowVisible] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const showEditRow = () => {
    setIsEditRowVisible(true);
    setShowButton(false);
  };

  useEffect(() => {
    fetchRelatedParts(documentRevision.id);
    setShowButton(!relatedPartsState.viewOnlyMode);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentRevision.id, relatedPartsState.viewOnlyMode]);

  useEffect(() => reaction(
    () => relatedPartsState.relatedPartsList.length,
    () => {
      setIsEditRowVisible(false);
      setShowButton(true && !relatedPartsState.viewOnlyMode);
    }
  ), [relatedPartsState.relatedPartsList.length, relatedPartsState.viewOnlyMode]);

  const cancelEdit = () => {
    setIsEditRowVisible(false);
    setShowButton(true);
  };

  return useObserver(() => (
    <div className={classes.partsGrid}
      data-cy="partsGrid">
      <div>
        <Grid className={classes.gridCenterAlign} container>
          <Grid item>
            <Typography variant="h6" id="tableTitle" component="div">
              <Text translation="relatedParts.grid.title"/>
            </Typography>
          </Grid>

          { showButton &&
              <Grid item>
                <Typography>
                  <Button
                    className={classes.btnMargin}
                    color="primary"
                    startIcon={<AddCircleIcon color="primary" />}
                    onClick={showEditRow}
                    data-cy="add-related-part-btn"
                  >
                    <Text translation="relatedParts.button.addText"/>
                  </Button>
                </Typography>
              </Grid>
          }
        </Grid>
        <Divider className={classes.dividerStyle} />
      </div>
      <div>
        <RelatedPartList
          voidRelatedPart = {voidRelatedPart}
          viewRelatedPart={viewRelatedPart}
          rootPartName= {documentRevision.name}
          relatedPartsState = {relatedPartsState} />
        {isEditRowVisible && <RelatedPartEditRow documentRevision={documentRevision}
          createNewDocument={createNewDocument} cancelEdit={cancelEdit} relatedPartsState={relatedPartsState}/>}
        {
          showButton && <Button
            className={classes.fullLengthButton}
            variant="outlined"
            startIcon={<AddOutlinedIcon />}
            onClick={showEditRow}
            data-cy="add-related-part-btn"
          >
            <Text translation="relatedParts.button.addText"/>
          </Button>
        }
      </div>
    </div>
  ));
};


const RelatedPartList: React.FunctionComponent<{
  voidRelatedPart: (listItem: RelatedPartsListItem) => void;
  viewRelatedPart: (docRevId: string, documentId: string) => void;
  rootPartName: string;
  relatedPartsState: RelatedPartsState;
}> = ({
  voidRelatedPart,
  viewRelatedPart,
  rootPartName,
  relatedPartsState,
}) => {
  const classes = useStyles();
  return useObserver(() => (
    <div className={classes.fullWidth}>
      <Table aria-label="related parts table" data-cy="related-parts-table">
        <TableHead className={classes.tableHeadHeight}>
          <TableRow>
            <TableCell className={cx(classes.tableCell, classes.tableCellOne)} align="left">
              <Text translation="relatedParts.grid.heading.docId"/>
            </TableCell>
            <TableCell className={classes.tableCell} align="left">
              <span className={classes.verticalDivider}>
                <Text translation="relatedParts.grid.heading.title"/>
              </span>
            </TableCell>
            <TableCell className={cx(classes.tableCell, classes.tableCellThree)} align="center">
              <span className={classes.verticalDivider}>
                <Text translation="relatedParts.grid.heading.obsolete"/>
              </span>
            </TableCell>
            <TableCell className={cx(classes.tableCell, classes.tableCellFour)} align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {relatedPartsState.relatedPartsList.map((listItem: RelatedPartsListItem) => (
            <RelatedPartViewRow listItem={listItem} voidRelatedPart={voidRelatedPart} viewRelatedPart={viewRelatedPart}
              key={listItem.documentRevisionId} rootPartName={rootPartName} relatedPartsState={relatedPartsState}/>
          ))}
        </TableBody>
      </Table>
    </div>
  ));
};


const RelatedPartViewRow: React.FunctionComponent<{
  listItem: RelatedPartsListItem;
  voidRelatedPart: (listItem: RelatedPartsListItem) => void;
  viewRelatedPart: (docRevId: string, documentId: string) => void;
  rootPartName: string;
  relatedPartsState: RelatedPartsState;
}> = ({
  listItem,
  voidRelatedPart,
  viewRelatedPart,
  rootPartName,
  relatedPartsState,
}) => {
  const classes = useStyles();
  const isVoided = listItem.status === DocumentRevisionStatus.Obsolete
  || listItem.status === DocumentRevisionStatus.Voided;

  const lastIndexOfDash = listItem.rootDocId.lastIndexOf("-");

  return (
    <TableRow hover key={listItem.documentRevisionId}
      data-cy="relatedPartsViewRow"
    >
      <TableCell align="left">
        {listItem.rootDocId.slice(0, lastIndexOfDash)} - <b>{listItem.rootDocId.substring(lastIndexOfDash + 1)}</b>
      </TableCell>
      <TableCell align="left">
        {isVoided && <span>{listItem.name}</span>}
        {!isVoided && <span>{rootPartName} - <b>{listItem.suffixName}</b></span>}
      </TableCell>
      <TableCell align="center">
        <Checkbox
          checked={isVoided}
          disabled={isVoided || relatedPartsState.viewOnlyMode}
          onChange={(e) => voidRelatedPart(listItem)}
        />
      </TableCell>
      <TableCell align="center">
        <RemoveRedEyeIcon color="primary"
          className={classes.viewIcon}
          onClick={(e) => viewRelatedPart(listItem.documentRevisionId, listItem.documentId)}></RemoveRedEyeIcon>
      </TableCell>
    </TableRow>
  );
};

const RelatedPartEditRow: React.FunctionComponent<{
  documentRevision: DocumentRevision;
  createNewDocument: (details? : {docId: string; name: string}) => void;
  cancelEdit: () => void;
  relatedPartsState: RelatedPartsState;
}> = ({
  documentRevision,
  createNewDocument,
  cancelEdit,
  relatedPartsState,
}) => {
  const [relatedPartDetails, setRelatedPartDetails] = React.useState({
    docId: "",
    name: "",
  });

  const classes = useStyles();

  const resetAndCancelEdit = () => {
    setRelatedPartDetails({ docId: "", name: "" });
    cancelEdit();
  };

  const confirmEdit = () => {
    if (validateDocId()) {
      createNewDocument(relatedPartDetails);
    }
  };

  const validateDocId = () => (
    relatedPartsState.validateDocId(documentRevision?.document?.docId, relatedPartDetails.docId)
  );

  return useObserver(() => (
    <>
      <div className={cx(classes.editRowParentDiv, {
        [classes.editRowParentNormal]: !relatedPartsState.docIdErrorMsg,
        [classes.editRowParentError]: Boolean(relatedPartsState.docIdErrorMsg),
      })}
      data-cy="relatedPartsEditRow"
      >
        <div className={classes.editRowChildDivOne}>
          <label >{documentRevision?.document?.docId} - </label>
          <TextField
            className={classes.textField}
            variant="outlined"
            onChange = {(e: ChangeEvent<HTMLInputElement>) =>
              setRelatedPartDetails({ ...relatedPartDetails, docId: e.target.value })}
            onBlur = {validateDocId}
            value={relatedPartDetails.docId}
            error = {Boolean(relatedPartsState.docIdErrorMsg)}
            helperText={relatedPartsState.docIdErrorMsg ? <Text message={relatedPartsState.docIdErrorMsg}/> : ""}
            name="relatedPartDocId"
          />
        </div>
        <div
          className={classes.editRowChildDivTwo}>
          <label>{documentRevision?.name} - </label>
          <TextField
            className={classes.textField}
            variant="outlined"
            value = {relatedPartDetails.name}
            onChange = {(e: ChangeEvent<HTMLInputElement>) =>
              setRelatedPartDetails({ ...relatedPartDetails, name: e.target.value })}
            name="relatedPartTitle"
          />
        </div>
      </div>
      <div className={classes.actionButtonParentDiv}>
        <div className={classes.actionButtonChildDiv}>
          <Button
            data-cy="cancelRelatedPartChildAddition"
            className={classes.actionButton} onClick = {resetAndCancelEdit}>
            <ClearIcon className={classes.iconButton}/>
          </Button>
          { !relatedPartsState.docIdErrorMsg &&
          <Button
            data-cy="confirmRelatedPartChildAddition"
            className={classes.actionButton} onClick = {confirmEdit}>
            <DoneIcon className={classes.iconButton} />
          </Button>
          }
        </div>
      </div>
    </>
  ));
};


const RelatedParts: React.FunctionComponent<{
  documentRevision: DocumentRevision;
  parentStatus?: RELATED_PARTS_STATUS;
  parentStatusChanged: (value: any) => void;
  createNewDocument: (relatedPartDetails?: any) => void;
  viewRelatedPart: (docRevId: string, documentId: string) => void;
  fetchRelatedParts: (documentId: any) => void;
  voidRelatedPart: (listItem: RelatedPartsListItem) => void;
  relatedPartsState: RelatedPartsState;
}> = ({
  documentRevision,
  parentStatus = RELATED_PARTS_STATUS.PARENT_NO,
  parentStatusChanged,
  createNewDocument,
  viewRelatedPart,
  fetchRelatedParts,
  voidRelatedPart,
  relatedPartsState,
}) => {

  const classes = useStyles();

  const isRelatedPartsParent = ![RELATED_PARTS_STATUS.RELATED_SEPARATE,
    RELATED_PARTS_STATUS.RELATED_TOGETHER].includes(parentStatus);

  return (
    <>
      {isRelatedPartsParent &&
      <div className={classes.mainDiv}>
        <ParentPartSelector status={parentStatus}  parentStatusChanged={parentStatusChanged}
          relatedPartsState={relatedPartsState}/>
        {parentStatus === RELATED_PARTS_STATUS.PARENT_SEPARATE && !relatedPartsState.viewOnlyMode && (
          <Grid item xs={12}>
            <FBButton label="relatedParts.button.addText"
              dataCy="parentSeparate-addRelatedPartsBtn"
              onClick = {createNewDocument} />
          </Grid>
        )}
        {parentStatus === RELATED_PARTS_STATUS.PARENT_TOGETHER && (
          <RelatedPartGrid documentRevision={documentRevision} createNewDocument={createNewDocument}
            viewRelatedPart={viewRelatedPart} fetchRelatedParts = {fetchRelatedParts}
            voidRelatedPart = {voidRelatedPart} relatedPartsState = {relatedPartsState}
          />
        )}
      </div>}
    </>
  );
};

export default RelatedParts;
