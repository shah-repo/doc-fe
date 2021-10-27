import { Grid, Typography } from "@material-ui/core";
import * as echarts from "echarts";
import React from "react";
import { TrainingStatusChartLabelTypes } from "../../../../state/ducks/training/types";
import Text from "../../../components/Text";
import Colors from "../../../layout/theme/utils/colors";
import DoughnutChartOptions from "./DoughnutChartOptions";
import { styles } from "./TrainingChart.styles";

interface TrainingChartPresenterProps {
  overdue: number;
  dueInSeven: number;
}

const TrainingChartPresenter: React.FunctionComponent<TrainingChartPresenterProps> = ({ overdue, dueInSeven }) => {
  const totalCount = overdue + dueInSeven;
  const data = [
    {
      value: dueInSeven,
      name: TrainingStatusChartLabelTypes.DUE_IN_7_DAYS,
      itemStyle: {
        color: Colors.latest_yellow_varient,
      },
    },
    {
      value: overdue,
      name: "OVERDUE",
      itemStyle: {
        color: Colors.latest_red_varient,
      },
    },
  ];
  const defaultTitle = {
    text: "" + totalCount,
    subtext: "Total Outstanding",
    padding: [-10, 0, 0, 0],
    textStyle: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "bold",
      color: "#080B11",
      fontSize: 59,
    },
    subtextStyle: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "bold",
      color: "#767B87",
      fontSize: 12,
    },
    itemGap: -20,
    left: "center",
    top: "center",
  };
  DoughnutChartOptions.title = defaultTitle;
  DoughnutChartOptions.series.data = data;
  const classes = styles();
  setTimeout(function() {
    const myChart = echarts.init(document.getElementById("main") as HTMLInputElement);
    myChart.setOption(DoughnutChartOptions);


    myChart.on("mouseover", (evt: any) => {
      DoughnutChartOptions.series.data.map((data, index) => {
        if (index !== evt?.dataIndex) {
          DoughnutChartOptions.series.data[index].itemStyle.color = Colors.gray;
        }
      });
      DoughnutChartOptions.title.text = evt?.data?.value;
      DoughnutChartOptions.title.subtext = evt?.data?.name;
      if (evt.data?.name === TrainingStatusChartLabelTypes.OVERDUE) {
        DoughnutChartOptions.title.subtextStyle.color = Colors.latest_red_varient;
      } else if (evt.data?.name === TrainingStatusChartLabelTypes.DUE_IN_7_DAYS) {
        DoughnutChartOptions.title.subtextStyle.color = Colors.latest_yellow_varient;
      }
      myChart.setOption(DoughnutChartOptions);
    });
    myChart.on("mouseout", (e: any) => {
      DoughnutChartOptions.title.text = "" + totalCount;
      DoughnutChartOptions.title.subtext = TrainingStatusChartLabelTypes.TOTAL_OUTSTANDING;
      DoughnutChartOptions.title.subtextStyle.color = Colors.gray;
      DoughnutChartOptions.series.data = [
        {
          value: dueInSeven,
          name: TrainingStatusChartLabelTypes.DUE_IN_7_DAYS,
          itemStyle: {
            color: Colors.latest_yellow_varient,
          },
        },
        {
          value: overdue,
          name: "OVERDUE",
          itemStyle: {
            color: Colors.latest_red_varient,
          },
        },
      ];
      myChart.setOption(DoughnutChartOptions);
    });
  });

  return (
    <div className={classes.chartContainer}>
      <Grid container={true}>
        <Grid item={true}>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            <Text translation="training.stats.title" />
          </Typography>
          <div id="main" style={{ height: 280, width: 280 }}></div>
        </Grid>
      </Grid>
    </div>
  );
};

export default TrainingChartPresenter;
