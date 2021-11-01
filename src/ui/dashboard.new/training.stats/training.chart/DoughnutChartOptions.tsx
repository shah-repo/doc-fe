import Colors from "../../../layout/theme/utils/colors";

const DoughnutChartOptions = {
  title: {
    text: "16",
    subtext: "Total Outstanding",
    padding: [-10, 0, 0, 0],
    textStyle: {
      color: "black",
      fontSize: 59,
    },
    subtextStyle: {
      color: "grey",
      fontSize: 12,
    },
    itemGap: -20,
    left: "center",
    top: "center",
  },
  tooltip: {
    trigger: "item",
  },
  colorBy: "data",
  series: {
    type: "pie",
    radius: ["68%", "93%"],
    avoidLabelOverlap: false,
    legend: {
      show: false,
    },
    tooltip: {
      show: false,
    },
    itemStyle: {
      borderColor: Colors.white,
      borderWidth: 2,
    },
    label: {
      show: false,
      position: "center",
    },
    emphasis: {
      label: {
        show: false,
      },
    },
    data: [
      {
        value: 12,
        name: "Due in 7 days",
        itemStyle: {
          color: Colors.latest_yellow_varient,
        },
      },
      {
        value: 3,
        name: "Overdue",
        itemStyle: {
          color: Colors.latest_red_varient,
        },
      },
    ],
  },
};

export default DoughnutChartOptions;
