import {
  Box,
  Collapse,
  IconButton,
  // Collapse,
  // IconButton,
  List,
  ListItem,
  ListItemText,
  // ListItem,
  // ListItemText,
  Typography
} from "@material-ui/core";
import { ChevronRight, ExpandMore } from "@material-ui/icons";
import { each, flatMap } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
// import { ReactComponent as FavoriteIcon } from "../../../../../../../assets/images/favorite.svg";
// import { ReactComponent as StarIcon } from "../../../../../../../assets/images/starIcon.svg";
import Text from "../../../../../../../ui/components/Text";
import { FB, FBInputType, FBLeftPanelEditorState, FBMapWrapper } from "../../../../../../../ui/form.builder";
import { FBControlPickerDataProps, FBControlPickerProps } from "../../../../../../../ui/form.builder/FBControlPicker/FBControlPicker.types";
import { withFBControlPicker } from "../../../../../../../ui/form.builder/FBControlPicker/FBControlPicker.wrap";
import { Translation } from "../../../../../../../ui/translations/types";
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
  const [open, setOpen] = React.useState<any>({});
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

  const [listData, setListData] = React.useState<any>(createPickerState());

  const handleClick = (section) => {
    setOpen({ [section]: !open[section] });
  };

  const createList = () => {
    return (
      <FBMapWrapper<FBControlPickerDataProps> collection={pickers}>
        {(editors, section) => (
          <Box key={`fb-controlpicker-section-${section}`}>
            <ListItem
              key={section}
              button
              onClick={() => {
                handleClick(section);
              }}
              className={classes.listItemBtn}
            >
              <ListItemText key={section}>
                <Typography className={classes.listItemText}>
                  <Text message={`form.builder.${section}`} />
                </Typography>
              </ListItemText>
              {open[section] ? <ExpandMore /> : <ChevronRight />}
            </ListItem>
            <Collapse
              in={open[section]}
              timeout="auto"
              unmountOnExit
              className={classes.collapseRoot}
            >
              <FBMapWrapper<FBInputType> collection={editors}>
                {(picker, i) => (
                  <Box
                    component="div"
                    key={`fb-controlpicker-editor-${picker}-${i}`}
                    className={classes.outerBox}
                  >
                    <List className={classes.listStyle}>
                      {controlPickerState?.picker(picker, index)}
                      {!controlPickerState?.picker(picker, index) && (
                        <ListItem
                          key={index}
                          className={`${classes.listItemStyle} ${
                            editors.length - 1 === i ? "lastItem" : ""
                          }`}
                          onClick={
                            openEditor && openEditor({ type: picker, index })
                          }
                          disableGutters
                        >
                          <IconButton disableRipple={true} style={{ marginLeft: "3px" }}>
                            {FBLeftPanelEditorState.editorTypeIconMapping[
                              picker
                            ] &&
                              React.createElement(
                                FBLeftPanelEditorState.editorTypeIconMapping[
                                  picker
                                ]
                              )}
                          </IconButton>
                          <ListItemText key={index}>
                            <Typography className={classes.listSubItem}>
                              <Text translation={`form.builder.${picker}` as Translation} dataCy={`form.builder.${picker as string}`} />
                            </Typography>
                          </ListItemText>
                        </ListItem>
                      )}
                    </List>
                  </Box>
                )}
              </FBMapWrapper>
            </Collapse>
          </Box>
        )}
      </FBMapWrapper>
    );
  };

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
        {listData.dataList.length > 0 && createList()}
        { renderNoSearchResults }
      </List>
    </Box>
  );
};

export default withFBControlPicker(ListPanel);
