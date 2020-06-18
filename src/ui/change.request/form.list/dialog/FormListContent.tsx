import { DialogContent, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import React, { useState } from "react";
import { Id } from "../../../../state/ducks/common";
import { DocumentTypeById } from "../../../../state/ducks/documentRevisions/documentType";
import { DialogHandler } from "../../../hooks/useDialog";
import { styles } from "../FormList.styles";
import FormListActions from "./FormListActions";

interface Props {
  dialog: DialogHandler;
  templateOptions: DocumentTypeById[];
}

interface CRCreateIdsProps {
  formDocument: Id;
  documentType: Id;
}

export let CRCreateIdsContext = React.createContext<CRCreateIdsProps | undefined>(undefined);

export const FormListContent: React.FunctionComponent<Props> = ({
  dialog,
  templateOptions,
}) => {
  const classes = styles();
  const [chosenTypeId, setchosenTypeId] = useState<string>("");
  const [ chosenFormId, setChosenFormId ] = useState<string>("");

  CRCreateIdsContext = React.createContext<CRCreateIdsProps | undefined>({
    formDocument: { id: chosenFormId },
    documentType: { id: chosenTypeId },
  });

  return (
    <DialogContent classes={{ root: classes.dialogContent }}>
      <RadioGroup
        aria-label="selectForm"
        name="select-form"
        id="FormList-selectForm"
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
      <FormListActions {...{ dialog, chosenTypeId }}/>
    </DialogContent>

  ); };

export default FormListContent;
