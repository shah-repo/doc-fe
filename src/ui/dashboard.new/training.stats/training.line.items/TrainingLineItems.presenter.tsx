import { Box, Divider, List } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { Nullable } from "../../../../state/ducks/common/types";
import { trainingStatsSelectors } from "../../../../state/ducks/dashboard.new/training.stats";
import Text from "../../../components/Text";
import TrainingItem from "./TrainingItem";
import { styles } from "./TrainingLineItems.styles";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  panelData: {
    docTitle: string;
    user: { avatar: Nullable<string>; name: string; initialColor: string };
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
        <>
          <TrainingItem
            key={index}
            avatar={data.user.avatar}
            initialColor={data.user.initialColor}
            name={data.user.name.split(" ")[0]}
            status={data.status}
            documentId={data.docId}
            title={data.docTitle}
            date={data.dueOn}
          />
          <Divider />
        </>
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
      {renderItems()}
    </Box>
  );
};

interface TrainingLineItemsProps {
  tabValue: number;
}

const TrainingLineItemsPresenter: React.FunctionComponent<TrainingLineItemsProps> =
  (props) => {
    const overdueItems = useSelector(
      trainingStatsSelectors.overdueTrainingData
    );
    const dueInSevenItems = useSelector(trainingStatsSelectors.dueTrainingData);
    const all = overdueItems.concat(dueInSevenItems);
    const classes = styles();
    return (
      <Box component="div" className={classes.root}>
        <TabPanel value={props.tabValue} index={0} panelData={all}>
          <Text translation="training.stats.all" />
        </TabPanel>
        <TabPanel value={props.tabValue} index={1} panelData={dueInSevenItems}>
          <Text translation="common.duein7days" />
        </TabPanel>
        <TabPanel value={props.tabValue} index={2} panelData={overdueItems}>
          <Text translation="common.overdue" />
        </TabPanel>
      </Box>
    );
  };

export default TrainingLineItemsPresenter;
