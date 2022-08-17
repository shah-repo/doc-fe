/* eslint-disable no-console */
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
import { relatedPartsActions } from "../../../../../state/ducks/relatedParts";
import { RelatedPartsListItem, RELATED_STATUS } from "../../../../../state/ducks/relatedParts/types";
import { FBButton } from "../../../../form.builder";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";


import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import InfoIcon from "@material-ui/icons/Info";
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";

import { styles } from "./RelatedPart.styles";

const ParentPartSelector: React.FunctionComponent<{
  status: RELATED_STATUS | undefined;
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

  const classes = styles();

  useEffect(() => {
    disableOptions(status as string);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const disableOptions = (value: string) => {
    switch (value) {
      case RELATED_STATUS.PARENT_NO:
        setDisable({ disable1: false, disable2: true, disable3: true });
        break;
      case RELATED_STATUS.PARENT_TOGETHER:
        setDisable({ disable1: true, disable2: false, disable3: true });
        break;
      case RELATED_STATUS.PARENT_SEPARATE:
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
          Is this a parent part?
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
            value={RELATED_STATUS.PARENT_NO}
            control={<Radio color="primary" disableRipple={true} />}
            label="No"
            disabled={disable.disable1}
          />
          <FormControlLabel
            value={RELATED_STATUS.PARENT_TOGETHER}
            control={<Radio color="primary" disableRipple={true} />}
            label="Yes, Child Released Together"
            disabled={disable.disable2}
          />
          <FormControlLabel
            value={RELATED_STATUS.PARENT_SEPARATE}
            control={<Radio color="primary" disableRipple={true} />}
            label="Yes, Child Released Separately"
            disabled={disable.disable3}
          />
        </RadioGroup>
      </FormControl>
    </div>
  );

};


const RelatedPartGrid: React.FunctionComponent<{
  newRelatedPart?: RelatedPartsListItem;
  documentRevision: DocumentRevision;
  createNewDocument: (details? : {docId: string; name: string}) => void;
  viewRelatedPart: (docRevId: string, documentId: string) => void;
}> = ({
  newRelatedPart,
  documentRevision,
  createNewDocument,
  viewRelatedPart,
}) => {
  const classes = styles();

  const [isEditRowVisible, setIsEditRowVisible] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [relatedPartsList, setRelatedPartsList] = useState<RelatedPartsListItem[]>([]);

  const fetchAllRelatedPartsAction = useActionCreator(relatedPartsActions.fetchAllRelatedParts);
  const fetchRelatedPartsAsync = useAsync({
    onSuccess: (relatedPartsList) => {
      // console.log(relatedPartsList);
      setRelatedPartsList(relatedPartsList as RelatedPartsListItem[]);
    },
  });

  const voidRelatedPartAction = useActionCreator(relatedPartsActions.voidRelatedPart);
  const voidRelatedPartAsync = useAsync({
    onSuccess: ({ docRevId, name }: any) => {
      setRelatedPartsList(
        relatedPartsList.map(
          (item) => {
            if (item.documentRevisionId === docRevId) {
              item.status = DocumentRevisionStatus.Voided;
              item.name = name;
            }
            return item;
          }
        ));
    },
  });

  const showEditRow = () => {
    setIsEditRowVisible(true);
    setShowButton(false);
  };

  useEffect(() => {
    fetchRelatedPartsAsync.start(fetchAllRelatedPartsAction, documentRevision.document.id, fetchRelatedPartsAsync);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (newRelatedPart && newRelatedPart.documentId) {
      setRelatedPartsList([...relatedPartsList, newRelatedPart]);
      setIsEditRowVisible(false);
      setShowButton(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRelatedPart]);

  const cancelEdit = () => {
    setIsEditRowVisible(false);
    setShowButton(true);
  };

  const voidRelatedPart = (listItem: RelatedPartsListItem) => {
    // console.log(listItem);
    voidRelatedPartAsync.start(voidRelatedPartAction, listItem.documentRevisionId, voidRelatedPartAsync);
  };

  return (
    <div className={classes.partsGrid}>
      <div>
        <Grid style={{ justifyContent: "space-between", alignItems: "center" }} container>
          <Grid item>
            <Typography variant="h6" id="tableTitle" component="div">
                Related Parts
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
                    Add Related part
                  </Button>
                </Typography>
              </Grid>
          }
        </Grid>
        <Divider className={classes.dividerStyle} />
      </div>
      <div>
        <RelatedPartList list={relatedPartsList} voidRelatedPart = {voidRelatedPart}
          viewRelatedPart={viewRelatedPart}></RelatedPartList>
        {isEditRowVisible && <RelatedPartEditRow documentRevision={documentRevision}
          createNewDocument={createNewDocument} cancelEdit={cancelEdit}/>}
        {
          showButton && <Button
            className={classes.fullLengthButton}
            variant="outlined"
            startIcon={<AddOutlinedIcon />}
            onClick={showEditRow}
          >
              ADD RELATED PART
          </Button>
        }
      </div>
    </div>
  );
};


const RelatedPartList: React.FunctionComponent<{
  list: RelatedPartsListItem[];
  voidRelatedPart: (listItem: RelatedPartsListItem) => void;
  viewRelatedPart: (docRevId: string, documentId: string) => void;
}> = ({
  list,
  voidRelatedPart,
  viewRelatedPart,
}) => {
  const classes = styles();
  return (
    <div className={classes.fullWidth}>
      <Table stickyHeader aria-label="related parts table">
        <TableHead className={classes.tableHeadHeight}>
          <TableRow>
            <TableCell className={cx(classes.tabelCell, classes.tableCellOne)} align="left">DOC ID</TableCell>
            <TableCell className={classes.tabelCell} align="left">
              <span className={classes.verticalDivider}>TITLE</span>
            </TableCell>
            <TableCell className={cx(classes.tabelCell, classes.tableCellThree)} align="center">
              <span className={classes.verticalDivider}>OBSOLETE</span>
            </TableCell>
            <TableCell className={cx(classes.tabelCell, classes.tableCellFour)} align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((listItem: RelatedPartsListItem) => (
            <RelatedPartViewRow listItem={listItem} voidRelatedPart={voidRelatedPart} viewRelatedPart={viewRelatedPart}
              key={listItem.documentRevisionId}/>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};


const RelatedPartViewRow: React.FunctionComponent<{
  listItem: RelatedPartsListItem;
  voidRelatedPart: (listItem: RelatedPartsListItem) => void;
  viewRelatedPart: (docRevId: string, documentId: string) => void;
}> = ({
  listItem,
  voidRelatedPart,
  viewRelatedPart,
}) => {
  const classes = styles();
  const isVoided = listItem.status === DocumentRevisionStatus.Obsolete
  || listItem.status === DocumentRevisionStatus.Voided;
  return (
    <TableRow hover key={listItem.documentRevisionId}>
      <TableCell align="left">
        {listItem.rootDocId}
      </TableCell>
      <TableCell align="left">
        {listItem.name}
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
  // const [inputValue, setInputValue] = useState<any[]>([]);

  // const readingValueHandler = (event: React.FocusEvent<HTMLInputElement>) => {
  //   setInputValue((prevInputValue) => [...prevInputValue, event.target.name]);
  // };

  const classes = styles();

  const resetAndCancelEdit = () => {
    setRelatedPartDetails({ docId: "", name: "" });
    cancelEdit();
  };

  return (
    <>
      <div className={classes.editRowParentDiv}>
        <div className={classes.editRowChildDivOne}>
          <label >{documentRevision?.document?.docId} - </label>
          <TextField
            className={classes.textField}
            variant="outlined"
            onChange = {(e: ChangeEvent<HTMLInputElement>) =>
              setRelatedPartDetails({ ...relatedPartDetails, docId: e.target.value })}
            value={relatedPartDetails.docId}
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
      <div className={classes.actionButtonParentDiv}>
        <div className={classes.actionButtonChildDiv}>
          <Button className={classes.actionButton} onClick = {resetAndCancelEdit}>
            <ClearIcon className={classes.iconButton}/>
          </Button>
          <Button className={classes.actionButton} onClick = {(e) => createNewDocument(relatedPartDetails)}>
            <DoneIcon className={classes.iconButton} />
          </Button>
        </div>
      </div>
    </>
  );
};


const RelatedParts = ({
  documentRevision,
  parentStatus,
  parentStatusChanged,
  createNewDocument,
  newRelatedPart,
  viewRelatedPart,
}) => {

  const classes = styles();

  return (
    <>
      {documentRevision.relatedStatus !== RELATED_STATUS.RELATED_SEPARATE &&
      documentRevision.relatedStatus !== RELATED_STATUS.RELATED_TOGETHER &&
      <div className={classes.mainDiv}>
        <ParentPartSelector status={parentStatus}  parentStatusChanged={parentStatusChanged} />
        {parentStatus === RELATED_STATUS.PARENT_SEPARATE && (
          <Grid item xs={12}>
            <FBButton label="Add Related Part" onClick = {createNewDocument}></FBButton>
          </Grid>
        )}
        {parentStatus === RELATED_STATUS.PARENT_TOGETHER && (
          <RelatedPartGrid documentRevision={documentRevision} createNewDocument={createNewDocument}
            newRelatedPart = {newRelatedPart} viewRelatedPart={viewRelatedPart}
          />
        )}
      </div>}
    </>
  );
};

export default RelatedParts;
