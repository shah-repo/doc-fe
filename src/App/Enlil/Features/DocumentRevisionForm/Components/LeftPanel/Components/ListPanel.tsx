import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem, ListItemText, Typography,
} from "@material-ui/core";
import { ChevronRight, ExpandMore } from "@material-ui/icons";
import { each, flatMap } from "lodash";
import React from "react";
import { ReactComponent as FavoriteIcon } from "../../../../../../../assets/images/favorite.svg";
import { ReactComponent as SectionIcon } from "../../../../../../../assets/images/section.svg";
import { ReactComponent as StarIcon } from "../../../../../../../assets/images/starIcon.svg";
import Text from "../../../../../../../ui/components/Text";
import { FBControlPickerProps } from "../../../../../../../ui/form.builder/FBControlPicker/FBControlPicker.types";
import { withFBControlPicker } from "../../../../../../../ui/form.builder/FBControlPicker/FBControlPicker.wrap";
import styles from "./ListPanel.styles";

const ListPanel: React.FunctionComponent<FBControlPickerProps> = ({
  controlPickerState,
  pickers = [],
  index = 0,
  openEditor,
}) => {
  const [listData, setListData] = React.useState<any>([]);
  React.useEffect(() => {
    setListData(createPickerState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create picker List to show Icon
  /*
            Expected Response object
            [{"tab": "Favourite",
                "subTab": [{
                    "tab": "Section",
                    "isFavorite": true
                  },
                  {
                    "tab": "Text",
                    "isFavorite": true
                  }] }]
  */
  const createPickerState = () => {
    const data: any = [];
    each(pickers, function(value, key) {
      const newObj = { tab: "", editors: [], subTab: [], isFavourite: [] };
      newObj.tab = key;
      newObj.editors = value;
      const subTabList: any = [];
      const isFavourite: any = [];
      each(value, function(val, k) {
        subTabList.push({
          tab: val,
          isFavorite: k % 2 === 0 ? true : false,
        });
        if (k % 2 === 0 ? true : false) {
          isFavourite.push({
            tab: val,
            isFavorite: true,
          });
        }
      });
      newObj.subTab = subTabList;
      newObj.isFavourite = isFavourite;
      data.push(newObj);
    });
    const favList = createFavouriteList(data);
    return {
      dataList: data,
      favouriteList: [{ tab: "favorites", subTab: flatMap(favList) }],
    };
  };

  const createFavouriteList = (data) => {
    const fav: any = [];
    data.forEach(function(o: any) {
      fav.push(o.isFavourite);
    });
    return fav;
  };

  const classes = styles();
  const [open, setOpen] = React.useState<any>({ favourite: true });
  const handleClick = (selectedTab) => {
    setOpen({ [selectedTab]: !open[selectedTab] });
  };

  const createList = (data) =>
    data.map((tab) => (
      <>
        <ListItem
          button
          onClick={() => {
            handleClick(tab.tab);
          }}
          style={tab.tab === "favorites" ? { borderTop: 0 } : {}}
          className={classes.listItemBtn}
        >
          <ListItemText>
            {/* <FBLabel label={`form.builder.${tab.tab}`} /> */}
            <Typography className={classes.listItemText}>
              <Text message={`form.builder.${tab.tab}`} />
            </Typography>
          </ListItemText>
          {open[tab.tab] ? <ExpandMore /> : <ChevronRight />}
        </ListItem>
        <Collapse in={open[tab.tab]} timeout="auto" unmountOnExit>
          <Box className={classes.outerBox}>
            <List className={classes.listStyle}>
              {tab.subTab.map((stab) => (
                <>
                  <ListItem className={classes.listItemStyle}>
                    <IconButton disableRipple={true}>
                      <SectionIcon />
                    </IconButton>
                    <ListItemText
                      primary={stab.tab}
                      // primaryTypographyProps={{
                      // fontFamily: "Sora",
                      // fontSize: "14px",
                      // fontStyle: "normal",
                      // fontWeight: "normal",
                      // lineHeight: "18px",
                      // letterSpacing: "0px",
                      // textAlign: "left",
                      // marginLeft: "6px",
                      // }}
                    />
                    {/* <ListItemText>
              {controlPickerState?.picker(stab.tab, index)}
              {!controlPickerState?.picker(stab.tab, index) && (
                <FBButton
                  color="default"
                  label={`form.builder.${stab.tab as string}`}
                  dataCy={`form.builder.${stab.tab as string}`}
                  onClick={openEditor && openEditor({ type: stab.tab, index })}
                />
              )}
            </ListItemText> */}
                    <IconButton edge="end" disableRipple={true}>
                      {stab.isFavorite ? <FavoriteIcon /> : <StarIcon />}
                    </IconButton>
                  </ListItem>
                </>
              ))}
            </List>
          </Box>
        </Collapse>
      </>
    ));
  return (
    <List>
      {listData.favouriteList && createList(listData.favouriteList)}
      {listData.dataList && createList(listData.dataList)}
    </List>
  );
};

export default withFBControlPicker(ListPanel);
