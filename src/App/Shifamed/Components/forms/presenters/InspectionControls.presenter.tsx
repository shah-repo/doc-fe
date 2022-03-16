import React from "react";
import Text from "../../../../../ui/components/Text";
import { InspectionControlsPresenterProps } from "../../../../../ui/documentRevision/InspectionControls/InspectionControls.types";
import InspectionDialog from "../../../../../ui/documentRevision/InspectionControls/InspectionDialog/InspectionDialog";
import { StyledButton } from "./StyledListButton";

/** Buttons for creating an inspection record - presenter.
 * @param onButtonClick Action executed when user clicks on FAI or Inspection button.
 * @param canCreateInspection Flag that marks whether the current document revision has the proper group option.
 * @param isDocumentDraft Flag that marks whether the current document is in draft.
 * @param disabled Flag that marks whether the buttons should be disabled (because of loading etc.)
 */
const NewInspectionControlsPresenter: React.FunctionComponent<InspectionControlsPresenterProps> = ({
  onButtonClick,
  canCreateInspection,
  isDocumentDraft,
  disabled,
  ...props
}) => {
  if (!isDocumentDraft || !canCreateInspection) { return null; }

  return (
    <>
      <StyledButton
        color="primary"
        data-cy={`PreviewControlsContainer-inspection-FAI`}
        onClick={() => onButtonClick()}
        {...{ disabled }}
      >
        <Text translation={"document.revision.fai"} />
      </StyledButton>
      <InspectionDialog { ...(props) } />
    </>
  );
};

export default NewInspectionControlsPresenter;
