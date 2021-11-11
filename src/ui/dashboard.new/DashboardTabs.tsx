import { Box, Grid, Toolbar, Typography } from "@material-ui/core";
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
    "id": `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  });

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
            <StyledTab
              disableRipple
              {...dynamicObjProps(0)}
              label={
                <Box display='flex' alignItems='center'>
                  {value === 0 ? <MyFeedSelectedIcon /> : <MyFeedIcon />}
                  <Typography
                    component="span"
                    variant="inherit"
                    // eslint-disable-next-line max-len
                    className={value === 0 ? `${classes.tabItemText} ${classes.tabItemTextActive} ` : classes.tabItemText}
                  >
                    <Text translation={"common.my.feed"} />
                  </Typography>
                  <Typography
                    component="span"
                    variant="inherit"
                    className={classes.tabItemCount}
                  >
                      (26)
                  </Typography>
                </Box>
              }
            />
            {isDashboardAdmin && (
              <StyledTab
                disableRipple
                {...dynamicObjProps(1)}
                label={
                  <Box display='flex' alignItems='center'>
                    {value === 1 ? (
                      <TrainingSelectedIcon />
                    ) : (
                      <TrainingIcon />
                    )}
                    <Typography
                      component="span"
                      variant="inherit"
                      // eslint-disable-next-line max-len
                      className={value === 1 ? `${classes.tabItemText} ${classes.tabItemTextActive} ` : classes.tabItemText}
                    >
                      <Text translation={"common.trainings"} />
                    </Typography>
                    <Typography
                      component="span"
                      variant="inherit"
                      className={classes.tabItemCount}
                    >
                        (10)
                    </Typography>
                  </Box>

                }
              />
            )}
            <StyledTab
              disableRipple
              {...dynamicObjProps(isDashboardAdmin ? 2 : 1)}
              label={
                <Box display='flex' alignItems='center'>
                  {(isDashboardAdmin && value === 2) ||
                    (!isDashboardAdmin && value === 1) ? (
                      <RecentSelectedIcon />
                    ) : (
                      <RecentIcon />
                    )}
                  <Typography
                    component="span"
                    variant="inherit"
                    className={(isDashboardAdmin && value === 2) ||
                        // eslint-disable-next-line max-len
                        (!isDashboardAdmin && value === 1) ? `${classes.tabItemText} ${classes.tabItemTextActive} ` : classes.tabItemText}

                  >
                    <Text translation={"common.recent"} />
                  </Typography>
                </Box>
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
