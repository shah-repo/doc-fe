import { Box, Divider, List } from "@material-ui/core";
import cx from "classnames";
import React from "react";
import { useSelector } from "react-redux";
import { Nullable } from "../../../../state/ducks/common/types";
import { trainingStatsSelectors } from "../../../../state/ducks/dashboard.new/training.stats";
import LoadMoreButton from "../../../components/common/load.more.button/LoadMoreButton";
import Text from "../../../components/Text";
import TrainingItem from "./TrainingItem";
import useStyles from "./TrainingLineItems.styles";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  panelData: {
    id: string;
    docTitle: string;
    user: { avatar: Nullable<string>; name: string; initialColor: string };
    docId: string;
    status: string;
    dueOn: string;
  }[];
  overallLimit: number;
  onLoadMoreData: () => void;
}

const TabPanel: React.FunctionComponent<TabPanelProps> = ({
  children,
  value,
  index,
  panelData,
  overallLimit,
  onLoadMoreData,
  ...other
}) => {
  const classes = useStyles();
  const totalTrainingData = useSelector(trainingStatsSelectors.totalTrainingStatsList);

  const renderItems = () =>
    value === index && (
      <List className={classes.listRoot}>
        {panelData.map((data, index) => (
          <>
            <TrainingItem
              key={index}
              id={data.id}
              avatar={data.user.avatar}
              initialColor={data.user.initialColor}
              name={data.user.name}
              status={data.status}
              documentId={data.docId}
              title={data.docTitle}
              date={data.dueOn}
            />
            <Divider />
          </>
        ))}
        {totalTrainingData > 0 && (
          <LoadMoreButton
            onLoadMore={onLoadMoreData}
            disable={overallLimit >= totalTrainingData}
            id="trainingListBoxLoadMore"
            className={classes.loadMore}
          />
        )}
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
  overallLimit: number;
  onLoadMoreData: () => void;
}

const TrainingLineItemsPresenter: React.FunctionComponent<TrainingLineItemsProps> =
  ({ tabValue, overallLimit, onLoadMoreData }) => {
    const trainingStatsList = useSelector(trainingStatsSelectors.trainingStatsList);
    const classes = useStyles();
    return (
      <Box component="div" className={cx(classes.root, "containing-box-scrollbar")} >
        <TabPanel
          key={0}
          value={tabValue}
          index={0}
          panelData={trainingStatsList}
          overallLimit={overallLimit}
          onLoadMoreData={onLoadMoreData}
        >
          <Text translation="training.stats.all" />
        </TabPanel>
        <TabPanel
          key={1}
          value={tabValue}
          index={1}
          panelData={trainingStatsList}
          overallLimit={overallLimit}
          onLoadMoreData={onLoadMoreData}
        >
          <Text translation="common.overdue" />
        </TabPanel>
        <TabPanel
          key={2}
          value={tabValue}
          index={2}
          panelData={trainingStatsList}
          overallLimit={overallLimit}
          onLoadMoreData={onLoadMoreData}
        >
          <Text translation="common.duein7days" />
        </TabPanel>
      </Box>
    );
  };

export default TrainingLineItemsPresenter;
