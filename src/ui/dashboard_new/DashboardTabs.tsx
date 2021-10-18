/* eslint-disable func-call-spacing */
/* eslint-disable max-len */
import { createStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import { ReactComponent as MyFeed } from "../../assets/images/my_feed.svg";
import { ReactComponent as MyFeedSelected } from "../../assets/images/my_feed_selected.svg";
import { ReactComponent as Recent } from "../../assets/images/recent.svg";
import { ReactComponent as RecentSelected } from "../../assets/images/recent_selected.svg";
// import { ReactComponent as TrainingBottom } from "../../assets/images/training_bottom.svg";
// import { ReactComponent as TrainingSide } from "../../assets/images/training_side.svg";
// import { ReactComponent as TrainingTop } from "../../assets/images/training_top.svg";
import { ReactComponent as Training } from "../../assets/images/training.svg";
import { GroupTag } from "../../state/ducks/auth/types";
import useGetHasTag from "../hooks/useGetHasTag";
import DashboardChart from "./DashboardChart";
import MyFeeds from "./MyFeeds";
import Recents from "./Recents";
import Trainings from "./Trainings";
// import Dashboard from "./Dashboard.container";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  isDashboardAdmin: boolean;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, isDashboardAdmin, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Grid container={true}>
          <Grid item={true} md={isDashboardAdmin ? 8 : 12} sm={12}>
            {value === 0 && <MyFeeds />}
            {value === 1 && isDashboardAdmin && <Trainings /> }
            {value === 1 && !isDashboardAdmin && <Recents /> }
            {value === 2 && isDashboardAdmin && <Recents />}
          </Grid>
          {isDashboardAdmin && (<Grid item={true} md={4} sm={12}>
            <DashboardChart />
          </Grid>)}
        </Grid>
      )}
    </div>
  );
}

interface StyledTabsProps {
  // textColor: string;
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const StyledTabs = withStyles({
  indicator: {
    "display": "flex",
    "justifyContent": "center",
    "backgroundColor": "transparent",
    "& > span": {
      // maxWidth: 40,
      width: "100%",
      backgroundColor: "#FFFFFF",
    },
  },
  selected: {
    backgroundColor: "red",
  },
})((props: StyledTabsProps) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />
));

// interface StyledTabProps {
//   label: any;
// }

// const StyledTab = withStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       "textTransform": "none",
//       "color": "grey",
//       "borderRadius": "20px",
//       "backgroundColor": "#F5F8FF",
//       "border": "1px solid #F5F8FF",
//       "fontWeight": theme.typography.fontWeightRegular,
//       "fontSize": theme.typography.pxToRem(15),
//       "marginRight": theme.spacing(1),
//       "&:focus": {
//         opacity: 1,
//         color: "#011FBB",
//       },
//       "&$selected": {
//         opacity: 1,
//         color: "red",
//         backgroundColor: "red",
//       },
//     },
//   })
// )((props: StyledTabProps) => <Tab disableRipple {...props} />);

interface WrapTabProps {
  label: any;
}

const WrapTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "min-width": "125px",
      /* Font Gray */
      "color": "#767B87",
      "borderRadius": "100px",
      /* Heading 21 */
      "position": "static",
      "left": "23.45%",
      "right": "0%",
      "top": "10.34%",
      "bottom": "10.34%",
      "font-family": "Sora",
      "font-style": "normal",
      "font-weight": "normal",
      "font-size": "18px",
      "line-height": "23px",
      /* identical to box height */
      "display": "flex",
      "align-items": "center",
      "letter-spacing": "0.25px",
      "text-transform": "capitalize",
      /* Inside Auto Layout */
      "flex": "none",
      "order": 1,
      "flex-grow": 0,
      "margin": "0px 5px",
    },
    selected: {
      "opacity": 1,
      /* Enlil Navy */
      "color": "#011FBB",
      "font-weight": 600,
      "backgroundColor": "#F5F8FF",
    },
  })
)((props: WrapTabProps) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  toolbar: {
    top: 18,
    left: 15,
  },
  tabContent: {},
  // divider: {
  //   "margin-top": 25,
  // },
}));

function a11yProps(index: any) {
  return {
    "id": `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

export default function CustomizedTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  let isDashboardAdmin = useGetHasTag(GroupTag.DASHBOARD_ADMIN);
  isDashboardAdmin = true; // TO DO:: For testing purpose only, this has been added. Once we get DASHBOARD_ADMIN tag from backend, this line should be removed.
  console.log("isDashboardAdmin:: ", isDashboardAdmin);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    // <div className={classes.root}>
    <Grid container={true} className={classes.root}>
      <Grid item={true} sm={12}>
        <Toolbar variant="dense" disableGutters className={classes.toolbar}>
          <StyledTabs
            value={value}
            onChange={handleChange}
            aria-label="dashboard tabs"
          >
            {/* <StyledTab {...a11yProps(0)} label={<div> <MyFeed /> My Feed (26) </div>} /> */}
            {/* <StyledTab {...a11yProps(1)} label={<div> <Recent /> Recent </div>} /> */}
            {/* <Tab disableRipple {...a11yProps(1)} label={<Chip icon={<MyFeed />} label="My Feed (26)" />} />
            <Tab disableRipple {...a11yProps(1)} label={<Chip icon={<Recent />} label="Recent" />} /> */}
            <WrapTab {...a11yProps(0)} label={
              <Grid container={true} justify="center"
                alignItems="center">
                {value === 0 ? <MyFeedSelected/> : <MyFeed /> } &nbsp;&nbsp;<span>My Feed (26)</span>
              </Grid>
            } />
            {isDashboardAdmin && <WrapTab {...a11yProps(1)} label={
              <Grid container={true} justify="center"
                alignItems="center">
                <Training /> &nbsp;&nbsp;<span>Training</span>
              </Grid>} />}
            <WrapTab {...a11yProps(2)} label={
              <Grid container={true} justify="center"
                alignItems="center">
                {value === 2 ? <RecentSelected/> : <Recent />  } &nbsp;&nbsp;<span>Recent</span>
              </Grid>} />
          </StyledTabs>
        </Toolbar>
        {/* <Grid item={true} sm={12}> <Divider className={classes.divider} /> </Grid> */}
      </Grid>
      <Grid item={true} sm={12} className={classes.tabContent}>
        <TabPanel value={value} index={0} isDashboardAdmin={isDashboardAdmin}>
        </TabPanel>
        {isDashboardAdmin && <TabPanel value={value} index={1} isDashboardAdmin={isDashboardAdmin}>
        </TabPanel>}
        <TabPanel value={value} index={isDashboardAdmin ? 2 : 1} isDashboardAdmin={isDashboardAdmin}>
        </TabPanel>
      </Grid>
    </Grid>
  // </div>
  );
}
