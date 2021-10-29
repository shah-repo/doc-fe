import React from "react";
import { TrainingStatusChartLabelTypes } from "../../../../state/ducks/training/types";
import TrainingLineItemsPresenter from "./TrainingLineItems.presenter";

interface TrainingLineItemsProps {
  infoChangeTab: (newValue: number) => void;
  trainingData: {
    docTitle: string;
    user: {avatar: string | null; name: string};
    docId: string;
    status: string;
    dueOn: string;
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
    (item) => item.status === TrainingStatusChartLabelTypes.DUE
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
