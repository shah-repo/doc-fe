import React from "react";
import Text from "../../../../../ui/components/Text";
import { InspectionControlsPresenterProps } from "../../../../../ui/documentRevision/InspectionControls/InspectionControls.types";
import InspectionDialog from "../../../../../ui/documentRevision/InspectionControls/InspectionDialog/InspectionDialog";
import { StyledButton } from "./StyledListButton";
import { StyledMenuListItem } from "./StyledMenuListItem";
import { StyledMenuListItemText } from "./StyledMenuListITemText";

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
  renderAsButton,
  ...props
}) => {
  if (!isDocumentDraft || !canCreateInspection) { return null; }

  return (
    <>
      {renderAsButton && (<StyledButton
        color="primary"
        data-cy={`PreviewControlsContainer-inspection-FAI`}
        onClick={() => onButtonClick()}
        {...{ disabled }}
      >
        <Text translation={"document.revision.fai"} />
      </StyledButton>
      )}
      {!renderAsButton && (
        <StyledMenuListItem button {...{ disabled }} alignItems="flex-start">
          {/* TODO: needs to add menu item icon */}
          {/* <StyledMenuListIcon>
            <InspectionControlIcon />
          </StyledMenuListIcon> */}
          <StyledMenuListItemText
            primary={<Text translation="document.revision.fai" />}
            data-cy={`PreviewControlsContainer-inspection-FAI`}
            onClick={() => onButtonClick()}
          />
        </StyledMenuListItem>
      )}
      <InspectionDialog { ...(props) } />
    </>
  );
};

export default NewInspectionControlsPresenter;
