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
import { useRelatedPartsStore } from "./RelatedParts.state";

const ParentPartSelector: React.FunctionComponent<{
  status: RELATED_PARTS_STATUS | undefined;
  parentStatusChanged: (value: string) => void;
}> = ({
  status,
  parentStatusChanged,
}) => {
  const [disable, setDisable] = useState({
    disable1: false,
    disable2: false,
    disable3: false,
  });

  const classes = useStyles();

  useEffect(() => {
    disableOptions(status as string);
  }, [status]);


  const disableOptions = (value: string) => {
    switch (value) {
      case RELATED_PARTS_STATUS.PARENT_NO:
        setDisable({ disable1: false, disable2: true, disable3: true });
        break;
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
    value: string
  ) => {
    disableOptions(value);
    parentStatusChanged(value);
  };

  return (
    <div>
      <div className={classes.title}>
        <Typography
          className={classes.titleHeading}
          variant="h6"
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
      <FormControl className={classes.formControlPad}>
        <RadioGroup row value={status} onChange={(e) => parentStatusHandler(e.target.value)}>
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
}> = ({
  documentRevision,
  createNewDocument,
  viewRelatedPart,
  fetchRelatedParts,
  voidRelatedPart,
}) => {
  const classes = useStyles();
  const { relatedPartsStore } = useRelatedPartsStore();

  const [isEditRowVisible, setIsEditRowVisible] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const showEditRow = () => {
    setIsEditRowVisible(true);
    setShowButton(false);
  };

  useEffect(() => {
    fetchRelatedParts(documentRevision.document.id);
  }, [fetchRelatedParts, documentRevision.document.id]);


  useEffect(() => reaction(
    () => relatedPartsStore.relatedPartsList.length,
    () => {
      setIsEditRowVisible(false);
      setShowButton(true);
    }
  ), [relatedPartsStore.relatedPartsList.length]);

  const cancelEdit = () => {
    setIsEditRowVisible(false);
    setShowButton(true);
  };

  return useObserver(() => (
    <div className={classes.partsGrid}>
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
          rootPartName= {documentRevision.name} />
        {isEditRowVisible && <RelatedPartEditRow documentRevision={documentRevision}
          createNewDocument={createNewDocument} cancelEdit={cancelEdit}/>}
        {
          showButton && <Button
            className={classes.fullLengthButton}
            variant="outlined"
            startIcon={<AddOutlinedIcon />}
            onClick={showEditRow}
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
}> = ({
  voidRelatedPart,
  viewRelatedPart,
  rootPartName,
}) => {
  const { relatedPartsStore } = useRelatedPartsStore();
  const classes = useStyles();
  return useObserver(() => (
    <div className={classes.fullWidth}>
      <Table stickyHeader aria-label="related parts table">
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
          {relatedPartsStore.relatedPartsList.map((listItem: RelatedPartsListItem) => (
            <RelatedPartViewRow listItem={listItem} voidRelatedPart={voidRelatedPart} viewRelatedPart={viewRelatedPart}
              key={listItem.documentRevisionId} rootPartName={rootPartName}/>
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
}> = ({
  listItem,
  voidRelatedPart,
  viewRelatedPart,
  rootPartName,
}) => {
  const classes = useStyles();
  const isVoided = listItem.status === DocumentRevisionStatus.Obsolete
  || listItem.status === DocumentRevisionStatus.Voided;

  const lastIndexOfDash = listItem.rootDocId.lastIndexOf("-");

  return (
    <TableRow hover key={listItem.documentRevisionId}>
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
          disabled={isVoided}
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
}> = ({
  documentRevision,
  createNewDocument,
  cancelEdit,
}) => {
  const [relatedPartDetails, setRelatedPartDetails] = React.useState({
    docId: "",
    name: "",
  });

  const classes = useStyles();
  const { relatedPartsStore } = useRelatedPartsStore();

  const resetAndCancelEdit = () => {
    setRelatedPartDetails({ docId: "", name: "" });
    cancelEdit();
  };

  const confirmEdit = () => {
    createNewDocument(relatedPartDetails);
  };

  const checkForDuplicateDocIds = () => {
    relatedPartsStore.checkForDuplicateDocIds(`${documentRevision?.document?.docId}-${relatedPartDetails.docId}`);
  };

  return useObserver(() => (
    <>
      <div className={cx(classes.editRowParentDiv, {
        [classes.editRowParentNormal]: !relatedPartsStore.docIdExists,
        [classes.editRowParentError]: relatedPartsStore.docIdExists,
      })}>
        <div className={classes.editRowChildDivOne}>
          <label >{documentRevision?.document?.docId} - </label>
          <TextField
            className={classes.textField}
            variant="outlined"
            onChange = {(e: ChangeEvent<HTMLInputElement>) =>
              setRelatedPartDetails({ ...relatedPartDetails, docId: e.target.value })}
            onBlur = {checkForDuplicateDocIds}
            value={relatedPartDetails.docId}
            error = {relatedPartsStore.docIdExists}
            helperText={relatedPartsStore.docIdExists ? <Text translation="relatedParts.docId.exists.msg"/> : ""}
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
              setRelatedPartDetails({ ...relatedPartDetails, name: e.target.value })}/>
        </div>
      </div>
      {!relatedPartsStore.docIdExists &&
        <div className={classes.actionButtonParentDiv}>
          <div className={classes.actionButtonChildDiv}>
            <Button className={classes.actionButton} onClick = {resetAndCancelEdit}>
              <ClearIcon className={classes.iconButton}/>
            </Button>
            <Button className={classes.actionButton} onClick = {confirmEdit}>
              <DoneIcon className={classes.iconButton} />
            </Button>
          </div>
        </div>
      }
    </>
  ));
};


const RelatedParts = ({
  documentRevision,
  parentStatus,
  parentStatusChanged,
  createNewDocument,
  viewRelatedPart,
  fetchRelatedParts,
  voidRelatedPart,
}) => {

  const classes = useStyles();

  return (
    <>
      {documentRevision.relatedStatus !== RELATED_PARTS_STATUS.RELATED_SEPARATE &&
      documentRevision.relatedStatus !== RELATED_PARTS_STATUS.RELATED_TOGETHER &&
      <div className={classes.mainDiv}>
        <ParentPartSelector status={parentStatus}  parentStatusChanged={parentStatusChanged} />
        {parentStatus === RELATED_PARTS_STATUS.PARENT_SEPARATE && (
          <Grid item xs={12}>
            <FBButton label={<Text translation="relatedParts.button.addText"/>}
              onClick = {createNewDocument}></FBButton>
          </Grid>
        )}
        {parentStatus === RELATED_PARTS_STATUS.PARENT_TOGETHER && (
          <RelatedPartGrid documentRevision={documentRevision} createNewDocument={createNewDocument}
            viewRelatedPart={viewRelatedPart} fetchRelatedParts = {fetchRelatedParts}
            voidRelatedPart = {voidRelatedPart}
          />
        )}
      </div>}
    </>
  );
};

export default RelatedParts;
