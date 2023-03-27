import classNames from "classnames";
import React from "react";
import { POStatusLabelMapping, POStatusType } from "../../../../state/ducks/documentRevisions/types";
import Text from "../../../../ui/components/Text";
import useStyles from "./HeaderPOStatus.styles";
import { StyledPOStatusButton } from "./HeaderPOStatusButton";

interface Props {
  poStatus: POStatusType;
}

const HeaderPOStatus: React.FC<Props> = ({ poStatus }) => {
  const classes = useStyles();

  return (
    <StyledPOStatusButton type="submit" color="primary" disableRipple>
      <div data-cy={`po-status-button-${poStatus}`} className={classNames(classes.statusIcon,
        classes[poStatus])} />
      <Text message={POStatusLabelMapping[poStatus]}/>
    </StyledPOStatusButton>
  );
};

export default HeaderPOStatus;
