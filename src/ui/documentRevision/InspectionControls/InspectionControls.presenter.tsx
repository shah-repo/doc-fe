import { Button } from "@material-ui/core";
import React from "react";
import { DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType/types";
import Text from "../../components/Text";
import { Translation } from "../../translations/types";
import { InspectionControlsPresenterProps, InspectionType } from "./InspectionControls.types";
import { InspectionDialog } from "./InspectionDialog/InspectionDialog";

/** Buttons for creating an inspection record - presenter.
 * @param onButtonClick Action executed when user clicks on FAI or Inspection button.
 * @param canCreateInspection Flag that marks whether the current document revision has the proper group option.
 * @param isDocumentReleased Flag that marks whether the current document is released.
 * @param disabled Flag that marks whether the buttons should be disabled (because of loading etc.)
 */
export const InspectionControlsPresenter: React.FunctionComponent<InspectionControlsPresenterProps> = ({
  onButtonClick,
  canCreateInspection,
  isDocumentReleased,
  disabled,
  ...props
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
      { // we currently don't need this
      // { /** INSPECTION */
      //   renderButton(
      //     isDocumentReleased && canCreateInspection,
      //     DOC_TYPE_GROUP_OPTION.INSPECTION,
      //     "document.revision.inspection",
      //   )}
      }
      <InspectionDialog { ...(props) } />
    </>
  );
};

export default InspectionControlsPresenter;
