import { Button } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import { InspectionControlsPresenterProps } from "./InspectionControls.types";
import InspectionDialog from "./InspectionDialog/InspectionDialog";

/** Buttons for creating an inspection record - presenter.
 * @param onButtonClick Action executed when user clicks on FAI or Inspection button.
 * @param canCreateInspection Flag that marks whether the current document revision has the proper group option.
 * @param isDocumentDraft Flag that marks whether the current document is in draft.
 * @param disabled Flag that marks whether the buttons should be disabled (because of loading etc.)
 */
export const InspectionControlsPresenter: React.FunctionComponent<InspectionControlsPresenterProps> = ({
  onButtonClick,
  canCreateInspection,
  isDocumentDraft,
  disabled,
  ...props
}) => {
  if (!isDocumentDraft || !canCreateInspection) { return null; }

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        data-cy={`PreviewControlsContainer-inspection-FAI`}
        onClick={() => onButtonClick()}
        {...{ disabled }}
      >
        <Text translation={"document.revision.fai"} />
      </Button>
      <InspectionDialog { ...(props) } />
    </>
  );
};

export default InspectionControlsPresenter;
