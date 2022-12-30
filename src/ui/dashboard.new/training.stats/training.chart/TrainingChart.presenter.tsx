import { Box, Tab, Typography } from "@material-ui/core";
import * as echarts from "echarts";
import React, { useCallback, useEffect } from "react";
import { TrainingStatusChartLabelTypes } from "../../../../state/ducks/dashboard.new/training.stats/types";
import Text from "../../../components/Text";
import Colors from "../../../layout/theme/utils/colors";
import { linearScale } from "../../line.items/common/Utils";
import { StyledTabs } from "../../StyledTabs";
import DoughnutChartOptions from "./DoughnutChartOptions";
import { styles } from "./TrainingChart.styles";

interface TrainingChartPresenterProps {
  overdue: number;
  dueInSeven: number;
  tabValue: number;
  infoChangeTab: (newValue: number) => void;
}

const TrainingChartPresenter: React.FunctionComponent<TrainingChartPresenterProps> =
  ({ overdue, dueInSeven, tabValue, infoChangeTab }) => {
    const totalCount = overdue + dueInSeven;
    const scaleNumber = linearScale([0, totalCount], [1, 50]);
    const getScaledValue = (value: number) => {
      if (value === 0) { return 0; }
      return Math.floor(scaleNumber(value));
    };
    const overDueScaledCount = getScaledValue(overdue);
    const totalScaledCount = getScaledValue(totalCount);
    const dueInSevenScaledCount = getScaledValue(dueInSeven);
    const data = [
      {
        value:
          overDueScaledCount === totalScaledCount
            ? overDueScaledCount - dueInSevenScaledCount
            : overDueScaledCount,
        name: TrainingStatusChartLabelTypes.OVERDUE,
        itemStyle: {
          color: Colors.latest_red_varient,
        },
        detail: {
          show: false,
        },
        title: {
          show: false,
        },
      },
      {
        value:
          dueInSeven === 0
            ? dueInSevenScaledCount
            : totalScaledCount,
        name: TrainingStatusChartLabelTypes.DUE,
        itemStyle: {
          color: Colors.latest_yellow_varient,
        },
        detail: {
          show: false,
        },
        title: {
          show: false,
        },
      },
    ];
    const defaultTitle = {
      text: "" + totalCount,
      subtext: TrainingStatusChartLabelTypes.TOTAL_OUTSTANDING,
      textStyle: {
        fontWeight: "bold",
        color: Colors.almost_black,
        fontSize: 40,
      },
      subtextStyle: {
        fontWeight: "bold",
        color: Colors.font_gray,
        fontSize: 12,
        lineHeight: 50,
      },
      itemGap: -20,
      left: "center",
      top: "55%",
    };
    DoughnutChartOptions.title = defaultTitle;
    DoughnutChartOptions.series.data = data;
    DoughnutChartOptions.series.max = totalScaledCount + 0.001;
    let myChart;
    const classes = styles();
    const updateChart = useCallback(
      (tabValue) => {
        let text = "";
        let subText = "";
        let color = "";
        if (tabValue === 0) {
          text = "" + totalCount;
          subText = TrainingStatusChartLabelTypes.TOTAL_OUTSTANDING;
          color = Colors.gray;
          DoughnutChartOptions.series.data[0].itemStyle.color =
          Colors.latest_red_varient;
          DoughnutChartOptions.series.data[1].itemStyle.color =
          Colors.latest_yellow_varient;
        } else if (tabValue === 2) {
          text = "" + dueInSeven;
          subText = TrainingStatusChartLabelTypes.DUE;
          color = Colors.latest_yellow_varient;
          DoughnutChartOptions.series.data[0].itemStyle.color =
          Colors.platinum_grey;
          DoughnutChartOptions.series.data[1].itemStyle.color =
          Colors.latest_yellow_varient;
        } else if (tabValue === 1) {
          text = "" + overdue;
          subText = TrainingStatusChartLabelTypes.OVERDUE;
          color = Colors.latest_red_varient;
          DoughnutChartOptions.series.data[0].itemStyle.color =
          Colors.latest_red_varient;
          DoughnutChartOptions.series.data[1].itemStyle.color =
          Colors.platinum_grey;
        }
        DoughnutChartOptions.title.text = text;
        DoughnutChartOptions.title.subtext = subText;
        DoughnutChartOptions.title.subtextStyle.color = color;
        DoughnutChartOptions.series.max = getScaledValue(totalCount) + 0.001;
        myChart?.setOption(DoughnutChartOptions);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [tabValue]
    );
    useEffect(() => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      myChart = echarts.init(
        document.getElementById("training-chart") as HTMLInputElement
      );
      myChart.setOption(DoughnutChartOptions);
      window.onresize = function() {
        myChart.resize();
      };
      myChart.on("mouseover", (evt: any) => {
        DoughnutChartOptions.series.data.forEach((data, index) => {
          if (index !== evt?.dataIndex) {
            DoughnutChartOptions.series.data[index].itemStyle.color =
              Colors.platinum_grey;
          }
          if (index === evt?.dataIndex && index === 0 ) {
            DoughnutChartOptions.series.data[index].itemStyle.color =
              Colors.latest_red_varient;
            DoughnutChartOptions.title.text = overdue.toString();
          }
          if (index === evt?.dataIndex && index === 1 ) {
            DoughnutChartOptions.series.data[index].itemStyle.color =
              Colors.latest_yellow_varient;
            DoughnutChartOptions.title.text = dueInSeven.toString();
          }
        });
        DoughnutChartOptions.title.subtext = evt?.data?.name;
        if (evt.data?.name === TrainingStatusChartLabelTypes.OVERDUE) {
          DoughnutChartOptions.title.subtextStyle.color =
            Colors.latest_red_varient;
        } else if (evt.data?.name === TrainingStatusChartLabelTypes.DUE) {
          DoughnutChartOptions.title.subtextStyle.color =
            Colors.latest_yellow_varient;
          DoughnutChartOptions.title.text = dueInSeven.toString();
        }
        myChart.setOption(DoughnutChartOptions);
      });
      myChart.on("mouseout", (e: any) => {
        DoughnutChartOptions.series.data[0].itemStyle.color =
        Colors.latest_red_varient;
        DoughnutChartOptions.series.data[1].itemStyle.color =
        Colors.latest_yellow_varient;
        updateChart(tabValue);
      });
      updateChart(tabValue);
      return () => {
        myChart.off("mouseover");
        myChart.off("mouseout");
      };
    }, [tabValue, dueInSeven, overdue, totalCount]);

    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
      infoChangeTab(newValue);
    };
    function tabCustomClasses(index: any) {
      return {
        "id": `full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`,
      };
    }

    return (
      <Box
        className={classes.chartContainer}
        padding={2}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            <Text translation="training.stats.title" />
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center">
          <div id="training-chart" className={classes.chartScroll}></div>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" marginTop={2}>
          <StyledTabs
            value={value}
            onChange={handleChange}
            style={{ minHeight: 30 }}
          >
            <Tab
              classes={{ root: classes.tab }}
              label={
                <Box alignItems="center">
                  <span className={`${classes.tabHeader} ${value !== 0 && classes.inactive}`}>
                    <Text translation="training.stats.all" />
                  </span>
                </Box>
              }
              {...tabCustomClasses(0)}
            />
            <Tab
              classes={{ root: classes.tab }}
              label={
                <Box alignItems="center">
                  <span className={classes.overdueTab}></span>
                  < span className={`${classes.tabHeader} ${classes.legend} ${value !== 1 && classes.inactive}`}>
                    <Text translation="common.overdue" />
                  </span>
                </Box>
              }
              {...tabCustomClasses(2)}
            />
            <Tab
              classes={{ root: classes.tab }}
              label={
                <Box alignItems="center">
                  <span className={classes.dueInSevenTab}></span>
                  <span className={`${classes.tabHeader} ${classes.legend} ${value !== 2 && classes.inactive}`}>
                    <Text translation="common.duein7days" />
                  </span>
                </Box>
              }
              {...tabCustomClasses(1)}
            />
          </StyledTabs>
        </Box>
      </Box>
    );
  };

export default React.memo(TrainingChartPresenter);
