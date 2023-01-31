import { Button, ClickAwayListener, Grid, Grow, MenuItem, MenuList, Paper, Popper } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import React from "react";
import { StyledButtonGroup } from "../../../../../App/Shifamed/Components/forms/presenters/StyledButtonGroup";
import { ReactComponent as ExistingAR } from "../../../../../assets/images/existingAR.svg";
import { ReactComponent as NewARIcon } from "../../../../../assets/images/newAR.svg";
import Text from "../../../../components/Text";

export enum ARActions {
  NEW = "new",
  EXISTING = "existing"
}

const options = [{ label: "releaseButton.option.newAR", value: ARActions.NEW, icon: <NewARIcon />  },
  { label: "releaseButton.option.existingAR", value: ARActions.EXISTING, icon: <ExistingAR />  }];

const SplitReleaseButton: React.FunctionComponent<{
  onClick: (value?: string) => void;
}> = ({
  onClick,
}) => {

  const [isOpened, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleClick = () => {
    onClick();
  };

  const handleMenuItemClick = (event, index) => {
    onClick(options[index].value);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <StyledButtonGroup variant="contained" disableRipple color="primary"
          ref={anchorRef} aria-label="Release options">
          <Button
            color="primary"
            onClick={handleClick}
            id="ApproveAndRelease-button"
            data-cy="ApproveAndRelease-button"
          >
            <Text translation="releaseButton.option.expressAR" />
          </Button>
          <Button
            color="primary"
            size="small"
            aria-controls={isOpened ? "split-button-menu" : undefined}
            aria-expanded={isOpened}
            aria-label="Select AR strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </StyledButtonGroup>
        <Popper open={isOpened} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {options.map((option, index) => (
                      <MenuItem
                        key={option.value}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        <span style={{ paddingRight: "15px" }}>{option.icon}</span>
                        <Text message={option.label} />
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
};

export default SplitReleaseButton;
