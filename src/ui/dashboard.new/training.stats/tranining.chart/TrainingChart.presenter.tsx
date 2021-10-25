import { Grid, Typography } from "@material-ui/core";
import ReactECharts from "echarts-for-react";
import React from "react";
import Text from "../../../components/Text";
import Colors from "../../../layout/theme/utils/colors";
import DoughnutChartOptions from "./DoughnutChartOptions";
import { styles } from "./TrainingChart.styles";

interface TrainingChartPresenterProps {
  overdue: number;
  dueInSeven: number;
}

function TrainingChartPresenter(props: TrainingChartPresenterProps) {
  const { overdue, dueInSeven } = props;
  const data = [
    { value: dueInSeven, name: "Due in 7 days" },
    { value: overdue, name: "Overdue" },
  ];
  DoughnutChartOptions.series[0].data = data;
  const classes = styles();
  const onEvents = {
    mouseover: () => {
      DoughnutChartOptions.color = [Colors.background_blue, Colors.background_blue];
    },
  };
  return (
    <div className={classes.chartContainer}>
      <Grid container={true}>
        <Grid item={true}>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            <Text translation={"training.stats.chart.title"} />
          </Typography>
          <ReactECharts
            option={DoughnutChartOptions}
            style={{ height: 250, width: 250 }}
            onEvents={onEvents} />
        </Grid>
      </Grid>
    </div>
  );
}

export default TrainingChartPresenter;
