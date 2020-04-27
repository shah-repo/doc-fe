import { Box } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";

const ApprovalRolesSectionBox: React.FunctionComponent = () => (
  <Box
    mb={4}
    bgcolor="primary.main"
    color="primary.contrastText"
    py={1.5}
    px={2}
    fontSize="h6.fontSize"
    style={{ textTransform: "uppercase" }}
    fontWeight={100}
    display="flex"
  >
    <Text translation={"form.builder.approval.roles"} />
  </Box>
);

export default ApprovalRolesSectionBox;
