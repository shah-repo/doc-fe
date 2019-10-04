import { Box } from "@material-ui/core";
import React from "react";
import FBDialog from "../../components/feedback/FBDialog";
import FBForm from "../../components/form/FBForm";
import FBButton from "../../components/inputs/FBButton";
import { FBEditorSectionConfig } from "../../defaults/editor";
import { withEditorRenderer } from "../../hocs/withEditorRenderer";
import { FBDialogProps } from "../../types/dialog";
import { FBEditorElementType } from "../../types/editor";
import FBEditorSection from "./FBEditorSection";

const FBEditorDialog: React.FunctionComponent<FBDialogProps> = ({
  ...props
}) => {

  const handleFieldType = (type: FBEditorElementType) => () => {
    props.setDialogContent(
      <FBForm render={withEditorRenderer({type, ...props})} />,
      "Create a Field",
    );
  };

  const generateElements = (elements: FBEditorElementType[]) => elements.map((el) => (
    <FBButton
      label={`form.builder.${el as string}`}
      onClick={handleFieldType(el)}
    />
  ));

  const sections = Object.keys(FBEditorSectionConfig).map((key) => (
    <FBEditorSection label={`form.builder.${key as string}`}>
      {generateElements(FBEditorSectionConfig[key])}
    </FBEditorSection>
  ));

  return (
    <FBDialog {...props}>
      <Box display="block" p={2}>
        {sections}
      </Box>
    </FBDialog>
  );
};

export default FBEditorDialog;
