import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid, Radio,
  RadioGroup, TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";

import cx from "classnames";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { DocumentRevision, DocumentRevisionStatus, RevisionChangeType } from "../../../../../state/ducks/documentRevisions/types";
import { ListItemEdited, RelatedPartsListItem, RELATED_PARTS_STATUS } from "../../../../../state/ducks/relatedParts/types";
import { FBButton } from "../../../../form.builder";


import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import InfoIcon from "@material-ui/icons/Info";
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";

import { ReactComponent as DeleteIcon } from "../../../../../assets/images/trash-can 2.svg";

import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import AlertDialog from "../../../../app/alert.dialog/AlertDialog";
import Text from "../../../../components/Text";
import useDialog from "../../../../hooks/useDialog";
import { isDocumentRevisionReleased } from "../../../helpers/documentRevisionStatus";
import useStyles from "./RelatedPart.styles";
import RelatedPartsState from "./RelatedParts.state";
import RelatedPartsTableHeader from "./RelatedPartsTableHeader";


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
  handleRemove: (docRevId: string) => void;
  handleUpdate: (docRevId: string, suffixNumber: string, suffixName: string) => void;
  fetchRelatedParts;
  voidRelatedPart;
  relatedPartsState: RelatedPartsState;
}> = ({
  documentRevision,
  createNewDocument,
  viewRelatedPart,
  handleRemove,
  handleUpdate,
  fetchRelatedParts,
  voidRelatedPart,
  relatedPartsState,
}) => {
  const classes = useStyles();

  const [isEditRowVisible, setIsEditRowVisible] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const { status } = documentRevision;

  const isReleased = isDocumentRevisionReleased(status);

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

  const setActivePartsFilter = (state: boolean) => () => relatedPartsState.setShowOnlyActiveSubParts(state);

  return useObserver(() => (
    <div className={classes.partsGrid}
      data-cy="parts-grid">
      <div>
        <Grid className={classes.gridCenterAlign} container>
          <Grid item>
            <Typography variant="h6" id="tableTitle" component="div">
              <Text translation="relatedParts.grid.title"/>
            </Typography>
          </Grid>

          { (showButton || isReleased) &&
              <Grid item className={classes.buttonGroup}>
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
                <div className={classes.filterOptions}>
                  <span>
                    <Text translation="relatedParts.text.show" />{":"}&nbsp;
                  </span>
                  <span className={cx(relatedPartsState.showOnlyActiveSubParts
                    ? classes.normalFontWeight : classes.boldFontWeight)}
                  onClick={setActivePartsFilter(false)}
                  >
                    <Text translation="common.all" />
                  </span>
                  <span> {" | "} </span>
                  <span className={cx(relatedPartsState.showOnlyActiveSubParts
                    ? classes.boldFontWeight : classes.normalFontWeight)}
                  onClick={setActivePartsFilter(true)}
                  >
                    <Text translation="common.active" />
                  </span>
                </div>
              </Grid>
          }
        </Grid>
        <Divider className={classes.dividerStyle} />
      </div>
      <div>
        <RelatedPartList documentRevision={documentRevision}
          voidRelatedPart={voidRelatedPart}
          viewRelatedPart={viewRelatedPart}
          handleRemove={handleRemove}
          handleUpdate={handleUpdate}
          rootPartName= {documentRevision.name}
          rootRevisionChangeType = {documentRevision.revisionChangeType}
          relatedPartsState = {relatedPartsState} />

        {isEditRowVisible &&
          <RelatedPartEditRow documentRevision={documentRevision}
            createNewDocument={createNewDocument}
            cancelEdit={cancelEdit}
            relatedPartsState={relatedPartsState}
          />
        }
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
  voidRelatedPart: (listItem: RelatedPartsListItem, revisionChangeType: RevisionChangeType) => void;
  viewRelatedPart: (docRevId: string, documentId: string) => void;
  handleRemove: (docRevId: string) => void;
  handleUpdate: (docRevId: string, suffixNumber: string, suffixName: string) => void;
  rootPartName: string;
  rootRevisionChangeType: RevisionChangeType;
  relatedPartsState: RelatedPartsState;
  documentRevision: DocumentRevision;
}> = ({
  voidRelatedPart,
  viewRelatedPart,
  handleRemove,
  handleUpdate,
  rootPartName,
  rootRevisionChangeType,
  relatedPartsState,
  documentRevision,
}) => {
  const classes = useStyles();

  const editRelatedPart = (listItem: RelatedPartsListItem) => {
    relatedPartsState.setListItemBeingEdited(listItem);
  };

  const cancelLocalEdit = () => {
    relatedPartsState.clearListItemBeingEdited();
  };

  return useObserver(() => (
    <div className={classes.fullWidth}>
      <div aria-label="related parts table">
        <RelatedPartsTableHeader />
        <div>
          {relatedPartsState.relatedSubParts.map((listItem: RelatedPartsListItem) => (
            <>
              {
                relatedPartsState.listItemBeingEdited.docRevId === listItem.documentRevisionId ?
                  <RelatedPartEditRow
                    documentRevision={documentRevision}
                    cancelEdit={cancelLocalEdit}
                    handleRemove={handleRemove}
                    handleUpdate={handleUpdate}
                    relatedPartsState={relatedPartsState}
                    listItemBeingEdited={relatedPartsState.listItemBeingEdited}
                  /> :
                  <RelatedPartViewRow listItem={listItem}
                    editRelatedPart={editRelatedPart}
                    voidRelatedPart={voidRelatedPart}
                    viewRelatedPart={viewRelatedPart}
                    key={listItem.documentRevisionId} rootPartName={rootPartName}
                    rootRevisionChangeType={rootRevisionChangeType} relatedPartsState={relatedPartsState}
                  />
              }
            </>
          ))}
        </div>
      </div>
    </div>
  ));
};


const RelatedPartViewRow: React.FunctionComponent<{
  listItem: RelatedPartsListItem;
  voidRelatedPart: (listItem: RelatedPartsListItem, revisionChangeType: RevisionChangeType) => void;
  editRelatedPart: (listItem: RelatedPartsListItem) => void;
  viewRelatedPart: (docRevId: string, documentId: string) => void;
  rootPartName: string;
  rootRevisionChangeType: RevisionChangeType;
  relatedPartsState: RelatedPartsState;
}> = ({
  listItem,
  voidRelatedPart,
  editRelatedPart,
  viewRelatedPart,
  rootPartName,
  rootRevisionChangeType,
  relatedPartsState,
}) => {
  const classes = useStyles();
  const isVoided = listItem.status === DocumentRevisionStatus.Obsolete
  || listItem.status === DocumentRevisionStatus.Voided;

  const isRevChangeTypeObs = listItem.revisionChangeType === RevisionChangeType.Obsolete;
  const isStatusObsolete = listItem.status === DocumentRevisionStatus.Obsolete;

  const lastIndexOfDash = listItem.rootDocId.lastIndexOf("-");

  const confirmationDialog = useDialog();

  const openConfirmDialog = () => {
    confirmationDialog.open();
  };

  const confirmAction = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    voidRelatedPart(listItem, isRevChangeTypeObs ? rootRevisionChangeType : RevisionChangeType.Obsolete);
    confirmationDialog.close();
  };

  const cancelAction = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    confirmationDialog.close();
  };

  const titleCellRef = useRef<HTMLSpanElement>(null);
  const { scrollHeight, clientHeight } = (titleCellRef?.current ? titleCellRef?.current : {}) as HTMLSpanElement;
  return (
    <div key={listItem.documentRevisionId}
      onClick={() => editRelatedPart(listItem)}
      className={cx(classes.itemRow, {
        [classes.voidedBackground]: isVoided,
      })}
      data-cy="related-parts-view-row"
    >
      <div className={cx(classes.tableCellOne, classes.relatedPartViewRowCell)}>
        {listItem.rootDocId.slice(0, lastIndexOfDash)} - <b>{listItem.rootDocId.substring(lastIndexOfDash + 1)}</b>
      </div>
      <div className={cx(classes.tableCellTwo, classes.relatedPartViewRowCell)}>
        <Tooltip title={
          <span>
            {isVoided ? listItem.name :
              <>{rootPartName} {listItem.suffixName && "-"} <b>{listItem.suffixName}</b></>}
          </span>
        }
        disableHoverListener={!(scrollHeight > clientHeight)}
        placement="bottom"
        classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }}
        arrow >
          <span ref={titleCellRef} className={classes.relatedPartViewRowTitleCell}>
            {isVoided ? listItem.name :
              <>{rootPartName} {listItem.suffixName && "-"} <b>{listItem.suffixName}</b></>}
          </span>
        </Tooltip>
      </div>
      <div className={classes.tableCellThree} data-cy="obsolete-checkbox">
        { listItem.version && listItem.version > 1 &&
          <>
            {
              isStatusObsolete ?
                <span className={classes.OBS}>OBS</span>
                :
                <Checkbox
                  checked = {isVoided || isRevChangeTypeObs}
                  disabled={relatedPartsState.viewOnlyMode}
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    e.stopPropagation();
                    openConfirmDialog();
                  }}
                />
            }
            {confirmationDialog.isOpen && (
              <AlertDialog
                dialog={confirmationDialog}
                confirmAction={confirmAction}
                cancelAction={cancelAction}
                message={isRevChangeTypeObs ? "relatedParts.void.bringBack" : "relatedParts.void.alert"}
              />
            )}
          </>
        }
      </div>
      <div className={cx(classes.tableCellFour, classes.relatedPartEyeRowCell)} data-cy="view-icon">
        <RemoveRedEyeIcon color="primary"
          className={classes.viewIcon}
          onClick={(e: React.MouseEvent<SVGElement>) => {
            e.stopPropagation();
            viewRelatedPart(listItem.documentRevisionId, listItem.documentId);
          }}></RemoveRedEyeIcon>
      </div>
    </div>
  );
};

const RelatedPartEditRow: React.FunctionComponent<{
  documentRevision: DocumentRevision;
  listItemBeingEdited?: ListItemEdited;
  createNewDocument?: (details? : {docId: string; name: string}) => void;
  cancelEdit: () => void;
  handleRemove?: (docRevId: string) => void;
  handleUpdate?: (docRevId: string, suffixNumber: string, suffixName: string) => void;
  relatedPartsState: RelatedPartsState;

}> = ({
  documentRevision,
  listItemBeingEdited,
  createNewDocument,
  cancelEdit,
  handleRemove,
  handleUpdate,
  relatedPartsState,
}) => {
  const [relatedPartDetails, setRelatedPartDetails] = React.useState({
    docId: listItemBeingEdited?.docId ?? "",
    name: listItemBeingEdited?.name ?? "",
  });

  const classes = useStyles();

  const showDeleteButton = listItemBeingEdited?.version === 1 && listItemBeingEdited?.docRevId !== "";

  const resetAndCancelEdit = () => {
    setRelatedPartDetails({ docId: "", name: "" });
    cancelEdit();
  };

  const confirmEdit = () => {
    if (listItemBeingEdited?.docRevId && handleUpdate) {
      if (validateDocId(relatedPartDetails.docId)) {
        handleUpdate(listItemBeingEdited?.docRevId, relatedPartDetails.docId, relatedPartDetails.name);
      }
    } else {
      if (validateDocId() && createNewDocument) {
        createNewDocument(relatedPartDetails);
      }
    }
  };

  const validateDocId = (skipId?: string | undefined) => (
    relatedPartsState.validateDocId(documentRevision?.document?.docId, relatedPartDetails.docId, skipId)
  );

  return useObserver(() => (
    <>
      <div className={cx(classes.editRowParentDiv, {
        [classes.editRowParentNormal]: !relatedPartsState.docIdErrorMsg,
        [classes.editRowParentError]: Boolean(relatedPartsState.docIdErrorMsg),
      })}
      data-cy="related-parts-edit-row"
      >
        <div className={classes.editRowChildDivOne}>
          <label >{documentRevision?.document?.docId} - </label>
          <TextField
            className={classes.textField}
            disabled={listItemBeingEdited?.version ? listItemBeingEdited.version > 1 : false}
            variant="outlined"
            onChange = {(e: ChangeEvent<HTMLInputElement>) =>
              setRelatedPartDetails({ ...relatedPartDetails, docId: e.target.value })}
            onBlur = {() => validateDocId}
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
      <div className={classes.actionButtonParentDiv} data-cy="edit-row-actions">
        <div className={classes.actionButtonChildDiv}>
          { showDeleteButton &&
          <Button
            data-cy="delete-related-part-sub-part"
            className={classes.actionButton}>
            <DeleteIcon className={classes.deleteIconButton}
              onClick={() => handleRemove?.(listItemBeingEdited?.docRevId as string)}/>
          </Button> }
          <Button
            data-cy="cancel-related-part-sub-part-addition"
            className={classes.actionButton} onClick = {resetAndCancelEdit}>
            <ClearIcon className={classes.iconButton}/>
          </Button>
          { !relatedPartsState.docIdErrorMsg &&
          <Button
            data-cy="confirm-related-part-sub-part-addition"
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
  handleRemove: (docRevId: string) => void;
  handleUpdate: (docRevId: string, suffixNumber: string, suffixName: string) => void;
  fetchRelatedParts: (documentId: any) => void;
  voidRelatedPart: (listItem: RelatedPartsListItem, revisionChangeType: RevisionChangeType) => void;
  relatedPartsState: RelatedPartsState;
}> = ({
  documentRevision,
  parentStatus = RELATED_PARTS_STATUS.PARENT_NO,
  parentStatusChanged,
  createNewDocument,
  viewRelatedPart,
  handleRemove,
  handleUpdate,
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
              dataCy="parent-separate-add-related-parts-btn"
              onClick = {createNewDocument} />
          </Grid>
        )}
        {parentStatus === RELATED_PARTS_STATUS.PARENT_TOGETHER && (
          <RelatedPartGrid
            documentRevision={documentRevision}
            createNewDocument={createNewDocument}
            viewRelatedPart={viewRelatedPart}
            handleRemove={handleRemove}
            handleUpdate={handleUpdate}
            fetchRelatedParts = {fetchRelatedParts}
            voidRelatedPart = {voidRelatedPart}
            relatedPartsState = {relatedPartsState}
          />
        )}
      </div>}
    </>
  );
};

export default RelatedParts;

