/* eslint-disable no-console */
import { Button, ClickAwayListener, Grid, Grow, MenuItem, MenuList, Paper, Popper } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import React from "react";
import { StyledButtonGroup } from "../../../../../App/Shifamed/Components/forms/presenters/StyledButtonGroup";
import Text from "../../../../components/Text";

export enum COActions {
  NEW = "new",
  EXISTING = "existing"
}


// TODO: move to translations
const options = [{ label: "New CO", value: COActions.NEW },
  { label: "Existing CO", value: COActions.EXISTING }];

const SplitReleaseButton: React.FunctionComponent<{
  onClick: (value?: string) => void;
}> = ({
  onClick,
}) => {

  // const classes = useStyles();

  const [open, setOpen] = React.useState(false);
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
        <StyledButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="Release options">
          <Button
            color="primary"
            onClick={handleClick}
            id="ExpressCO-button"
            data-cy="ExpressCO-button"
          >
            <Text message={"Express CO"} />
          </Button>
          <Button
            color="primary"
            size="small"
            aria-controls={open ? "split-button-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-label="Select CO strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </StyledButtonGroup>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
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
                        {option.label}
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
