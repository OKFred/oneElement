var main = (() => {
  let _data = {
    option: {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}',
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '客户分类图',
          data: [
            120,
            {
              value: 200,
              itemStyle: {
                color: '#a90000',
              },
            },
            150,
            80,
            70,
            110,
            130,
          ],
          type: 'bar',
        },
      ],
    },
  };

  function graphMaker(dataArr) {
    let xDataArr = dataArr.map((obj) => obj['分类']);
    let yDataArr = dataArr.map((obj) => {
      if (/90d/.test(obj['分类']))
        return {
          value: obj['数量'],
          itemStyle: {
            color: 'sandybrown',
          },
        };
      else if (/12h/.test(obj['分类']))
        return {
          value: obj['数量'],
          itemStyle: {
            color: 'orange',
          },
        };
      return {
        value: obj['数量'],
        itemStyle: {
          color: 'lightcoral',
        },
      };
    });

    let option = { ..._data.option };
    option.xAxis.data = xDataArr;
    option.series[0].data = yDataArr;
    return _data.option;
  }
  return {
    graphMaker,
  };
})();
export default main;
