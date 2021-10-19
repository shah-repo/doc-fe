import { createStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import { ReactComponent as MyFeedIcon } from "../../assets/images/my_feed.svg";
import { ReactComponent as MyFeedSelectedIcon } from "../../assets/images/my_feed_selected.svg";
import { ReactComponent as RecentIcon } from "../../assets/images/recent.svg";
import { ReactComponent as RecentSelectedIcon } from "../../assets/images/recent_selected.svg";
import { ReactComponent as TrainingIcon } from "../../assets/images/training_tab.svg";
import { ReactComponent as TrainingSelectedIcon } from "../../assets/images/training_tab_selected.svg";
import { GroupTag } from "../../state/ducks/auth/types";
import useGetHasTag from "../hooks/useGetHasTag";
import MyFeeds from "./my_feeds/MyFeeds.container";
import Recents from "./recents/Recents.container";
import Trainings from "./trainings/Trainings.container";
import TrainingStats from "./training_stats/TrainingStats";

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
            <TrainingStats />
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

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} sm={12}>
        <Toolbar variant="dense" disableGutters className={classes.toolbar}>
          <StyledTabs
            value={value}
            onChange={handleChange}
            aria-label="dashboard tabs"
          >
            <WrapTab {...a11yProps(0)} label={
              <Grid container={true} justify="center"
                alignItems="center">
                {value === 0 ? <MyFeedSelectedIcon /> : <MyFeedIcon /> } &nbsp;&nbsp;<span>My Feed (26)</span>
              </Grid>
            } />
            {isDashboardAdmin && <WrapTab {...a11yProps(1)} label={
              <Grid container={true} justify="center"
                alignItems="center">
                {value === 1 ? <TrainingSelectedIcon /> : <TrainingIcon /> } &nbsp;&nbsp;<span>Training</span>
              </Grid>} />}
            <WrapTab {...a11yProps(2)} label={
              <Grid container={true} justify="center"
                alignItems="center">
                {(isDashboardAdmin && value === 2) || (!isDashboardAdmin && value === 1) ? <RecentSelectedIcon /> : <RecentIcon />  } &nbsp;&nbsp;<span>Recent</span>
              </Grid>} />
          </StyledTabs>
        </Toolbar>
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
  );
}
