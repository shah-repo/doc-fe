import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import React from "react";
import { ReactComponent as ExistingAR } from "../../../../../assets/images/existing_ar.svg";
import { ReactComponent as NewARIcon } from "../../../../../assets/images/new_ar.svg";
import { SplitButton, SplitButtonMenu } from "../../../../components/forms/fields-next";
import Text from "../../../../components/Text";
import useMenu from "../../../../hooks/useMenu";

export enum ARActions {
  NEW = "new",
  EXISTING = "existing"
}

const options = [
  {
    label: "releaseButton.option.newAR",
    value: ARActions.NEW,
    icon: <NewARIcon />,
  },
  {
    label: "releaseButton.option.existingAR",
    value: ARActions.EXISTING,
    icon: <ExistingAR />,
  },
];

const SplitReleaseButton: React.FunctionComponent<{
  className?: string;
  disableExpessAR?: boolean;
  onClick: (value?: ARActions) => void;
}> = ({
  className,
  disableExpessAR,
  onClick,
}) => {
  const releaseMenu = useMenu();

  const handleClick = (option?: ARActions) => () => onClick(option);

  return (
    <SplitButton
      className={className}
      buttonText="releaseButton.option.expressAR"
      onClick={handleClick()}
      onToggle={releaseMenu.open}
      kind="white"
      buttonProps={{
        "disabled": disableExpessAR,
        "id": "ApproveAndRelease-button",
        "data-cy": "ApproveAndRelease-button",
      }}
      toggleProps={{
        "data-cy": "dropdown-arrow",
      }}
    >
      <SplitButtonMenu
        anchorEl={releaseMenu.anchor}
        onClose={releaseMenu.close}
      >
        {options.map((option, index) => (
          <MenuItem
            divider
            key={option.value}
            data-cy={`ar-${option.value}`}
            onClick={handleClick(option.value)}
          >
            <ListItemIcon>{option.icon}</ListItemIcon>
            <ListItemText><Text message={option.label} /></ListItemText>
          </MenuItem>
        ))}
      </SplitButtonMenu>
    </SplitButton>
  );
};

export default SplitReleaseButton;
