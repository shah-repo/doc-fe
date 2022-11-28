import { TableCell, TableRow, TextField } from "@material-ui/core";
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
    <TableRow hover>
      <TableCell align="left">
        <FBAutocompleteAsync
          name={`${name}.${index}.proposedDocumentRevision.id`}
          optionId={FBAutocompleteAsyncOption.documentRevisions}
          gutter={false}
          disabled={true}
          freeSolo={true}
          shouldReloadOnInit
        />
      </TableCell>
      <TableCell align="left">
        <TextField
          className={classes.textField}
          variant="outlined"
          value={descriptionOfChange}
        />
      </TableCell>
      <TableCell align="left">
        <TextField
          className={classes.textField}
          variant="outlined"
          value={justificationOfChange}
        />
      </TableCell>
    </TableRow>
  );
};

export default ChangeOrderGridItem;
