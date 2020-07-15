import { DialogContent, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import React, { useState } from "react";
import { DocumentTypeById } from "../../../../state/ducks/documentRevisions/documentType";
import { DialogHandler } from "../../../hooks/useDialog";
import { styles } from "../FormList.styles";
import FormListActions from "./FormListActions";

interface Props {
  dialog: DialogHandler;
  templateOptions: DocumentTypeById[];
}

export const FormListContent: React.FunctionComponent<Props> = ({
  dialog,
  templateOptions,
}) => {
  const classes = styles();
  const [chosenTypeId, setchosenTypeId] = useState<string>("");
  const [ chosenFormId, setChosenFormId ] = useState<string>("");

  return (
    <DialogContent classes={{ root: classes.dialogContent }}>
      <RadioGroup
        aria-label="selectForm"
        name="select-form"
        id="FormList-selectForm"
        className={classes.templateRadioGroup}
      >
        {templateOptions.map((template) =>
          template.forms.map((form) =>
            <FormControlLabel
              key={form.id}
              value={form.id}
              control={<Radio color="primary" />}
              label={form.name}
              onChange={() => {
                setchosenTypeId(template.documentType.id);
                setChosenFormId(form.id);
              }}
            />
          ))}
      </RadioGroup>
      <FormListActions {...{ dialog, chosenFormId, chosenTypeId }}/>
    </DialogContent>

  ); };

export default FormListContent;
