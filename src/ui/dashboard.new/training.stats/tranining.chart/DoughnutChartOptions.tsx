import Colors from "../../../layout/theme/utils/colors";

const DoughnutChartOptions = {
  tooltip: {
    trigger: "item",
  },
  color: [Colors.latest_yellow_varient, Colors.latest_red_varient],
  series: [
    {
      name: "Total Outstanding",
      type: "pie",
      radius: ["65%", "90%"],
      avoidLabelOverlap: false,
      legend: {
        show: true,
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
          show: true,
          formatter: (params) => params.data.value + "  " + params.data.name,
          // formatter: "{c} {b}",
          fontSize: "20",
          fontWeight: "bold",
        },
      },
      data: [
        { value: 1048, name: "Low" },
        { value: 735, name: "Medium" },
        { value: 580, name: "High" },
        { value: 484, name: "Urgent" },
      ],
    },
  ],
};

export default DoughnutChartOptions;
