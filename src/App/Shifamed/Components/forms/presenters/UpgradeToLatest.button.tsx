import React, { useEffect } from "react";
import Text from "../../../../../ui/components/Text";
import UpgradeToLatestDialog from "../../../../../ui/documentRevision/forms/presenters/upgrade.to.latest/UpgradeToLatestDialog";
import useDialog from "../../../../../ui/hooks/useDialog";
import { StyledButton } from "./StyledListButton";

interface Props {
  shouldShowUpgrade: boolean;
  setShouldDisplay?: (value: boolean) => void;
  onUpgradeClick: () => void;
}

const NewUpgradeToLatestButton: React.FunctionComponent<Props> = ({
  setShouldDisplay,
  shouldShowUpgrade,
  onUpgradeClick,
}) => {
  const dialog = useDialog();

  useEffect(() => {
    setShouldDisplay?.(shouldShowUpgrade);
  }, [shouldShowUpgrade, setShouldDisplay]);

  return (
    <>
      {
        shouldShowUpgrade &&
        <>
          <StyledButton
            color="primary"
            onClick={dialog.open}
            id="UpgradeToLatest-upgrade"
          >
            <Text translation="common.upgrade"/>
          </StyledButton>
          <UpgradeToLatestDialog {...{ dialog, onUpgradeClick }}/>
        </>
      }
    </>
  );
};

export default NewUpgradeToLatestButton;
