import { Box, FormControl, IconButton, ListItemText, makeStyles, Menu, MenuItem, Typography } from "@material-ui/core";
import React from "react";
import { ReactComponent as ViewGridIcon } from "../../../../assets/images/grid_view.svg";
import { ReactComponent as SolidIcon } from "../../../../assets/images/view.svg";
import { ReactComponent as ViewChecked } from "../../../../assets/images/view_checked.svg";

interface Props {
  columnDefinition: any;
  onChange: (colum: any) => void;
  restrictedColumns: string[];
}

const ColumnShowHideMenu: React.FunctionComponent<Props> = ({
  columnDefinition,
  onChange,
  restrictedColumns,
}) => {
  const styles = makeStyles(() => ({
    columnsCus: {
      fontFamily: "Sora",
      fontWeight: "bold",
      fontSize: "14px",
    },
  }));
  const classes = styles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <FormControl variant="outlined">
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <ViewGridIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        <MenuItem>
          <ListItemText
            primary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.columnsCus}
                  color="textPrimary"
                >
            Columns
                </Typography>
              </>
            }
          ></ListItemText>
        </MenuItem>
        {columnDefinition.map((item: any) =>
          !restrictedColumns.includes(item.field) ? (
            <MenuItem key={item.title} value={item.field}>
              <ListItemText id={item.field} primary={item.title} />
              <Box flexGrow={1} mr={5}></Box>
              {item.show ? (
                <SolidIcon
                  onClick={() => {
                    onChange(item);
                  }}
                />
              ) : (
                <ViewChecked
                  onClick={() => {
                    onChange(item);
                  }}
                />
              )}
            </MenuItem>
          ) : null
        )}
      </Menu>
    </FormControl>
  );
};

export default ColumnShowHideMenu;
