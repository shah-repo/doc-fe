import classNames from "classnames";
import React from "react";
import Text from "../../../../ui/components/Text";
import useStyles from "./HeaderPOStatus.styles";
import { StyledPOStatusButton } from "./HeaderPOStatusButton";

interface Props {
  status?: string;
}

const HeaderPOStatus: React.FC<Props> = ({ status }) => {
  const classes = useStyles();
  const statusIcon =
    <div className={classNames(classes.statusIcon, {
      [classes.openStatusIcon]: true,
    })} />;

  return (
    <StyledPOStatusButton type="submit" color="primary">
      <>{statusIcon}</>
      <Text message="Open"/>
    </StyledPOStatusButton>
  );
};

export default HeaderPOStatus;
