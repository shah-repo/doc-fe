import { Button } from "@material-ui/core";
import React from "react";
import { StyledButton } from "../../../App/Shifamed/Components/forms/presenters/StyledListButton";
import { StyledMenuListIcon } from "../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon";
import { StyledMenuListItem } from "../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem";
import { StyledMenuListItemText } from "../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText";
import SM from "../../../App/Shifamed/Utils/SM/SM";
import { ReactComponent as FaiIcon } from "../../../assets/images/fai.svg";
import Text from "../../components/Text";
import { InspectionControlsPresenterProps } from "./InspectionControls.types";
import InspectionDialog from "./InspectionDialog/InspectionDialog";

/** Buttons for creating an inspection record - presenter.
 * @param onButtonClick Action executed when user clicks on FAI or Inspection button.
 * @param canCreateInspection Flag that marks whether the current document revision has the proper group option.
 * @param isDocumentDraft Flag that marks whether the current document is in draft.
 * @param disabled Flag that marks whether the buttons should be disabled (because of loading etc.)
 */
const InspectionControlsPresenter: React.FunctionComponent<InspectionControlsPresenterProps> = ({
  onButtonClick,
  canCreateInspection,
  isDocumentDraft,
  disabled,
  renderAsButton,
  ...props
}) => {
  const isNewLayout = SM.isNewLayout;
  if (!isDocumentDraft || !canCreateInspection) { return null; }

  const renderButton = () => {
    if (!renderAsButton) {
      return (<StyledMenuListItem disabled={disabled} button alignItems="flex-start" onClick={onButtonClick}>
        <StyledMenuListIcon><FaiIcon/></StyledMenuListIcon>
        <StyledMenuListItemText
          data-cy={`PreviewControlsContainer-inspection-FAI`}
          primary={<Text translation="document.revision.fai" />}
        />
      </StyledMenuListItem>
      );
    }
    return (<StyledButton
      color="primary"
      data-cy={`PreviewControlsContainer-inspection-FAI`}
      onClick={onButtonClick}
      {...{ disabled }}
    >
      <Text translation={"document.revision.fai"} />
    </StyledButton>);
  };

  return (
    <>
      {isNewLayout ? (
        renderButton()
      ) : (
        <Button
          variant="outlined"
          color="secondary"
          data-cy={`PreviewControlsContainer-inspection-FAI`}
          onClick={onButtonClick}
          {...{ disabled }}
        >
          <Text translation={"document.revision.fai"} />
        </Button>
      )}
      <InspectionDialog { ...(props) } />
    </>
  );
};

export default InspectionControlsPresenter;
