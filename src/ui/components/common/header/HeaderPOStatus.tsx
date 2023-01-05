import classNames from "classnames";
import React from "react";
import { POStatusType } from "../../../../state/ducks/documentRevisions/types";
import Text from "../../../../ui/components/Text";
import useStyles from "./HeaderPOStatus.styles";
import { StyledPOStatusButton } from "./HeaderPOStatusButton";

interface Props {
  poStatus?: POStatusType;
}

const HeaderPOStatus: React.FC<Props> = ({ poStatus }) => {
  const classes = useStyles();
  const statusIcon =
    <div className={classNames(classes.statusIcon, {
      [classes.openStatusIcon]: POStatusType.OPEN === poStatus,
      [classes.closeStatusIcon]: POStatusType.CLOSE === poStatus,
      [classes.voidStatusIcon]: POStatusType.VOID === poStatus,
    })} />;

  return (
    <StyledPOStatusButton type="submit" color="primary" disableRipple>
      <>{statusIcon}</>
      <Text message={poStatus}/>
    </StyledPOStatusButton>
  );
};

export default HeaderPOStatus;
