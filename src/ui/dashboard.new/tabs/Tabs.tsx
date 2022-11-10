import { Box, Typography } from "@material-ui/core";
import cx from "classnames";
import React, { FC, ComponentProps, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { ReactComponent as MyFeedIcon } from "../../../assets/images/my_feed.svg";
import { ReactComponent as TrainingIcon } from "../../../assets/images/training_tab.svg";
import { ReactComponent as RecentIcon } from "../../../assets/images/recent.svg";
import { GroupTag } from "../../../state/ducks/auth/types";
import { dashboardMyFeedsSelectors } from "../../../state/ducks/dashboard.new/my.feeds";
import Text from "../../components/Text";
import useGetHasTag from "../../hooks/useGetHasTag";
import useStyles from "./Tabs.styles";
import StyledTabs from "./common/StyledTabs";
import StyledTab from "./common/StyledTab";
import { DashboardTabValues } from "./Tabs.types";
import Todo from "../my.feeds/Todo.container";
import MyFeeds from "../my.feeds/MyFeeds.container";
import Recents from "../recents/Recents.container";
import Trainings from "../trainings/Trainings.container";
import { Translation } from "../../translations/types";

type TabProps = ComponentProps<typeof StyledTab> & {
  title: Translation;
  count?: number;
};

const Tab: FC<TabProps> = (props) => {
  const { value, selected, icon, title, count, ...restProps } = props;

  const classes = useStyles();

  return (
    <StyledTab
      value={value}
      selected={selected}
      disableRipple
      id={`scrollable-auto-tab-${value}`}
      aria-controls={`scrollable-auto-tabpanel-${value}`}
      label={
        <Box display="flex" alignItems="center">
          <Box className={cx(classes.tabItemIcon, { [classes.tabItemIconActive]: selected })}>
            {icon}
          </Box>
          <Typography
            component="span"
            variant="inherit"
            className={cx(classes.tabItemTitle, { [classes.tabItemTitleActive]: selected })}
          >
            <Text translation={title} />
          </Typography>
          {count !== undefined && (
            <Typography
              component="span"
              variant="inherit"
              className={classes.tabItemCount}
            >
              ({count})
            </Typography>
          )}
        </Box>
      }
      {...restProps}
    />
  );
};

const Tabs: FC = () => {
  const classes = useStyles();

  const isDashboardAdmin = useGetHasTag(GroupTag.DASHBOARD_ADMIN);
  const feedItems: any = useSelector(dashboardMyFeedsSelectors.myFeedsList);

  const [value, setValue] = useState<DashboardTabValues>(DashboardTabValues.Todo);

  const handleChange = useCallback(
    (event: any, newValue: DashboardTabValues) => setValue(newValue),
    []
  );

  return (
    <Box className={classes.root}>
      <StyledTabs
        value={value}
        onChange={handleChange}
        aria-label="dashboard tabs"
      >
        <Tab
          value={DashboardTabValues.Todo}
          icon={<MyFeedIcon />}
          title="common.todo"
        />
        <Tab
          value={DashboardTabValues.MyFeed}
          icon={<MyFeedIcon />}
          title="common.my.feed"
          count={feedItems.total ?? 0}
        />
        {isDashboardAdmin && (
          <Tab
            value={DashboardTabValues.Training}
            icon={<TrainingIcon />}
            title="common.trainings"
          />
        )}
        <Tab
          value={DashboardTabValues.Recent}
          icon={<RecentIcon />}
          title="common.recent"
        />
      </StyledTabs>
      <Box className={cx(classes.tabs, "containing-box-scrollbar")}>
        <div
          role="tabpanel"
          id={`scrollable-auto-tabpanel-${value}`}
          aria-labelledby={`scrollable-auto-tab-${value}`}
        >
          {value === DashboardTabValues.Todo && <Todo />}
          {value === DashboardTabValues.MyFeed && <MyFeeds />}
          {value === DashboardTabValues.Training && <Trainings />}
          {value === DashboardTabValues.Recent && <Recents />}
        </div>
      </Box>
    </Box>
  );
};

export default Tabs;
