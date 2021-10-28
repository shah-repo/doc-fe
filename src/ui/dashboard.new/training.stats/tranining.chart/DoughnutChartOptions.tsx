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
      borderColor: "#fff",
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
          color: "#FEAA2C",
        },
      },
      {
        value: 3,
        name: "Overdue",
        itemStyle: {
          color: "#EC2B00",
        },
      },
    ],
  },
};

export default DoughnutChartOptions;
