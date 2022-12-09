/* eslint-disable no-console */
import { Button } from "@material-ui/core";
import cx from "classnames";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBForm, FBFormState, FBTextField } from "../../form.builder";
import useStyles from "./ChangeOrderGrid.styles";

import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
// import DeleteIcon from '@material-ui/icons/Delete';

const ChangeOrderEditGridItem: React.FunctionComponent<{
  disabledOptions: string[];
  formState: FBFormState;
  addRevisionToChangeRequest: () => void;
  resetAndCancelEdit?: () => void;
  showAutoComplete? : boolean;
  titleText?: string;
}> = ({
  disabledOptions,
  formState,
  addRevisionToChangeRequest,
  resetAndCancelEdit,
  showAutoComplete = true,
  titleText,
}) => {
  const classes = useStyles();

  return (
    <FBForm {...{ formState }} >
      <div className={cx(classes.enclosingDiv, classes.enclosingDivEditItem)}>
        <div className={cx(classes.itemRow, classes.editItemRow)}>
          <div className={classes.cellOne}>
            { showAutoComplete &&
              <FBAutocompleteAsync
                name="proposedDocumentRevision"
                label=""
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
          <div className={cx(classes.cellTwo, classes.itemLeftPadding)}>
            <FBTextField
              name="descriptionOfChange"
              label=""
              placeholder="form.builder.enter.text"
              rules="required"
              multiline={true}
              rows={1}
            />
          </div>
          <div className={cx(classes.cellThree, classes.itemLeftPadding)}>
            <FBTextField
              name="justificationOfChange"
              label=""
              placeholder="form.builder.enter.text"
              rules="required"
              multiline={true}
              rows={1}
            />
          </div>
        </div>
        <div className={classes.actionButtonChildDiv}>
          <Button className={classes.actionButton} onClick = {resetAndCancelEdit}>
            <ClearIcon className={classes.iconButton}/>
          </Button>
          <Button className={classes.actionButton} onClick = {addRevisionToChangeRequest}>
            <DoneIcon className={classes.iconButton} />
          </Button>
        </div>
      </div>
    </FBForm>
  );
};

export default ChangeOrderEditGridItem;
