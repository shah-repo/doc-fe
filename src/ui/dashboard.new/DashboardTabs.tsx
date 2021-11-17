import { Grid, Toolbar } from "@material-ui/core";
import React from "react";
import { ReactComponent as MyFeedIcon } from "../../assets/images/my_feed.svg";
import { ReactComponent as MyFeedSelectedIcon } from "../../assets/images/my_feed_selected.svg";
import { ReactComponent as RecentIcon } from "../../assets/images/recent.svg";
import { ReactComponent as RecentSelectedIcon } from "../../assets/images/recent_selected.svg";
import { ReactComponent as TrainingIcon } from "../../assets/images/training_tab.svg";
import { ReactComponent as TrainingSelectedIcon } from "../../assets/images/training_tab_selected.svg";
import { GroupTag } from "../../state/ducks/auth/types";
import Text from "../components/Text";
import useGetHasTag from "../hooks/useGetHasTag";
import { styles } from "./DashboardTabs.styles";
import { StyledTab } from "./StyledTab";
import { useSelector } from "react-redux";
import { trainingSelectors } from "../../state/ducks/dashboard.new/training";
import { StyledTabs } from "./StyledTabs";
import TabPanel from "./TabPanel";

const DashboardTabs: React.FunctionComponent = () => {
  const classes = styles();
  const [value, setValue] = React.useState(0);
  let isDashboardAdmin = useGetHasTag(GroupTag.DASHBOARD_ADMIN);
  /* TO DO:: For testing purpose only, this has been added.
  Once we get DASHBOARD_ADMIN tag from backend, this line should be removed. */
  isDashboardAdmin = true;

  const dynamicObjProps = (index: any) => ({
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  });

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  const trainingItems = useSelector(trainingSelectors.trainingList);

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} sm={12}>
        <Toolbar variant="dense" disableGutters className={classes.toolbar}>
          <StyledTabs
            value={value}
            onChange={handleChange}
            aria-label="dashboard tabs"
          >
            <StyledTab
              disableRipple
              {...dynamicObjProps(0)}
              label={
                <Grid container={true} justify="center" alignItems="center">
                  <Grid item={true} sm={12}>
                    {value === 0 ? <MyFeedSelectedIcon /> : <MyFeedIcon />}
                    <span className={classes.tabItemText}>
                      <Text translation={"common.my.feed"} /> (26)
                    </span>
                  </Grid>
                </Grid>
              }
            />
            {isDashboardAdmin && (
              <StyledTab
                disableRipple
                {...dynamicObjProps(1)}
                label={
                  <Grid container={true} justify="center" alignItems="center">
                    <Grid item={true} sm={12}>
                      {value === 1 ? (
                        <TrainingSelectedIcon />
                      ) : (
                        <TrainingIcon />
                      )}
                      <span className={classes.tabItemText}>
                        <Text translation={"common.trainings"} /> (
                        {trainingItems.length || 0})
                      </span>
                    </Grid>
                  </Grid>
                }
              />
            )}
            <StyledTab
              disableRipple
              {...dynamicObjProps(isDashboardAdmin ? 2 : 1)}
              label={
                <Grid container={true} justify="center" alignItems="center">
                  <Grid item={true} sm={12}>
                    {(isDashboardAdmin && value === 2) ||
                    (!isDashboardAdmin && value === 1) ? (
                      <RecentSelectedIcon />
                    ) : (
                      <RecentIcon />
                    )}
                    <span className={classes.tabItemText}>
                      <Text translation={"common.recent"} />
                    </span>
                  </Grid>
                </Grid>
              }
            />
          </StyledTabs>
        </Toolbar>
      </Grid>
      <Grid item={true} sm={12}>
        <TabPanel
          value={value}
          index={0}
          isDashboardAdmin={isDashboardAdmin}
        ></TabPanel>
        {isDashboardAdmin && (
          <TabPanel
            value={value}
            index={1}
            isDashboardAdmin={isDashboardAdmin}
          ></TabPanel>
        )}
        <TabPanel
          value={value}
          index={isDashboardAdmin ? 2 : 1}
          isDashboardAdmin={isDashboardAdmin}
        ></TabPanel>
      </Grid>
    </Grid>
  );
};

export default DashboardTabs;
