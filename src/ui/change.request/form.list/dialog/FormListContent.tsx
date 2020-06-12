import { Box, DialogContent, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import _ from "lodash";
import React, { useState } from "react";
import { DocumentTypeById } from "../../../../state/ducks/documentRevisions/documentType";
import { DialogHandler } from "../../../hooks/useDialog";
import Colors from "../../../layout/theme/utils/colors";
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
  const [chosenForm, setChosenForm] = useState<string>("");

  const uniqTemplates = _.uniqBy(templateOptions.map((e) => e.forms.map((s) => ({ ...s, docTypeId: e.documentType.id, docTypeName: e.documentType.documentTypeName }))).flat(), "id");
  const docTypeByFormIds = templateOptions.map((e) => e.forms.map((s) => ({ ...e.documentType, formIds: s.id } ))).flat();
  const availableDocTypes = docTypeByFormIds.filter((e) => e.formIds === chosenForm);

  return (
    <DialogContent classes={{ root: classes.dialogContent }}>
      <Box style={{ boxShadow: `0px 1px ${Colors.medium_gray}`, marginBottom: "5px" }}>
        <RadioGroup
          aria-label="selectForm"
          name="select-form"
          id="FormList-selectForm"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setChosenForm((event.target as HTMLInputElement).value)}
        >
          {uniqTemplates.map((template) => (
            <FormControlLabel
              key={template.id}
              value={template.id}
              control={<Radio color="primary" />}
              label={template.name}
            />
          ))}
        </RadioGroup>
      </Box>
      <RadioGroup
        aria-label="selectType"
        name="select-type"
        id="FormList-selectType"
      >
        {availableDocTypes.map((type) => (
          <FormControlLabel
            key={type.id}
            value={type.id}
            control={<Radio color="primary" />}
            label={type.documentTypeName}
          />
        ))}
      </RadioGroup>
      <FormListActions {...{ dialog }}/>
    </DialogContent>

  ); };

export default FormListContent;
