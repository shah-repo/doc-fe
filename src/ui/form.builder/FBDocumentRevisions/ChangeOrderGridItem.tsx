import { TextField } from "@material-ui/core";
import cx from "classnames";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBDocumentRevisionsItemProps } from "..";
import useStyles from "./ChangeOrderGrid.styles";

const ChangeOrderGridItem: React.FunctionComponent<FBDocumentRevisionsItemProps> = ({
  handleOpen,
  remove,
  id,
  index = 0,
  disabled,
  name,
  justificationOfChange,
  descriptionOfChange,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.itemRow}>
      <div className={cx(classes.cellOne, classes.itemRightPadding)}>
        <FBAutocompleteAsync
          name={`${name}.${index}.proposedDocumentRevision.id`}
          optionId={FBAutocompleteAsyncOption.documentRevisions}
          gutter={false}
          disabled={true}
          freeSolo={true}
          shouldReloadOnInit
        />
      </div>
      <div className={cx(classes.cellTwo, classes.itemRightPadding)}>
        <TextField
          className={classes.textField}
          variant="outlined"
          value={descriptionOfChange}
        />
      </div>
      <div className={classes.cellThree}>
        <TextField
          className={classes.textField}
          variant="outlined"
          value={justificationOfChange}
        />
      </div>
    </div>
  );
};

export default ChangeOrderGridItem;
