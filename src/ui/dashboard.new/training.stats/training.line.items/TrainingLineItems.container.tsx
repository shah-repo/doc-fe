import React from "react";
import TrainingLineItemsPresenter from "./TrainingLineItems.presenter";

interface TrainingLineItemsProps {
  tabValue: number;
}

const TrainingLineItems: React.FunctionComponent<TrainingLineItemsProps> = ({
  tabValue,
}) => <TrainingLineItemsPresenter tabValue={tabValue} />;

export default TrainingLineItems;
