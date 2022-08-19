import { Box, Link } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import WarningOutlinedIcon from "@material-ui/icons/WarningOutlined";
import React from "react";
import Text from "../../../../components/Text";
import useDialog from "../../../../hooks/useDialog";
import Colors from "../../../../layout/theme/utils/colors";
import { UpgradeToLatestDialog } from "./UpgradeToLatestDialog";

interface Props {
  shouldShowUpgrade: boolean;
  bannerPortal?: React.MutableRefObject<HTMLDivElement | null>;
  onUpgradeClick: () => void;
}

const UpgradeToLatestBanner: React.FunctionComponent<Props> = ({
  shouldShowUpgrade,
  bannerPortal,
  onUpgradeClick,
}) => {
  const [showBanner, setShowBanner] = React.useState(true);
  const hideBanner = () => setShowBanner(false);
  const dialog = useDialog();

  return (
    <>
      {
        shouldShowUpgrade && showBanner &&
        <>
          <Box
            bgcolor={Colors.blue}
            color={Colors.white}
            fontWeight="bold"
            padding="10px"
            display="flex"
            alignItems="center"
            margin="10px"
          >
            <WarningOutlinedIcon color="disabled" />
            <Box component="span" marginLeft="10px" color={Colors.white}>
              <Text
                translation="document.revision.upgrade.form.banner"
                values={{
                  clickHere: (
                    <Link
                      onClick={dialog.open}
                      data-cy="formUpgradeButton"
                      component="button"
                      color="inherit"
                      style={{
                        color: Colors.white,
                        fontWeight: "bold",
                        textDecoration: "underline",
                        fontSize: "inherit",
                        marginBottom: 4,
                      }}
                    >
                      <Text translation="common.click.here" />
                    </Link>
                  ),
                }}
              />
            </Box>
            <CloseIcon onClick={hideBanner} style={{ cursor: "pointer", marginLeft: "auto" }} />
          </Box>
          <UpgradeToLatestDialog {...{ dialog, onUpgradeClick }}/>
        </>
      }
    </>
  );
};

export default UpgradeToLatestBanner;
