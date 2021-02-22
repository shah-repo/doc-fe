import { Button } from "@material-ui/core";
import React, { useEffect } from "react";
import Text from "../../../../components/Text";
import useDialog from "../../../../hooks/useDialog";
import UpgradeToLatestDialog from "./UpgradeToLatestDialog";

interface Props {
  showShouldUpgrade: boolean;
  setShouldDisplay?: (value: boolean) => void;
  onUpgradeClick: () => void;
}

const UpgradeToLatestButton: React.FunctionComponent<Props> = ({
  setShouldDisplay,
  showShouldUpgrade,
  onUpgradeClick,
}) => {
  const dialog = useDialog();

  useEffect(() => {
    setShouldDisplay?.(showShouldUpgrade);
  }, [showShouldUpgrade, setShouldDisplay]);

  return (
    <>
      {
        showShouldUpgrade &&
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
