import { Box } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { companyActions, companySelectors } from "../../../../../state/ducks/company";
import Text from "../../../../components/Text";
import Colors from "../../../../layout/theme/utils/colors";


const RedlineBanner: React.FunctionComponent = () => {
  const redlineActive = useSelector(companySelectors.getRedlineActive);
  const dispatch = useDispatch();

  // remove banner on unmount
  useEffect(() => () => {
    dispatch(companyActions.redlineConfig(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!redlineActive) {
    return null;
  }

  return (
    <>
      <Box
        bgcolor="secondary.main"
        color={Colors.white}
        fontWeight="bold"
        padding="10px"
        display="flex"
        justifyContent="center"
      >
        <Text translation="common.redline.message" />
      </Box>
    </>
  ); };

export default RedlineBanner;
