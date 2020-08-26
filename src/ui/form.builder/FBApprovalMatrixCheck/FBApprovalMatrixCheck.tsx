import CheckBoxOutlineBlankTwoToneIcon from "@material-ui/icons/CheckBoxOutlineBlankTwoTone";
import CheckBoxTwoToneIcon from "@material-ui/icons/CheckBoxTwoTone";
import React from "react";
import { FBApprovalMatrixCheckProps } from "..";
import { withFBApprovalMatrixCheck } from "./FBApprovalMatrixCheck.wrap";

const FBApprovalMatrixCheck: React.FunctionComponent<FBApprovalMatrixCheckProps> = ({
  handleCheck,
  checked,
}) => (
  <>
    {checked && (
      <CheckBoxTwoToneIcon
        onClick={handleCheck}
        fontSize="small"
        color="action"
      />
    )}
    {!checked && (
      <CheckBoxOutlineBlankTwoToneIcon
        onClick={handleCheck}
        fontSize="small"
        color="action"
      />
    )}


  </>
);

export default withFBApprovalMatrixCheck(FBApprovalMatrixCheck);
