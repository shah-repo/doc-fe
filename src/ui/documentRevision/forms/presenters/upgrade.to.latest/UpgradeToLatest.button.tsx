import { Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { StyledButton } from "../../../../../App/Shifamed/Components/forms/presenters/StyledListButton";
import { StyledMenuListIcon } from "../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon";
import { StyledMenuListItem } from "../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem";
import { StyledMenuListItemText } from "../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText";
import SM from "../../../../../App/Shifamed/Utils/SM/SM";
import { ReactComponent as UpgradeToLatestIcon } from "../../../../../assets/images/upgrade_to_latest.svg";
import Text from "../../../../components/Text";
import useDialog from "../../../../hooks/useDialog";
import UpgradeToLatestDialog from "./UpgradeToLatestDialog";

interface Props {
  shouldShowUpgrade: boolean;
  setShouldDisplay?: (value: boolean) => void;
  onUpgradeClick: () => void;
  renderAsButton?: boolean;
}

const UpgradeToLatestButton: React.FunctionComponent<Props> = ({
  setShouldDisplay,
  shouldShowUpgrade,
  onUpgradeClick,
  renderAsButton,
}) => {
  const isNewLayout = SM.isNewLayout;
  const dialog = useDialog();

  useEffect(() => {
    setShouldDisplay?.(shouldShowUpgrade);
  }, [shouldShowUpgrade, setShouldDisplay]);

  return (
    <>
      {shouldShowUpgrade && (
        <>
          {isNewLayout ? (
            renderAsButton ? <StyledButton
              color="primary"
              onClick={dialog.open}
              id="UpgradeToLatest-upgrade"
            >
              <Text translation="common.upgrade" />
            </StyledButton> : <StyledMenuListItem button alignItems="flex-start" onClick={dialog.open}>
              <StyledMenuListIcon><UpgradeToLatestIcon/></StyledMenuListIcon>
              <StyledMenuListItemText
                id="UpgradeToLatest-upgrade"
                primary={<Text translation="common.upgrade" />}
              />
            </StyledMenuListItem>
          ) : (
            <Button
              variant="outlined"
              onClick={dialog.open}
              id="UpgradeToLatest-upgrade"
            >
              <Text translation="common.upgrade" />
            </Button>
          )}
          <UpgradeToLatestDialog {...{ dialog, onUpgradeClick }} />
        </>
      )}
    </>
  );
};

export default UpgradeToLatestButton;
