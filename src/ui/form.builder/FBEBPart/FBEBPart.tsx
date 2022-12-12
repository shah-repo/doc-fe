import { Box } from "@material-ui/core";
import cx from "classnames";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBData, FBDialog, FBEBPartProps, FBInput, FBProvider, FBRadioGroup, PartType } from "..";
import { FBButtonStyles } from "../styles/FBButton.styles";
import { withFBEBPart } from "./FBEBPart.wrap";

const FBEBPart: React.FunctionComponent<FBEBPartProps> = ({
  handleAdd,
  ebPartState,
  dialogState,
  loading,
  disabled,
  childrenParts,
  childrenPartsForRevise,
  partTypeDefaultValue,
  childForReviseValue,
  childrenPartsValue,
  partType,
  children,
}) => {
  const classes = FBButtonStyles();
  const revisionMode =
    partType === PartType.DocumentRevision || (!partType && partTypeDefaultValue === PartType.DocumentRevision);

  return (
    <FBProvider {...{ dialogState, ebPartState }}>
      <FBDialog />
      <FBRadioGroup
        label="form.builder.part.revision"
        name="partType"
        gutter={false}
        options={FBData.partTypeOptions}
        defaultValue={partTypeDefaultValue}
        withState
        omitFormValue
      />
      {children}
      <FBInput type="ebpart">
        <Box display="flex" alignItems="flex-end" mt={2.5}>
          <Box flexGrow={1}>
            <FBAutocompleteAsync
              key={revisionMode ? childrenPartsValue : childForReviseValue}
              label="form.builder.part"
              placeholder="form.builder.select.existing.part"
              gutter={false}
              shouldReloadOnInit
              withState
              omitFormValue
              name={revisionMode ? "childrenParts" : "childForRevise"}
              optionId={
                revisionMode
                  ? FBAutocompleteAsyncOption.availableParts
                  : FBAutocompleteAsyncOption.availablePartDocuments
              }
              additionalData={revisionMode ? childrenParts : childrenPartsForRevise}
              defaultValue={revisionMode ? childrenPartsValue : childForReviseValue}
              {...{
                disabled,
                loading,
              }}
            />
          </Box>
          <Box ml={1}>
            <FBButton
              variant="contained"
              label="form.builder.create.new.part"
              size="large"
              onClick={handleAdd}
              className={cx(classes.button, classes.margin)}
              disabled={disabled || !revisionMode}
            />
          </Box>
        </Box>
      </FBInput>
    </FBProvider>
  );
};

export default withFBEBPart(FBEBPart);
