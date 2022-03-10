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
import { each, flatMap } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
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
  const intl = useIntl();
  const classes = styles();
  const [open, setOpen] = React.useState<any>({ favourite: true });
  const IconMapping = {
    section: <SectionIcon />,
    subsection: <SubsectionIcon />,
    stepsection: <StepsectionIcon />,
    textfield: <TextfieldIcon />,
    checkboxgroup: <CheckboxIcon />,
    autocomplete: <AutoCompleteIcon />,
    texteditor: <TextEditorIcon />,
    datepicker: <DatePickerIcon />,
    hyperlink: <HyperlinkIcon />,
    select: <SelectIcon />,
    radiogroup: <RadiogroupIcon />,
    paragraph: <ParagraphIcon />,
    fileupload: <FileuploadIcon />,
    blanktplform: <BlankTplformIcon />,
    quantity: <QuantityIcon />,
    timer: <TimerIcon />,
    poApprovalMatrix: <POApprovalMatrixIcon />,
    instructionsmediaupload: <FileuploadIcon />,
    evidencemediaupload: <FileuploadIcon />,
    procedure: <ProcedureIcon />,
    mpiprocedure: <ProcedureIcon />,
    eqmaintenance: <EquipmentIcon />,
    textfieldwithrange: <TextfieldwithrangeIcon />,
    supplier: <SupplierIcon />,
    lhrstep: <StepsectionIcon />,
    approvals: <Approvals />,
    // TODO: Check Custom Control
    // customcontrol: <FileuploadIcon/>,
    instructionsdocument: <ProcedureIcon />,
    selectdocument: <SelectIcon />,
    checkpoint: <CheckPointIcon />,
    createlabel: <CheckPointIcon />,
    task: <CheckPointIcon />,
    // TODO: Check Custom Control
    // action: <FileuploadIcon/>,
  };
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
          icon: IconMapping[val],
          isFavorite: k % 2 === 0 ? true : false,
        });
        if (k % 2 === 0 ? true : false) {
          isFavourite.push({
            tab: val,
            label,
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

  const createFavouriteList = (data) => {
    const fav: any = [];
    data.forEach(function(o: any) {
      fav.push(o.isFavourite);
    });
    return fav;
  };

  const [listData, setListData] = React.useState<any>(createPickerState());

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
              <Text message={tab.label} />
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
                    <IconButton disableRipple={true}>{stab.icon}</IconButton>
                    <ListItemText key={stab.tab}>
                      <Typography className={classes.listSubItem}>
                        <Text message={stab.label} />
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

  return (
    <>
      <Box
        padding="10px 0px 20px 0px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <SearchBox onSearch={searchItem} />
      </Box>
      <List
        style={{
          height: "calc(100vh - 235px)",
          overflowY: "auto",
          width: "99.8%",
        }}
      >
        {listData.favouriteList.length > 0 && createList(listData.favouriteList)}
        {listData.dataList.length > 0 && createList(listData.dataList)}
      </List>
    </>
  );
};

export default withFBControlPicker(ListPanel);
