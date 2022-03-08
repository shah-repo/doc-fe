import { Box, Collapse, IconButton, List, ListItem, ListItemText } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React from "react";
import { ReactComponent as FavoriteIcon } from "../../../../../../../assets/images/favorite.svg";
import { ReactComponent as SectionIcon } from "../../../../../../../assets/images/section.svg";
import { FBData } from "../../../../../../../ui/form.builder";

const ListPanel: React.FunctionComponent = () => {
  const [open, setOpen] = React.useState(true);
  const handleClick = () => {
    setOpen(!open);
  };
  const createList = () => (FBData.leftPanelSectionList.map((tab) => (<><ListItem button onClick={handleClick}
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0px 10px 0px 5px",
      width: "300px",
      height: "50px",
      background: "white",
      boxShadow: "0px 1px 0px #CCD4D9",
      borderTop: "1px solid #CCD4D9", // I aaded this need to check if required and put conditional
      // 0px 1px 0px #CCD4D9
    }}
  >
    <ListItemText primary={tab.tab}
      style={{
        fontFamily: "Sora",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "12px",
        lineHeight: "15px",
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        textTransform: "uppercase",
        color: "#080B11",
        flex: "none",
        order: 0,
        flexGrow: 0,
        margin: "0px 10px",
        paddingTop: "10px",

      }} />
    {open ? <ExpandMore /> : <ExpandLess />}
  </ListItem>
  <Collapse in={open} timeout="auto" unmountOnExit>
    <Box style={{
      background: "#EBEDF2",
      // width: "270px",
      boxShadow: "0px 1px 0px #C8CACF",
      // height: "483px",
      padding: "15px",
    }}>
      <List style={{
        padding: 0,
        background: "#E5E5E5",

      }}>
        {tab.subTab.map((stab) => (<>
          <ListItem
            style={{
              padding: "3px",
              height: "48px",
              width: "269px",
              background: "white",
              border: "1px solid #CCD4D9",
              borderRadius: "3px",
              marginBottom: "8px",
            }}
            // secondaryAction={<IconButton edge="end" disableRipple={true}>
            //   <DeleteIcon />
            // </IconButton>}
          >
            <IconButton disableRipple={true}>
              <SectionIcon />
            </IconButton>
            <ListItemText
              primary={stab.tab}
              // secondary={secondary ? "Secondary text" : null}
              primaryTypographyProps={{
                // fontFamily: "Sora",
                // fontSize: "14px",
                // fontStyle: "normal",
                // fontWeight: "normal",
                // lineHeight: "18px",
                // letterSpacing: "0px",
                // textAlign: "left",
                // marginLeft: "6px",
              }} />
            <IconButton edge="end" disableRipple={true}>
              <FavoriteIcon/>
            </IconButton>
          </ListItem></>)
        )}

      </List>

    </Box>
  </Collapse></>
  )
  ));
  return (
    <>
      <List>
        {createList()}
      </List>
    </>
  );
};

export default ListPanel;
