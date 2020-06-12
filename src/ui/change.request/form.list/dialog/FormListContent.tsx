import { DialogContent, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import React from "react";
import { DialogHandler } from "../../../hooks/useDialog";
import { styles } from "../FormList.styles";
import FormListActions from "./FormListActions";

interface Props {
  dialog: DialogHandler;
  templateOptions: DocumentType[];
}
export const FormListContent: React.FunctionComponent<Props> = ({
  dialog,
  templateOptions,
}) => {
  const classes = styles();

  return (
    <DialogContent classes={{ root: classes.dialogContent }}>
      <RadioGroup
        aria-label="selectTemplate"
        name="select-template"
        // value={""}
        id="FormList-selectTemplate"
      >
        {templateOptions.map((template) => (
          <FormControlLabel
            key={""}
            value={""}
            control={<Radio color="primary" />}
            label={""}
          />
        ))}
      </RadioGroup>
      <FormListActions {...{ dialog }}/>
    </DialogContent>

  ); };

export default FormListContent;
