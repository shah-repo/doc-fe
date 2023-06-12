import Colors from '../../../layout/theme/utils/colors';

const DoughnutChartOptions = {
  title: {
    text: '',
    subtext: '',
    textStyle: {
      color: Colors.black,
      fontSize: 59,
    },
    subtextStyle: {
      color: '',
      fontSize: 12,
    },
    itemGap: -20,
    left: 'center',
    top: 'center',
  },
  series: {
    type: 'gauge',
    center: ['50%', '100%'],
    startAngle: 180,
    endAngle: 0,
    max: 0,
    radius: '190%',
    anchor: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      show: false,
    },
    pointer: {
      show: false,
    },
    progress: {
      show: true,
      width: 35,
    },
    axisLine: {
      lineStyle: {
        width: 35,
      },
    },
    axisLabel: {
      show: false,
    },
    itemStyle: {
      borderColor: Colors.white,
      borderWidth: 2,
    },
    data: [
      {
        value: 0,
        name: '',
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
        value: 0,
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
    ],
    title: {
      fontSize: 14,
    },
  },
};

export default DoughnutChartOptions;
