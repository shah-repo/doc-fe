import { Box } from "@material-ui/core";
import React from "react";
import { withLabelRenderer } from "../../components/common/hocs/withLabelRenderer";
import { FBFormDefaultProps } from "../../components/common/utils/types";
import FBDialog from "../../components/dialog/FBDialog";
import { withDialogStates } from "../../components/dialog/utils/hoc";
import { FBDialogProps } from "../../components/dialog/utils/types";
import FBForm from "../../components/form/FBForm";
import FBButon from "../../components/inputs/button/FBButton";
import { templateStore, view } from "../../stores/templateStore";
import { FBBasicFieldEditorComponent } from "./utils/defaults";
import { FBBasicFieldEditorType } from "./utils/types";

const FBBasicFieldEditor: React.FunctionComponent<FBFormDefaultProps & FBDialogProps> = ({
  labelRenderer,
  ...props
}) => {

  const handleSubmit = (type: FBBasicFieldEditorType) => (values: any) => {
    const schemaEl = templateStore.generateSchemaEl(type, values);
    templateStore.schema.push(schemaEl);
    props.setDialogClose();
  };

  const handleFieldType = (type: FBBasicFieldEditorType) => () => {
    const InputType = FBBasicFieldEditorComponent[type as string];
    props.setDialogChildren(
      <FBForm onSubmit={handleSubmit(type)}>
        <InputType />
      </FBForm>,
    );
    props.setDialogOpen();
  };

  return (
    <Box>
      {labelRenderer}
      <Box ml={-1}>
        <FBButon label="Text field" onClick={handleFieldType("textfield")} />
        <FBButon label="Checkbox" onClick={handleFieldType("checkbox")} />
        <FBButon label="Checkbox group" onClick={handleFieldType("checkboxgroup")} />
      </Box>
      <FBDialog
        title="Create a field"
        {...props}
      />
    </Box>
  );
};

export default withLabelRenderer(withDialogStates(FBBasicFieldEditor));
