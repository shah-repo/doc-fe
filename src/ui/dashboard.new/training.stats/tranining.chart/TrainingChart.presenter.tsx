import { Box, Grid, Typography } from "@material-ui/core";
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
  tabValue: number;
}

const TrainingChartPresenter: React.FunctionComponent<TrainingChartPresenterProps> =
  ({ overdue, dueInSeven, tabValue }) => {
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
        color: Colors.font_black,
        fontSize: 59,
      },
      subtextStyle: {
        fontFamily: "Sora",
        fontStyle: "normal",
        fontWeight: "bold",
        color: Colors.font_gray,
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
      const myChart = echarts.init(
        document.getElementById("main") as HTMLInputElement
      );
      myChart.setOption(DoughnutChartOptions);
      window.onresize = function() {
        myChart.resize();
      };
      myChart.on("mouseover", (evt: any) => {
        DoughnutChartOptions.series.data.map((data, index) => {
          if (index !== evt?.dataIndex) {
            DoughnutChartOptions.series.data[index].itemStyle.color =
              Colors.gray;
          }
          return null;
        });
        DoughnutChartOptions.title.text = evt?.data?.value;
        DoughnutChartOptions.title.subtext = evt?.data?.name;
        if (evt.data?.name === TrainingStatusChartLabelTypes.OVERDUE) {
          DoughnutChartOptions.title.subtextStyle.color =
            Colors.latest_red_varient;
        } else if (
          evt.data?.name === TrainingStatusChartLabelTypes.DUE_IN_7_DAYS
        ) {
          DoughnutChartOptions.title.subtextStyle.color =
            Colors.latest_yellow_varient;
        }
        myChart.setOption(DoughnutChartOptions);
      });
      myChart.on("mouseout", (e: any) => {
        DoughnutChartOptions.title.text = "" + totalCount;
        DoughnutChartOptions.title.subtext =
          TrainingStatusChartLabelTypes.TOTAL_OUTSTANDING;
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
      const updateChart = (tabValue) => {
        let text = "";
        let subText = "";
        let color = "";
        let data = {};
        if (tabValue === 0) {
          text = "" + totalCount;
          subText = "Total Outstanding";
          color = Colors.gray;
          data = [
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
        } else if (tabValue === 1) {
          DoughnutChartOptions.series.data.map((data, index) => {
            if (index !== 0) {
              DoughnutChartOptions.series.data[index].itemStyle.color =
                Colors.gray;
            }
            return null;
          });
          data = DoughnutChartOptions.series.data;
          text = "" + dueInSeven;
          subText = "Due in 7 days";
          color = Colors.latest_yellow_varient;
        } else if (tabValue === 2) {
          DoughnutChartOptions.series.data.map((data, index) => {
            if (index !== 1) {
              DoughnutChartOptions.series.data[index].itemStyle.color =
                Colors.gray;
            }
            return null;
          });
          data = DoughnutChartOptions.series.data;
          text = "" + overdue;
          subText = "Overdue";
          color = Colors.latest_red_varient;
        }
        DoughnutChartOptions.title.text = text;
        DoughnutChartOptions.title.subtext = subText;
        DoughnutChartOptions.title.subtextStyle.color = color;
        DoughnutChartOptions.series.data = data as any[];
        myChart.setOption(DoughnutChartOptions);
      };
      updateChart(tabValue);
    });

    return (
      <Box component="div" className={classes.chartContainer}>
        <Grid container={true}>
          <Grid item={true}>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              <Text translation="training.stats.title" />
            </Typography>
            <Box component="div" id="main" className={classes.scroll}></Box>
          </Grid>
        </Grid>
      </Box>
    );
  };

export default TrainingChartPresenter;
