var main = (() => {
  let _data = {
    option: {
      title: {
        text: '',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} \n{b} : {d}%',
      },
      toolbox: {},
      legend: {
        data: ['Show', 'Click', 'Visit', 'Inquiry', 'Order'],
        bottom: '1rem',
      },
      series: [
        {
          name: '转化漏斗图',
          type: 'funnel',
          minSize: '1%',
          maxSize: '100%',
          sort: 'descending',
          label: {
            show: true,
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid',
            },
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
          },
          emphasis: {
            label: {
              fontSize: 16,
            },
          },
          data: [
            {
              value: 60,
              name: 'Visit',
            },
            {
              value: 40,
              name: 'Inquiry',
            },
            {
              value: 20,
              name: 'Order',
            },
            {
              value: 80,
              name: 'Click',
            },
            {
              value: 100,
              name: 'Show',
            },
          ],
        },
      ],
    },
  };

  function graphMaker(dataArr) {
    let xDataArr = dataArr.map((obj) => obj['name']);
    let yDataArr = dataArr;

    let option = { ..._data.option };
    option.legend.data = xDataArr;
    option.series[0].data = yDataArr;
    return _data.option;
  }
  return {
    graphMaker,
  };
})();
export default main;
