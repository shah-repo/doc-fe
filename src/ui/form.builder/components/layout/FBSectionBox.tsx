import { Box, IconButton } from "@material-ui/core";
import ReplayIcon from "@material-ui/icons/Replay";
import React from "react";
import { FBTooltip } from "../..";
import Text from "../../../components/Text";
import { FBPOApprovalMatrixFieldProps } from "../../FBPOApprovalMatrix/FBPOApprovalMatrix.types";
import { FBFormDefaultProps } from "../../types/common";

type Props = FBFormDefaultProps & Pick<FBPOApprovalMatrixFieldProps, "handleRevert">;
const FBSectionBox: React.FunctionComponent<Props> = ({
  label,
  handleRevert,
}) => (
  <Box
    mb={4}
    bgcolor="primary.main"
    color="primary.contrastText"
    py={1.5}
    px={2}
    fontSize="h6.fontSize"
    fontWeight={100}
    borderRadius={4}
  >
    {label && <Text message={(label as string).toUpperCase()} />}
    <Box display="flex" flexDirection="row-reverse" mt={-3.5}>
      <IconButton color="inherit" size="small" onClick={handleRevert} >
        <FBTooltip title='Revert to initial'>
          <ReplayIcon />
        </FBTooltip>
      </IconButton>
    </Box>
  </Box>
);

export default FBSectionBox;
