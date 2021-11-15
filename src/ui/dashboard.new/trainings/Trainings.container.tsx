import React from "react";
import trainingItems from "../data/TrainingsTabLineItems.json";
import TrainingsLineItemPresenter from "./Trainings.presenter";

const TrainingsLineItemsContainer: React.FunctionComponent = () => (
  <TrainingsLineItemPresenter {...{ trainingItems }} />
);

export default TrainingsLineItemsContainer;
