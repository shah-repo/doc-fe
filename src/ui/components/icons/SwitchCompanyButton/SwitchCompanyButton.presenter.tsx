import React from "react";
import Text from "../../Text";
import styles from "./SwitchCompanyButton.styles";

interface SwitchCompanyButtonProps {
  handleClick: () => void;
}

const SwitchCompanyButton: React.FunctionComponent<SwitchCompanyButtonProps> = ({ handleClick }) => {
  const classes = styles();
  return (
    <div
      className={classes.switchButton}
      onClick={handleClick}
    >
      <span className={classes.switchButtonText}>
        <Text translation="company.switch.company" />
      </span>
    </div>
  );
};

export default SwitchCompanyButton;
