import { Box, Tab, Typography } from "@material-ui/core";
import * as echarts from "echarts";
import React, { useCallback, useEffect } from "react";
import { TrainingStatusChartLabelTypes } from "../../../../state/ducks/dashboard.new/training.stats/types";
import Text from "../../../components/Text";
import Colors from "../../../layout/theme/utils/colors";
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
    const data = [
      {
        value: overdue,
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
        value: dueInSeven === 0 ? dueInSeven : totalCount,
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
        fontFamily: "Sora",
        fontStyle: "normal",
        fontWeight: "bold",
        color: Colors.almost_black,
        fontSize: 40,
      },
      subtextStyle: {
        fontFamily: "Sora",
        fontStyle: "normal",
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
    DoughnutChartOptions.series.max = totalCount + 0.001;
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
        } else if (tabValue === 2) {
          text = "" + dueInSeven;
          subText = TrainingStatusChartLabelTypes.DUE;
          color = Colors.latest_yellow_varient;
        } else if (tabValue === 1) {
          text = "" + overdue;
          subText = TrainingStatusChartLabelTypes.OVERDUE;
          color = Colors.latest_red_varient;
        }
        DoughnutChartOptions.title.text = text;
        DoughnutChartOptions.title.subtext = subText;
        DoughnutChartOptions.title.subtextStyle.color = color;
        DoughnutChartOptions.series.data = data as any[];
        DoughnutChartOptions.series.max = totalCount + 0.001;
        myChart?.setOption(DoughnutChartOptions);
      },
      [tabValue]
    );
    useEffect(() => {
      myChart = echarts.init(
        document.getElementById("training-chart") as HTMLInputElement
      );
      myChart.setOption(DoughnutChartOptions);
      window.onresize = function() {
        myChart.resize();
      };
      myChart.on("mouseover", (evt: any) => {
        DoughnutChartOptions.title.text = evt?.data?.value;
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
                  <span className={classes.tabHeader}>
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
                  < span className={`${classes.tabHeader} ${classes.legend}`}>
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
                  <span className={`${classes.tabHeader} ${classes.legend}`}>
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
