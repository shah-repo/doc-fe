import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { ChevronRight, ExpandMore } from "@material-ui/icons";
import { each } from "lodash";
import React from "react";
import Text from "../../../../../../../ui/components/Text";
import {
  FB,
  FBInputType,
  FBLeftPanelEditorState,
  FBMapWrapper,
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
  const classes = styles();
  const { leftPanelDialogState } = FB.useStores();
  index = leftPanelDialogState?.getIndex || 0;
  const [open, setOpen] = React.useState<any>({});
  const [filteredData, setFilteredData] = React.useState<any>(pickers);

  const handleClick = (section) => {
    setOpen({ [section]: !open[section] });
  };

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
            className={`${classes.listItemBtn} ${ section === "section" ? "firstItem" : ""}`}
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
                        onClick={
                          openEditor && openEditor({ type: picker.key, index })
                        }
                        disableGutters
                      >
                        <IconButton
                          disableRipple={true}
                          className={classes.iconBtn}
                        >
                          {FBLeftPanelEditorState.editorTypeIconMapping[
                            picker.key
                          ] &&
                            React.createElement(
                              FBLeftPanelEditorState.editorTypeIconMapping[
                                picker.key
                              ]
                            )}
                        </IconButton>
                        <ListItemText key={index} data-cy={picker.label}>
                          <Typography className={classes.listSubItem}>
                            {picker.label}
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

  const search = (event) => {
    const filteredData = {};
    const searchString = event?.target?.value;
    if (!searchString) {
      setOpen({});
      setFilteredData(pickers);
    }
    each(Object.keys(pickers), (value) => {
      const filteredList = pickers[value]
        .filter((el) =>
          el.label.toLowerCase().includes(searchString.toLowerCase())
        )
        .map((el) => ({ key: el.key, label: el.label }));
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
    <Box>
      <Box className={classes.searchBox}>
        <SearchBox onSearch={search} />
      </Box>
      <List className={classes.list}>
        {Object.keys(filteredData).length > 0 && createList()}
        {renderNoSearchResults}
      </List>
    </Box>
  );
};

export default withFBControlPicker(ListPanel);
