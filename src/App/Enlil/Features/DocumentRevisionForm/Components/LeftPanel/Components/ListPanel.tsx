import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem, ListItemText, Typography,
} from "@material-ui/core";
import { ChevronRight, ExpandMore } from "@material-ui/icons";
import { cloneDeep, each, flatMap } from "lodash";
import React from "react";
import { ReactComponent as FavoriteIcon } from "../../../../../../../assets/images/favorite.svg";
import { ReactComponent as Approvals } from "../../../../../../../assets/images/leftPanel/approvals.svg";
import { ReactComponent as AutoCompleteIcon } from "../../../../../../../assets/images/leftPanel/auto_complete.svg";
import { ReactComponent as BlankTplformIcon } from "../../../../../../../assets/images/leftPanel/blank_t_pl_form.svg";
import { ReactComponent as CheckboxIcon } from "../../../../../../../assets/images/leftPanel/checkbox_group.svg";
import { ReactComponent as CheckPointIcon } from "../../../../../../../assets/images/leftPanel/check_point.svg";
import { ReactComponent as DatePickerIcon } from "../../../../../../../assets/images/leftPanel/date_picker.svg";
import { ReactComponent as EquipmentIcon } from "../../../../../../../assets/images/leftPanel/equipment.svg";
import { ReactComponent as FileuploadIcon } from "../../../../../../../assets/images/leftPanel/fileupload.svg";
import { ReactComponent as HyperlinkIcon } from "../../../../../../../assets/images/leftPanel/hyperlink.svg";
import { ReactComponent as ParagraphIcon } from "../../../../../../../assets/images/leftPanel/paragraph.svg";
import { ReactComponent as POApprovalMatrixIcon } from "../../../../../../../assets/images/leftPanel/po_approval_matrix.svg";
import { ReactComponent as ProcedureIcon } from "../../../../../../../assets/images/leftPanel/procedure.svg";
import { ReactComponent as QuantityIcon } from "../../../../../../../assets/images/leftPanel/quantity.svg";
import { ReactComponent as RadiogroupIcon } from "../../../../../../../assets/images/leftPanel/radio_group.svg";
import { ReactComponent as SectionIcon } from "../../../../../../../assets/images/leftPanel/section.svg";
import { ReactComponent as SelectIcon } from "../../../../../../../assets/images/leftPanel/select.svg";
import { ReactComponent as StepsectionIcon } from "../../../../../../../assets/images/leftPanel/step_section.svg";
import { ReactComponent as SubsectionIcon } from "../../../../../../../assets/images/leftPanel/sub_section.svg";
import { ReactComponent as SupplierIcon } from "../../../../../../../assets/images/leftPanel/supplier.svg";
import { ReactComponent as TextfieldwithrangeIcon } from "../../../../../../../assets/images/leftPanel/textfield_with_range.svg";
import { ReactComponent as TextEditorIcon } from "../../../../../../../assets/images/leftPanel/text_editor.svg";
import { ReactComponent as TextfieldIcon } from "../../../../../../../assets/images/leftPanel/text_field.svg";
import { ReactComponent as TimerIcon } from "../../../../../../../assets/images/leftPanel/timer.svg";
import { ReactComponent as StarIcon } from "../../../../../../../assets/images/starIcon.svg";
import Text from "../../../../../../../ui/components/Text";
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
  const [listData, setListData] = React.useState<any>([]);
  React.useEffect(() => {
    setListData(createPickerState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const IconMapping = {
    section: <SectionIcon/>,
    subsection: <SubsectionIcon/>,
    stepsection: <StepsectionIcon/>,
    textfield: <TextfieldIcon/>,
    checkboxgroup: <CheckboxIcon/>,
    autocomplete: <AutoCompleteIcon/>,
    texteditor: <TextEditorIcon/>,
    datepicker: <DatePickerIcon/>,
    hyperlink: <HyperlinkIcon/>,
    select: <SelectIcon/>,
    radiogroup: <RadiogroupIcon/>,
    paragraph: <ParagraphIcon/>,
    fileupload: <FileuploadIcon/>,
    blanktplform: <BlankTplformIcon/>,
    quantity: <QuantityIcon/>,
    timer: <TimerIcon/>,
    poApprovalMatrix: <POApprovalMatrixIcon/>,
    instructionsmediaupload: <FileuploadIcon/>,
    evidencemediaupload: <FileuploadIcon/>,
    procedure: <ProcedureIcon/>,
    mpiprocedure: <ProcedureIcon/>,
    eqmaintenance: <EquipmentIcon/>,
    textfieldwithrange: <TextfieldwithrangeIcon/>,
    supplier: <SupplierIcon/>,
    lhrstep: <StepsectionIcon/>,
    approvals: <Approvals/>,
    // TODO: Check Custom Control
    // customcontrol: <FileuploadIcon/>,
    instructionsdocument: <ProcedureIcon/>,
    selectdocument: <SelectIcon/>,
    checkpoint: <CheckPointIcon/>,
    createlabel: <CheckPointIcon/>,
    task: <CheckPointIcon/>,
    // TODO: Check Custom Control
    // action: <FileuploadIcon/>,
  };

  // Create picker List to show Icon
  /*
            Expected Response object
            [{"tab": "Favourite",
                "subTab": [{
                    "tab": "Section",
                    icon: "",
                    "isFavorite": true
                  },
                  {
                    "tab": "Text",
                    icon: "",
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
      each(value, function(val: string, k) {
        subTabList.push({
          tab: val,
          icon: IconMapping[val],
          isFavorite: k % 2 === 0 ? true : false,
        });
        if (k % 2 === 0 ? true : false) {
          isFavourite.push({
            tab: val,
            icon: IconMapping[val],
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
          <ListItemText key={tab.tab}>
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
                      {stab.icon}
                    </IconButton>
                    <ListItemText key={stab.tab}>
                      <Typography className={classes.listSubItem}>
                        <Text message={`form.builder.${stab.tab}`} />
                      </Typography>
                    </ListItemText>
                    <IconButton disableRipple={true}>
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

  const resetSearch = () => {
    const actualResponeList = cloneDeep(listData);
    listData.dataList = actualResponeList.dataList;
    listData.favouriteList = actualResponeList.favouriteList;
    setListData(listData);
  };

  const onSearch = (event) => {
    let searchString = event.target.value?.trim().toLowerCase();
    searchString = searchString.replaceAll(" ", "");
    if (!searchString) {
      resetSearch();
      return;
    }
    listData.dataList = listData.dataList.filter((item) =>
      (item.subTab = item.subTab.filter((tab) =>
        tab.tab.toLowerCase().indexOf(searchString) > -1)))
      .filter((item) => item.subTab.length);
    listData.favouriteList = listData.favouriteList.filter((item) =>
      (item.subTab = item.subTab.filter((tab) =>
        tab.tab.toLowerCase().indexOf(searchString) > -1)))
      .filter((item) => item.subTab.length);
    setListData(listData);
  };

  return (
    <>
      <Box
        padding="10px 0px 20px 0px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <SearchBox onSearch={onSearch}/>
      </Box>
      <Box height="calc(100vh - 220px)" overflow="auto">
        <List>
          {listData.favouriteList && createList(listData.favouriteList)}
          {listData.dataList && createList(listData.dataList)}
        </List>
      </Box>
    </>
  );
};

export default withFBControlPicker(ListPanel);
