import React from "react";
import TrainingLineItemsPresenter from "./TrainingLineItems.presenter";

interface TrainingLineItemsProps {
  infoChangeTab: (newValue: number) => void;
}

const TrainingLineItems: React.FunctionComponent<TrainingLineItemsProps> = ({
  infoChangeTab,
}) => {
  return <TrainingLineItemsPresenter infoChangeTab={infoChangeTab} />;
};

export default TrainingLineItems;
