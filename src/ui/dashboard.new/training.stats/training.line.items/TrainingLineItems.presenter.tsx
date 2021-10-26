import { Grid, List, Tab, Tabs } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
// import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import React from "react";
import TrainingItem from "./TrainingItem";
import { styles } from "./TrainingLineItems.styles";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  panelData: {
    id: string;
    title: string;
    avatar: string;
    user: string;
    type: string;
    documentId: string;
    status: string;
    verbose: string;
    timestamp: string;
    approvers: string[];
  }[];
}

const TabPanel: React.FunctionComponent<TabPanelProps> = ({ children, value, index, panelData, ...other }) => {
  const classes = styles();
  const renderItems = () => (
    <List className={classes.listRoot}>
      {panelData.map((data, index) => (
        <TrainingItem
          key={data.id}
          avatar={data.avatar}
          firstName={data.user}
          status={data.status}
          documentId={data.documentId}
          title={data.title}
          date={data.timestamp}/>
      ))}
    </List>);


  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Grid container={true} spacing={5}>
        <Grid item={true} sm={12}>
          {renderItems()}
        </Grid>
      </Grid>
    </div>
  );
};

function a11yProps(index: any) {
  return {
    "id": `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

interface TrainingLineItemsProps {
  overdueItems: {
    id: string;
    title: string;
    avatar: string;
    user: string;
    type: string;
    documentId: string;
    status: string;
    verbose: string;
    timestamp: string;
    approvers: string[];
  }[];
  dueInSevenItems: {
    id: string;
    title: string;
    avatar: string;
    user: string;
    type: string;
    documentId: string;
    status: string;
    verbose: string;
    timestamp: string;
    approvers: string[];
  }[];
}

interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const StyledTabs = withStyles({
  indicator: {
    "display": "flex",
    "justifyContent": "center",
    "backgroundColor": "transparent",
    "top": "33px",
    "& > span": {
      width: "50%",
      backgroundColor: "#635ee7",
    },
  },
})((props: StyledTabsProps) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

// interface StyledTabProps {
//   label: string;
// }

// const StyledTab = withStyles((theme: Theme) =>
//   createStyles({
//     // root: {
//     //   "textTransform": "none",
//     //   "color": "#fff",
//     //   "fontWeight": theme.typography.fontWeightRegular,
//     //   "fontSize": theme.typography.pxToRem(15),
//     //   "marginRight": theme.spacing(1),
//     //   "&:focus": {
//     //     opacity: 1,
//     //   },
//     // },
//   }),
// )((props: StyledTabProps) => <Tab disableRipple {...props} />);

export default function TrainingLineItemsPresenter(props: TrainingLineItemsProps) {
  const { overdueItems, dueInSevenItems } = props;
  const all = overdueItems.concat(dueInSevenItems);
  const [value, setValue] = React.useState(0);

  const classes = styles();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <StyledTabs value={value} onChange={handleChange} aria-label="full width tabs example" >
        <Tab classes={{ root: classes.tab }} label={
          <Grid container={true} justify="center" alignItems="center">
            <Grid item={true} sm={12}>
              {/* { value === 0 && <span className={classes.allTab}></span> } */}
              <span className={classes.allTab}></span>
              <span className={classes.tabHeader}>ALL</span>
            </Grid>
          </Grid>
        } {...a11yProps(0)} />
        <Tab classes={{ root: classes.tab }} label={
          <Grid container={true} justify="center" alignItems="center">
            <Grid item={true} sm={12}>
              {/* { value === 1 && <span className={classes.dueInSevenTab}></span> } */}
              <span className={classes.dueInSevenTab}></span>
              <span className={classes.tabHeader} > DUE IN 7 DAYS</span>
            </Grid>
          </Grid>
        } {...a11yProps(1)} />
        <Tab classes={{ root: classes.tab }} label={
          <Grid container={true} justify="center" alignItems="center">
            <Grid item={true} sm={12}>
              {/* { value === 2 && <span className={classes.overdueTab}></span> } */}
              <span className={classes.overdueTab}></span>
              <span className={classes.tabHeader} > OVERDUE</span>
            </Grid>
          </Grid>
        } {...a11yProps(2)} />
      </StyledTabs>
      <TabPanel value={value} index={0} panelData={all}>
        ALL
      </TabPanel>
      <TabPanel value={value} index={1} panelData={dueInSevenItems}>
        DUE IN 7 DAYS
      </TabPanel>
      <TabPanel value={value} index={2} panelData={overdueItems}>
        OVERDUE
      </TabPanel>
    </div>
  );
}
