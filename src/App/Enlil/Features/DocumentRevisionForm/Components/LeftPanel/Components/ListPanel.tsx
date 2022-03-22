import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography
} from "@material-ui/core";
import { ChevronRight, ExpandMore } from "@material-ui/icons";
import { each, flatMap } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
// import { ReactComponent as FavoriteIcon } from "../../../../../../../assets/images/favorite.svg";
// import { ReactComponent as StarIcon } from "../../../../../../../assets/images/starIcon.svg";
import Text from "../../../../../../../ui/components/Text";
import { FB, FBLeftPanelEditorState } from "../../../../../../../ui/form.builder";
import { FBControlPickerProps } from "../../../../../../../ui/form.builder/FBControlPicker/FBControlPicker.types";
import { withFBControlPicker } from "../../../../../../../ui/form.builder/FBControlPicker/FBControlPicker.wrap";
import styles from "./ListPanel.styles";
import SearchBox from "./SearchBox";

const ListPanel: React.FunctionComponent<FBControlPickerProps> = ({
  controlPickerState,
  pickers = [],
  index = 0,
  openEditor,
}) => {
  const intl = useIntl();
  const classes = styles();
  const { leftPanelDialogState } = FB.useStores();
  index =  leftPanelDialogState?.getIndex || 0;
  const [open, setOpen] = React.useState<any>({ favorites: true });
  const createPickerState = () => {
    const data: any = [];
    each(pickers, function(value, key) {
      const newObj = {
        tab: "",
        label: "",
        editors: [],
        subTab: [],
        isFavourite: [],
      };
      newObj.tab = key;
      newObj.label =
        intl.formatMessage({
          id: `form.builder.${key}`,
        }) || "";
      newObj.editors = value;
      const subTabList: any = [];
      const isFavourite: any = [];
      each(value, function(val: string, k) {
        const label =
          intl.formatMessage({
            id: `form.builder.${val}`,
          }) || "";
        subTabList.push({
          tab: val,
          label,
          icon: FBLeftPanelEditorState.editorTypeIconMapping[val],
          isFavorite: k % 2 === 0 ? true : false,
        });
        if (k % 2 === 0 ? true : false) {
          isFavourite.push({
            tab: val,
            label,
            icon: FBLeftPanelEditorState.editorTypeIconMapping[val],
            isFavorite: true,
          });
        }
      });
      newObj.subTab = subTabList;
      newObj.isFavourite = isFavourite;
      data.push(newObj);
    });
    // Favourate list code commented for now
    // const favList = createFavouriteList(data);
    const favList = [];
    const originalListData = { dataList: [], favouriteList: [] as any };
    originalListData.dataList = data;
    originalListData.favouriteList = [
      {
        tab: "favorites",
        label:
            intl.formatMessage({
              id: "form.builder.favorites",
            }) || "",
        subTab: flatMap(favList),
      },
    ];
    return originalListData;
  };

  // const createFavouriteList = (data) => {
  //   const fav: any = [];
  //   data.forEach(function(o: any) {
  //     fav.push(o.isFavourite);
  //   });
  //   return fav;
  // };

  const [listData, setListData] = React.useState<any>(createPickerState());

  const handleClick = (selectedTab) => {
    setOpen({ [selectedTab]: !open[selectedTab] });
  };

  const createList = (data) =>
    data.map((tab, k) => (
      <>
        <ListItem
          key={k}
          button
          onClick={() => {
            handleClick(tab.tab);
          }}
          style={tab.tab === "favorites" ? { borderTop: 0 } : {}}
          className={classes.listItemBtn}
        >
          <ListItemText key={tab.tab}>
            <Typography className={classes.listItemText}>
              <Text message={tab.label} />
            </Typography>
          </ListItemText>
          {open[tab.tab] ? <ExpandMore /> : <ChevronRight />}
        </ListItem>
        <Collapse in={open[tab.tab]} timeout="auto" unmountOnExit>
          <Box className={classes.outerBox}>
            <List className={classes.listStyle}>
              {tab.subTab.map((stab, sk) => (
                <ListItem
                  key={sk}
                  className={classes.listItemStyle}
                  onClick={
                    openEditor && openEditor({ type: stab.tab, index })
                  }
                >
                  <IconButton disableRipple={true}>{stab.icon && React.createElement(stab.icon)}</IconButton>
                  <ListItemText key={stab.tab}>
                    <Typography className={classes.listSubItem}>
                      <Text message={stab.label} />
                    </Typography>
                  </ListItemText>
                  {/* <IconButton disableRipple={true}>
                    {stab.isFavorite ? <FavoriteIcon /> : <StarIcon />}
                  </IconButton> */}
                </ListItem>
              ))}
            </List>
          </Box>
        </Collapse>
      </>
    ));

  const searchItem = (event) => {
    const searchString = event?.target?.value;
    const actualListData: any = createPickerState();
    if (!searchString) {
      setListData(actualListData);
      return;
    }
    const filteredListData = { dataList: [], favouriteList: [] };
    filteredListData.dataList = actualListData.dataList
      .filter(
        (item) =>
          (item.subTab = item.subTab.filter(
            (tab) => tab.label.toLowerCase().includes(searchString.toLowerCase())
          ))
      )
      .filter((item) => item.subTab.length);
    filteredListData.favouriteList = actualListData.favouriteList
      .filter(
        (item) =>
          (item.subTab = item.subTab.filter(
            (tab) => tab.label.toLowerCase().includes(searchString.toLowerCase())
          ))
      )
      .filter((item) => item.subTab.length);
    setListData(filteredListData);
  };

  const renderNoSearchResults = listData.dataList.length === 0 && (
    <Typography variant="caption">
      <Text translation="table.no.results.found" />
    </Typography>
  );

  return (
    <Box>
      <Box className={classes.searchBox}>
        <SearchBox onSearch={searchItem} />
      </Box>
      <List className={classes.list}>
        {/* {listData.favouriteList.length > 0 && createList(listData.favouriteList)} */}
        {listData.dataList.length > 0 && createList(listData.dataList)}
        { renderNoSearchResults }
      </List>
    </Box>
  );
};

export default withFBControlPicker(ListPanel);
