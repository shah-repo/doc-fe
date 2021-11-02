import Colors from "../../../layout/theme/utils/colors";

const DoughnutChartOptions = {
  title: {
    text: "",
    subtext: "",
    padding: [-10, 0, 0, 0],
    textStyle: {
      color: Colors.black,
      fontSize: 59,
    },
    subtextStyle: {
      color: "",
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
        value: 0,
        name: "",
        itemStyle: {
          color: Colors.latest_yellow_varient,
        },
      },
      {
        value: 0,
        name: "",
        itemStyle: {
          color: Colors.latest_red_varient,
        },
      },
    ],
  },
};

export default DoughnutChartOptions;
