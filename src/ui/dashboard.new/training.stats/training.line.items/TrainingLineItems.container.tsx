import React from "react";
import { TrainingStatusChartLabelTypes } from "../../../../state/ducks/training/types";
import TrainingLineItemsPresenter from "./TrainingLineItems.presenter";

interface TrainingLineItemsProps {
  infoChangeTab: (newValue: number) => void;
  trainingData: {
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

const TrainingLineItems: React.FunctionComponent<TrainingLineItemsProps> = ({
  trainingData,
  infoChangeTab,
}) => {
  // TO DO: Logic for count calculation needs to be updated based on actual data
  const overdueItems = trainingData.filter(
    (item) => item.status === TrainingStatusChartLabelTypes.OVERDUE
  );
  const dueInSevenItems = trainingData.filter(
    (item) => item.status === TrainingStatusChartLabelTypes.DUE_IN_7_DAYS
  );
  return (
    <TrainingLineItemsPresenter
      overdueItems={overdueItems}
      dueInSevenItems={dueInSevenItems}
      infoChangeTab={infoChangeTab}
    />
  );
};

export default TrainingLineItems;
