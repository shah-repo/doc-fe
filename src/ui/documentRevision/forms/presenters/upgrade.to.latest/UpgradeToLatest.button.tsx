import { Button } from "@material-ui/core";
import React, { useEffect } from "react";
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
  const dialog = useDialog();

  useEffect(() => {
    setShouldDisplay?.(shouldShowUpgrade);
  }, [shouldShowUpgrade, setShouldDisplay]);

  return (
    <>
      {
        shouldShowUpgrade &&
        <>
          <Button
            variant="outlined"
            onClick={dialog.open}
            id="UpgradeToLatest-upgrade"
          >
            <Text translation="common.upgrade"/>
          </Button>
          <UpgradeToLatestDialog {...{ dialog, onUpgradeClick }}/>
        </>
      }
    </>
  );
};

export default UpgradeToLatestButton;
