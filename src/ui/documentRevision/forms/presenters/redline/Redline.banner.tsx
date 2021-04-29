import { Box, Portal } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { companySelectors } from "../../../../../state/ducks/company";
import Text from "../../../../components/Text";
import Colors from "../../../../layout/theme/utils/colors";

interface Props {
  bannerPortal?: React.MutableRefObject<HTMLDivElement | null>;
}

const RedlineBanner: React.FunctionComponent<Props> = ({
  bannerPortal,
}) => {
  const redlineActive = useSelector(companySelectors.getRedlineActive);

  if (!redlineActive) {
    return null;
  }

  return (
    <>
      {
        <Portal container={bannerPortal?.current}>
          <Box
            bgcolor="secondary.main"
            color={Colors.white}
            fontWeight="bold"
            padding="10px"
            display="flex"
            justifyContent="center"
            position="fixed"
            width="70%"
            zIndex="9999"
          >
            <Text translation="common.redline.message" />
          </Box>
        </Portal>

      }
    </>
  ); };

export default RedlineBanner;
