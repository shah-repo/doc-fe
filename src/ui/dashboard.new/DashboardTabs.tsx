import { Box, Typography } from "@material-ui/core";
import cx from "classnames";
import React from "react";
import { useSelector } from "react-redux";
import { ReactComponent as MyFeedIcon } from "../../assets/images/my_feed.svg";
import { ReactComponent as MyFeedSelectedIcon } from "../../assets/images/my_feed_selected.svg";
import { ReactComponent as RecentIcon } from "../../assets/images/recent.svg";
import { ReactComponent as RecentSelectedIcon } from "../../assets/images/recent_selected.svg";
import { ReactComponent as TrainingIcon } from "../../assets/images/training_tab.svg";
import { ReactComponent as TrainingSelectedIcon } from "../../assets/images/training_tab_selected.svg";
import { GroupTag } from "../../state/ducks/auth/types";
import { dashboardMyFeedsSelectors } from "../../state/ducks/dashboard.new/my.feeds";
import Text from "../components/Text";
import useGetHasTag from "../hooks/useGetHasTag";
import useStyles from "./DashboardTabs.styles";
import { StyledTab } from "./StyledTab";
import { StyledTabs } from "./StyledTabs";
import TabPanel from "./TabPanel";

const DashboardTabs: React.FunctionComponent = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const isDashboardAdmin = useGetHasTag(GroupTag.DASHBOARD_ADMIN);

  const dynamicObjProps = (index: any) => ({
    "id": `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  });

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  const feedItems: any = useSelector(dashboardMyFeedsSelectors.myFeedsList);

  return (
    <Box className={classes.root}>
      <StyledTabs
        value={value}
        onChange={handleChange}
        aria-label="dashboard tabs"
      >
        <StyledTab
          disableRipple
          {...dynamicObjProps(0)}
          label={
            <Box display="flex" alignItems="center">
              {value === 0 ? <MyFeedSelectedIcon /> : <MyFeedIcon />}
              <Typography
                component="span"
                variant="inherit"
                // eslint-disable-next-line max-len
                className={
                  value === 0
                    ? `${classes.tabItemText} ${classes.tabItemTextActive} `
                    : classes.tabItemText
                }
              >
                <Text translation={"common.my.feed"} />
              </Typography>
              <Typography
                component="span"
                variant="inherit"
                className={classes.tabItemCount}
              >
                    ({feedItems.total || 0})
              </Typography>
            </Box>
          }
        />
        {isDashboardAdmin && (
          <StyledTab
            disableRipple
            {...dynamicObjProps(1)}
            label={
              <Box display="flex" alignItems="center">
                {value === 1 ? <TrainingSelectedIcon /> : <TrainingIcon />}
                <Typography
                  component="span"
                  variant="inherit"
                  // eslint-disable-next-line max-len
                  className={
                    value === 1
                      ? `${classes.tabItemText} ${classes.tabItemTextActive} `
                      : classes.tabItemText
                  }
                >
                  <Text translation={"common.trainings"} />
                </Typography>
              </Box>
            }
          />
        )}
        <StyledTab
          disableRipple
          {...dynamicObjProps(isDashboardAdmin ? 2 : 1)}
          label={
            <Box display="flex" alignItems="center">
              {(isDashboardAdmin && value === 2) ||
                  (!isDashboardAdmin && value === 1) ? (
                  <RecentSelectedIcon />
                ) : (
                  <RecentIcon />
                )}
              <Typography
                component="span"
                variant="inherit"
                className={
                  (isDashboardAdmin && value === 2) ||
                      // eslint-disable-next-line max-len
                      (!isDashboardAdmin && value === 1)
                    ? `${classes.tabItemText} ${classes.tabItemTextActive} `
                    : classes.tabItemText
                }
              >
                <Text translation={"common.recent"} />
              </Typography>
            </Box>
          }
        />
      </StyledTabs>
      <Box className={cx(classes.tabs, "containing-box-scrollbar")}>
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
      </Box>
    </Box>
  );
};

export default DashboardTabs;
