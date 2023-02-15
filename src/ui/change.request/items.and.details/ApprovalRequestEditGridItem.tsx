import { Button } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import cx from "classnames";
import React from "react";
import { ReactComponent as DeleteIcon } from "../../../assets/images/trash-can 2.svg";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBForm, FBFormState, FBTextField } from "../../form.builder";
import useStyles from "./ApprovalRequestGrid.styles";
import { ApprovalRequestGridItem } from "./ItemsAndDetails.types";

const ApprovalRequestEditGridItem: React.FunctionComponent<{
  disabledOptions: string[];
  formState: FBFormState;
  addRevisionToChangeRequest: () => void;
  resetAndCancelEdit?: () => void;
  showAutoComplete? : boolean;
  titleText?: string;
  handleRemove?: (docRevId: string) => void;
  entry?: ApprovalRequestGridItem | any;
}> = ({
  disabledOptions,
  formState,
  addRevisionToChangeRequest,
  resetAndCancelEdit,
  showAutoComplete = true,
  titleText,
  handleRemove,
  entry,
}) => {
  const classes = useStyles();

  return (
    <FBForm {...{ formState }} >
      <div className={cx(classes.enclosingDiv, classes.enclosingDivEditItem)}>
        <div className={cx(classes.itemRow, classes.editItemRow)}>
          <div className={cx(classes.cellOne, classes.hiddenLegend)}>
            { showAutoComplete &&
              <FBAutocompleteAsync
                name="proposedDocumentRevision"
                label="form.builder.document"
                placeholder="form.builder.select.document"
                optionId={FBAutocompleteAsyncOption.DRAFTdocumentRevisions}
                optionValueType="id"
                rules="required"
                {...{ disabledOptions }}
                shouldReloadOnInit
                autoCompleteClasses={{ option: classes.option }}
              />
            }
            { !showAutoComplete && <span>{titleText}</span>}
          </div>
          <div className={cx(classes.cellOther, classes.itemLeftPadding, classes.hiddenLegend)}>
            <FBTextField
              name="descriptionOfChange"
              label="form.builder.description.of.change"
              placeholder="form.builder.enter.text"
              rules="required"
              multiline={true}
              rows={1}
            />
          </div>
          <div className={cx(classes.cellOther, classes.itemLeftPadding, classes.hiddenLegend)}>
            <FBTextField
              name="justificationOfChange"
              label="form.builder.justification.of.change"
              placeholder="form.builder.enter.text"
              rules="required"
              multiline={true}
              rows={1}
            />
          </div>
        </div>
        <div className={classes.actionButtonChildDiv}>
          <Button className={classes.actionButton}>
            <DeleteIcon className={classes.iconButton}
              onClick={() =>  {
                resetAndCancelEdit?.();
                handleRemove?.(entry?.docRevId); }}/>
          </Button>
          <Button data-cy="clearRecord" className={classes.actionButton} onClick = {resetAndCancelEdit}>
            <ClearIcon className={classes.iconButton}/>
          </Button>
          <Button data-cy="doneRecord"
            className={cx(classes.actionButton, classes.actionButtonDone)} onClick = {addRevisionToChangeRequest}>
            <DoneIcon className={classes.iconButton} />
          </Button>
        </div>
      </div>
    </FBForm>
  );
};

export default ApprovalRequestEditGridItem;
