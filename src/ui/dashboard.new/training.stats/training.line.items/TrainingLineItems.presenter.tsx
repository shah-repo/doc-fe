import { Box, Grid, List, Tab } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { Nullable } from "../../../../state/ducks/common/types";
import { trainingStatsSelectors } from "../../../../state/ducks/dashboard.new/training.stats";
import Text from "../../../components/Text";
import { StyledTabs } from "./StyledTabs";
import TrainingItem from "./TrainingItem";
import { styles } from "./TrainingLineItems.styles";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  panelData: {
    docTitle: string;
    user: { avatar: Nullable<string>; name: string };
    docId: string;
    status: string;
    dueOn: string;
  }[];
}

const TabPanel: React.FunctionComponent<TabPanelProps> = ({
  children,
  value,
  index,
  panelData,
  ...other
}) => {
  const classes = styles();
  const renderItems = () => (
    <List className={classes.listRoot}>
      {panelData.map((data, index) => (
        <TrainingItem
          key={index}
          avatar={data.user.avatar}
          name={data.user.name.split(" ")[0]}
          status={data.status}
          documentId={data.docId}
          title={data.docTitle}
          date={data.dueOn}
        />
      ))}
    </List>
  );

  return (
    <Box
      component="div"
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
    </Box>
  );
};

function tabCustomClasses(index: any) {
  return {
    "id": `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

interface TrainingLineItemsProps {
  infoChangeTab: (newValue: number) => void;
}

const TrainingLineItemsPresenter: React.FunctionComponent<TrainingLineItemsProps> =
  (props) => {
    const overdueItems = useSelector(
      trainingStatsSelectors.overdueTrainingData
    );
    const dueInSevenItems = useSelector(trainingStatsSelectors.dueTrainingData);
    const all = overdueItems.concat(dueInSevenItems);
    const [value, setValue] = React.useState(0);
    const classes = styles();
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
      props.infoChangeTab(newValue);
    };

    return (
      <Box component="div" className={classes.root}>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="full width tabs example"
        >
          <Tab
            classes={{ root: classes.tab }}
            label={
              <Grid container={true} justify="center" alignItems="center">
                <Grid item={true} sm={12}>
                  <span className={classes.allTab}></span>
                  <span className={classes.tabHeader}>
                    <Text translation="training.stats.all" />
                  </span>
                </Grid>
              </Grid>
            }
            {...tabCustomClasses(0)}
          />
          <Tab
            classes={{ root: classes.tab }}
            label={
              <Grid container={true} justify="center" alignItems="center">
                <Grid item={true} sm={12}>
                  <span className={classes.dueInSevenTab}></span>
                  <span className={classes.tabHeader}>
                    <Text translation="training.stats.duein7days" />
                  </span>
                </Grid>
              </Grid>
            }
            {...tabCustomClasses(1)}
          />
          <Tab
            classes={{ root: classes.tab }}
            label={
              <Grid container={true} justify="center" alignItems="center">
                <Grid item={true} sm={12}>
                  <span className={classes.overdueTab}></span>
                  <span className={classes.tabHeader}>
                    <Text translation="training.stats.overdue" />
                  </span>
                </Grid>
              </Grid>
            }
            {...tabCustomClasses(2)}
          />
        </StyledTabs>
        <TabPanel value={value} index={0} panelData={all}>
          <Text translation="training.stats.all" />
        </TabPanel>
        <TabPanel value={value} index={1} panelData={dueInSevenItems}>
          <Text translation="training.stats.duein7days" />
        </TabPanel>
        <TabPanel value={value} index={2} panelData={overdueItems}>
          <Text translation="training.stats.overdue" />
        </TabPanel>
      </Box>
    );
  };

export default TrainingLineItemsPresenter;
