import React from 'react';
import { useSelector } from 'react-redux';
import { trainingStatsSelectors } from '../../../../state/ducks/dashboard.new/training.stats';
import TrainingChartPresenter from './TrainingChart.presenter';

interface TrainingChartProps {
  tabValue: number
  infoChangeTab: (newValue: number) => void
}

const TrainingChart: React.FunctionComponent<TrainingChartProps> = ({
  tabValue,
  infoChangeTab,
}) => {
  const overdueTrainingChartData = useSelector(
    trainingStatsSelectors.overdueTrainingChartData,
  );
  const dueTrainingChartData = useSelector(trainingStatsSelectors.dueTrainingChartData);
  return (
    <TrainingChartPresenter
      tabValue={tabValue}
      overdue={overdueTrainingChartData}
      dueInSeven={dueTrainingChartData}
      infoChangeTab={infoChangeTab}
    />
  );
};

export default TrainingChart;
