import { Grid, Typography } from "@material-ui/core";
import * as echarts from "echarts";
// import ReactECharts from "echarts-for-react";
import React from "react";
import Colors from "../../../layout/theme/utils/colors";
import DoughnutChartOptions from "./DoughnutChartOptions";
import { styles } from "./TrainingChart.styles";

interface TrainingChartPresenterProps {
  overdue: number;
  dueInSeven: number;
}

function TrainingChartPresenter(props: TrainingChartPresenterProps) {
  const { overdue, dueInSeven } = props;
  const totalCount = overdue + dueInSeven;
  const data = [
    {
      value: dueInSeven,
      name: "Due in 7 days",
      itemStyle: {
        color: Colors.latest_yellow_varient,
      },
    },
    {
      value: overdue,
      name: "Overdue",
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


    myChart.on("mouseover", (evt) => {
      DoughnutChartOptions.series.data.map((data, index) => {
        if (index !== evt.dataIndex) {
          DoughnutChartOptions.series.data[index].itemStyle.color = Colors.gray;
        }
      });
      // eslint-disable-next-line dot-notation
      DoughnutChartOptions.title.text = evt.data["value"];
      // eslint-disable-next-line dot-notation
      DoughnutChartOptions.title.subtext = evt.data["name"];
      // eslint-disable-next-line dot-notation
      if (evt.data["name"] === "Overdue") {
      // eslint-disable-next-line dot-notation
        DoughnutChartOptions.title.subtextStyle.color = Colors.latest_red_varient;
      // eslint-disable-next-line dot-notation
      } else if (evt.data["name"] === "Due in 7 days") {
        DoughnutChartOptions.title.subtextStyle.color = Colors.latest_yellow_varient;
      }
      myChart.setOption(DoughnutChartOptions);
    });
    myChart.on("mouseout", (e) => {
      DoughnutChartOptions.title.text = "" + totalCount;
      DoughnutChartOptions.title.subtext = "Total Outstanding";
      DoughnutChartOptions.title.subtextStyle.color = Colors.gray;
      DoughnutChartOptions.series.data = [
        {
          value: dueInSeven,
          name: "Due in 7 days",
          itemStyle: {
            color: Colors.latest_yellow_varient,
          },
        },
        {
          value: overdue,
          name: "Overdue",
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
          TRAINING OUTSTANDING
          </Typography>
          <div id="main" style={{ height: 280, width: 280 }}></div>
          {/* <ReactECharts
            option={DoughnutChartOptions}
            style={{ height: 280, width: 280 }}
            onEvents={onEvents} /> */}
        </Grid>
      </Grid>
    </div>
  );
}

export default TrainingChartPresenter;
