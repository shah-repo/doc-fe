import { Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { StyledButton } from "../../../../../App/Shifamed/Components/forms/presenters/StyledListButton";
import SM from "../../../../../App/Shifamed/Utils/SM/SM";
import Text from "../../../../components/Text";
import useDialog from "../../../../hooks/useDialog";
import UpgradeToLatestDialog from "./UpgradeToLatestDialog";

interface Props {
  shouldShowUpgrade: boolean;
  setShouldDisplay?: (value: boolean) => void;
  onUpgradeClick: () => void;
}

const UpgradeToLatestButton: React.FunctionComponent<Props> = ({
  setShouldDisplay,
  shouldShowUpgrade,
  onUpgradeClick,
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
            <StyledButton
              color="primary"
              onClick={dialog.open}
              id="UpgradeToLatest-upgrade"
            >
              <Text translation="common.upgrade" />
            </StyledButton>
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
