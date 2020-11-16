import { Button } from "@material-ui/core";
import React from "react";
import { DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType/types";
import Text from "../../components/Text";
import { Translation } from "../../translations/types";
import { InspectionControlsPresenterProps, InspectionType } from "./InspectionControls.types";
import { InspectionDialog } from "./InspectionDialog/InspectionDialog";

export const InspectionControlsPresenter: React.FunctionComponent<InspectionControlsPresenterProps> = ({
  onButtonClick,
  onFormSelect,
  onDocTypeSelect,
  canCreateInspection,
  isDocumentReleased,
  disabled,
  inspectionDialog,
  formOptions,
  docTypeOptions,
  isDocTypeInputDisabled,
}) => {
  const renderButton = (shouldRender: boolean, inspectionType: InspectionType, label: Translation) => {
    if (!shouldRender) { return null; }
    return (
      <Button
        variant="contained"
        color="primary"
        data-cy={`PreviewControlsContainer-inspection-${label}`}
        onClick={() => onButtonClick(inspectionType)}
        {...{ disabled }}
      >
        <Text translation={label} />
      </Button>
    );
  };

  return (
    <>
      { /** FAI */
        renderButton(
          isDocumentReleased && canCreateInspection,
          DOC_TYPE_GROUP_OPTION.FAI_INSPECTION,
          "document.revision.fai",
        )}
      { /** INSPECTION */
        renderButton(
          isDocumentReleased && canCreateInspection,
          DOC_TYPE_GROUP_OPTION.INSPECTION,
          "document.revision.inspection",
        )}
      <InspectionDialog
        {...{
          inspectionDialog,
          formOptions,
          docTypeOptions,
          onFormSelect,
          onDocTypeSelect,
          isDocTypeInputDisabled,
        }}
      />
    </>
  );
};

export default InspectionControlsPresenter;
