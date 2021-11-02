import { Box, Grid, Typography } from "@material-ui/core";
import * as echarts from "echarts";
import React, { useEffect, useCallback } from "react";
import { TrainingStatusChartLabelTypes } from "../../../../state/ducks/dashboard.new/training.stats/types";
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
        name: TrainingStatusChartLabelTypes.DUE,
        itemStyle: {
          color: Colors.latest_yellow_varient,
        },
      },
      {
        value: overdue,
        name: TrainingStatusChartLabelTypes.OVERDUE,
        itemStyle: {
          color: Colors.latest_red_varient,
        },
      },
    ];
    const defaultTitle = {
      text: "" + totalCount,
      subtext: TrainingStatusChartLabelTypes.TOTAL_OUTSTANDING,
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
    let myChart;
    const classes = styles();
    const updateChart = useCallback(
      (tabValue) => {
        let text = "";
        let subText = "";
        let color = "";
        let data = {};
        if (tabValue === 0) {
          text = "" + totalCount;
          subText = TrainingStatusChartLabelTypes.TOTAL_OUTSTANDING;
          color = Colors.gray;
          data = [
            {
              value: dueInSeven,
              name: TrainingStatusChartLabelTypes.DUE,
              itemStyle: {
                color: Colors.latest_yellow_varient,
              },
            },
            {
              value: overdue,
              name: TrainingStatusChartLabelTypes.OVERDUE,
              itemStyle: {
                color: Colors.latest_red_varient,
              },
            },
          ];
        } else if (tabValue === 1) {
          DoughnutChartOptions.series.data.map((data, index) => {
            if (index === 1) {
              DoughnutChartOptions.series.data[index].itemStyle.color =
                Colors.gray;
            } else if (index === 0) {
              DoughnutChartOptions.series.data[index].itemStyle.color =
                Colors.latest_yellow_varient;
            }
            return null;
          });
          data = DoughnutChartOptions.series.data;
          text = "" + dueInSeven;
          subText = TrainingStatusChartLabelTypes.DUE;
          color = Colors.latest_yellow_varient;
        } else if (tabValue === 2) {
          DoughnutChartOptions.series.data.map((data, index) => {
            if (index === 1) {
              DoughnutChartOptions.series.data[index].itemStyle.color =
                Colors.latest_red_varient;
            } else if (index === 0) {
              DoughnutChartOptions.series.data[index].itemStyle.color =
                Colors.gray;
            }
            return null;
          });
          data = DoughnutChartOptions.series.data;
          text = "" + overdue;
          subText = TrainingStatusChartLabelTypes.OVERDUE;
          color = Colors.latest_red_varient;
        }
        DoughnutChartOptions.title.text = text;
        DoughnutChartOptions.title.subtext = subText;
        DoughnutChartOptions.title.subtextStyle.color = color;
        DoughnutChartOptions.series.data = data as any[];
        myChart?.setOption(DoughnutChartOptions);
      },
      [tabValue]
    );
    useEffect(() => {
      myChart = echarts.init(
        document.getElementById("main") as HTMLInputElement
      );
      myChart.setOption(DoughnutChartOptions, true);
      window.onresize = function () {
        myChart.resize();
      };
      myChart.on("mouseover", (evt: any) => {
        DoughnutChartOptions.series.data.map((data, index) => {
          if (index === 0 && evt?.dataIndex === index) {
            DoughnutChartOptions.series.data[index].itemStyle.color =
              Colors.latest_yellow_varient;
            DoughnutChartOptions.series.data[index + 1].itemStyle.color =
              Colors.gray;
          }
          if (index === 1 && evt?.dataIndex === index) {
            DoughnutChartOptions.series.data[index].itemStyle.color =
              Colors.latest_red_varient;
            DoughnutChartOptions.series.data[index - 1].itemStyle.color =
              Colors.gray;
          }
        });
        DoughnutChartOptions.title.text = evt?.data?.value;
        DoughnutChartOptions.title.subtext = evt?.data?.name;
        if (evt.data?.name === TrainingStatusChartLabelTypes.OVERDUE) {
          DoughnutChartOptions.title.subtextStyle.color =
            Colors.latest_red_varient;
        } else if (evt.data?.name === TrainingStatusChartLabelTypes.DUE) {
          DoughnutChartOptions.title.subtextStyle.color =
            Colors.latest_yellow_varient;
        }
        myChart.setOption(DoughnutChartOptions);
      });
      myChart.on("mouseout", (e: any) => {
        updateChart(tabValue);
      });
      updateChart(tabValue);
      return () => {
        myChart.off("mouseover");
        myChart.off("mouseout");
      };
    }, [tabValue, dueInSeven, overdue, totalCount]);

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
            <Box
              component="div"
              id="main"
              className={classes.chartScroll}
            ></Box>
          </Grid>
        </Grid>
      </Box>
    );
  };

export default React.memo(TrainingChartPresenter);
