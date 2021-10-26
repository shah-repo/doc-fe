import React from "react";
import TrainingLineItemsPresenter from "./TrainingLineItems.presenter";
// import { styles } from "./TrainingLineItems.styles";

interface TrainingLineItemsProps {
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

const TrainingLineItems: React.FunctionComponent<TrainingLineItemsProps> = ({ trainingData }) => {
  // const classes = styles();
  // TO DO: Logic for count calculation needs to be updated based on actual data
  const overdueItems = trainingData.filter((item) => item.status === "OVERDUE");
  const dueInSevenItems = trainingData.filter((item) => item.status === "DUE IN 7 DAYS");
  return (
    <TrainingLineItemsPresenter overdueItems={overdueItems} dueInSevenItems={dueInSevenItems}/>
  );
};

export default TrainingLineItems;
