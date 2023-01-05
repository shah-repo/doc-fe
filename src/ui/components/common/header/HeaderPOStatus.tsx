import classNames from "classnames";
import React from "react";
import { POStatusType } from "../../../../state/ducks/documentRevisions/types";
import Text from "../../../../ui/components/Text";
import useStyles from "./HeaderPOStatus.styles";
import { StyledPOStatusButton } from "./HeaderPOStatusButton";
import { getPOStatusLabel } from "./Helpers";

interface Props {
  poStatus: POStatusType;
}

const HeaderPOStatus: React.FC<Props> = ({ poStatus }) => {
  const classes = useStyles();

  return (
    <StyledPOStatusButton type="submit" color="primary" disableRipple>
      <div className={classNames(classes.statusIcon,  classes[poStatus])} />
      <Text message={getPOStatusLabel(poStatus)}/>
    </StyledPOStatusButton>
  );
};

export default HeaderPOStatus;
