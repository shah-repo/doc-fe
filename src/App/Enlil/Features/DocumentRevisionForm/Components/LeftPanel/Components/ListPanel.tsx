import {
  Box,
  Collapse,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { ChevronRight, ExpandMore } from "@material-ui/icons";
import { each } from "lodash";
import { Observer } from "mobx-react";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { ReactComponent as FavoriteIcon } from "../../../../../../../assets/images/favorite.svg";
import { ReactComponent as StarIcon } from "../../../../../../../assets/images/starIcon.svg";
import Text from "../../../../../../../ui/components/Text";
import {
  FB, FBEditorState, FBInputType, FBMapWrapper,
} from "../../../../../../../ui/form.builder";
import {
  FBControlPickerDataProps,
  FBControlPickerProps,
} from "../../../../../../../ui/form.builder/FBControlPicker/FBControlPicker.types";
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
  const { leftPanelState } = FB.useStores();
  index = leftPanelState?.getIndex || 0;
  const [open, setOpen] = React.useState<any>({});
  const [searchString, setSearchText] = React.useState<any>({});
  const [filteredData, setFilteredData] = React.useState<any>(pickers);
  useEffect(() => {
    setFilteredData(pickers);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlPickerState?.loading]);

  const handleClick = (section) => {
    setOpen({ [section]: !open[section] });
  };
  const addFavourite = (type) => {
    controlPickerState?.addFavourite(type);
  };
  const removeFavourite = (id) => {
    controlPickerState?.removeFavourite(id);
  };

  const openSectionOnSearch = () => searchString.length > 0;
  const createList = () => (
    <FBMapWrapper<FBControlPickerDataProps> collection={filteredData}>
      {(editors, section) => (
        <Box key={`fb-controlpicker-section-${section}`}>
          <ListItem
            key={section}
            button
            onClick={() => {
              handleClick(section);
            }}
            data-cy={intl.formatMessage({ id: `form.builder.${section}` }) + "-btn"}
            className={`${classes.listItemBtn} ${ section === "section" ? "firstItem" : ""}`}
          >
            <ListItemText key={section}>
              <Typography className={classes.listItemText}
                data-cy={intl.formatMessage({ id: `form.builder.${section}` })}>
                <Text message={`form.builder.${section}`} />
              </Typography>
            </ListItemText>
            {open[section] || openSectionOnSearch() ? <ExpandMore /> : <ChevronRight />}
          </ListItem>
          <Collapse
            in={open[section] || openSectionOnSearch()}
            timeout="auto"
            unmountOnExit
            className={classes.collapseRoot}
          >
            <FBMapWrapper<FBInputType> collection={editors}>
              {(picker, i) => (
                <Box
                  component="div"
                  key={`fb-controlpicker-editor-${picker.label}-${i}`}
                  className={classes.outerBox}
                >
                  <List className={classes.listStyle}>
                    {controlPickerState?.picker(picker.key, index)}
                    {!controlPickerState?.picker(picker.key, index) && (
                      <ListItem
                        key={index}
                        className={`${classes.listItemStyle} ${
                          editors.length - 1 === i ? "lastItem" : ""
                        }`}
                        disableGutters
                      >
                        <IconButton
                          disableRipple={true}
                          className={classes.iconBtn}
                          onClick={
                            openEditor &&
                            openEditor({ type: picker.key, index })
                          }
                        >
                          {FBEditorState.editorTypeIconMapping[
                            picker.key
                          ] && React.createElement(
                            FBEditorState.editorTypeIconMapping[
                              picker.key
                            ])}
                          {!FBEditorState.editorTypeIconMapping[
                            picker.key
                          ] && React.createElement(
                            FBEditorState.editorTypeIconMapping.default
                          )}
                        </IconButton>
                        <ListItemText key={index} data-cy={picker.label}
                          onClick={
                            openEditor &&
                            openEditor({ type: picker.key, index })
                          }
                        >
                          <Typography className={classes.listSubItem}>
                            {picker.label}
                          </Typography>
                        </ListItemText>
                        <IconButton disableRipple={true}>
                          {picker.isFavorite ? (
                            <FavoriteIcon
                              onClick={() => removeFavourite(picker.id)}
                            />
                          ) : (
                            <StarIcon
                              onClick={() => addFavourite(picker.key)}
                            />
                          )}
                        </IconButton>
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

  const search = (event) => {
    const filteredData = {};
    const searchString = event?.target?.value;
    setSearchText(searchString);
    if (!searchString) {
      setOpen({});
      setFilteredData(pickers);
    }
    each(Object.keys(pickers), (value) => {
      const filteredList = pickers[value]
        .filter((el) =>
          el.label.toLowerCase().includes(searchString.toLowerCase())
        );
      if (filteredList.length) {
        filteredData[value] = filteredList;
      }
    });
    setFilteredData(filteredData);
  };

  const renderNoSearchResults = Object.keys(filteredData).length === 0 && (
    <Typography variant="caption">
      <Text translation="table.no.results.found" />
    </Typography>
  );

  return (
    <Box className={classes.root}>
      <Box className={classes.searchBox}>
        <SearchBox onSearch={search} />
      </Box>
      <Observer>
        {() => (
          <>
            {controlPickerState?.loading && (
              <Box width="100%" pt={1}>
                <LinearProgress style={{ width: "100%" }} />
              </Box>
            )}
          </>
        )}
      </Observer>
      <List className={classes.list}>
        {Object.keys(filteredData).length > 0 && createList()}
        {renderNoSearchResults}
      </List>
    </Box>
  );
};

export default withFBControlPicker(ListPanel);
