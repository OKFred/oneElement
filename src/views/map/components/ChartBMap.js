let main = (() => {
  let _data = {
    option: {
      bmap: {
        center: [120.15, 30.25],
        zoom: 13,
        roam: true,
        // mapStyle: {
        //   styleJson: [
        //     {
        //       featureType: 'water',
        //       elementType: 'all',
        //       stylers: {
        //         color: '#d1d1d1',
        //       },
        //     },
        //     {
        //       featureType: 'land',
        //       elementType: 'all',
        //       stylers: {
        //         color: '#f3f3f3',
        //       },
        //     },
        //     {
        //       featureType: 'railway',
        //       elementType: 'all',
        //       stylers: {
        //         visibility: 'off',
        //       },
        //     },
        //     {
        //       featureType: 'highway',
        //       elementType: 'all',
        //       stylers: {
        //         color: '#fdfdfd',
        //       },
        //     },
        //     {
        //       featureType: 'highway',
        //       elementType: 'labels',
        //       stylers: {
        //         visibility: 'off',
        //       },
        //     },
        //     {
        //       featureType: 'arterial',
        //       elementType: 'geometry',
        //       stylers: {
        //         color: '#fefefe',
        //       },
        //     },
        //     {
        //       featureType: 'arterial',
        //       elementType: 'geometry.fill',
        //       stylers: {
        //         color: '#fefefe',
        //       },
        //     },
        //     {
        //       featureType: 'poi',
        //       elementType: 'all',
        //       stylers: {
        //         visibility: 'off',
        //       },
        //     },
        //     {
        //       featureType: 'green',
        //       elementType: 'all',
        //       stylers: {
        //         visibility: 'off',
        //       },
        //     },
        //     {
        //       featureType: 'subway',
        //       elementType: 'all',
        //       stylers: {
        //         visibility: 'off',
        //       },
        //     },
        //     {
        //       featureType: 'manmade',
        //       elementType: 'all',
        //       stylers: {
        //         color: '#d1d1d1',
        //       },
        //     },
        //     {
        //       featureType: 'local',
        //       elementType: 'all',
        //       stylers: {
        //         color: '#d1d1d1',
        //       },
        //     },
        //     {
        //       featureType: 'arterial',
        //       elementType: 'labels',
        //       stylers: {
        //         visibility: 'off',
        //       },
        //     },
        //     {
        //       featureType: 'boundary',
        //       elementType: 'all',
        //       stylers: {
        //         color: '#fefefe',
        //       },
        //     },
        //     {
        //       featureType: 'building',
        //       elementType: 'all',
        //       stylers: {
        //         color: '#d1d1d1',
        //       },
        //     },
        //     {
        //       featureType: 'label',
        //       elementType: 'labels.text.fill',
        //       stylers: {
        //         color: '#999999',
        //       },
        //     },
        //   ],
        // },
      },
      series: [
        {
          type: 'lines',
          coordinateSystem: 'bmap',
          data: [],
          polyline: true,
          lineStyle: {
            color: '#00BD00',
            opacity: 0.7,
            width: 7,
          },
        },
        {
          type: 'custom',
          coordinateSystem: 'bmap',
          renderItem: () => { },
          animation: false,
          silent: true,
          data: [0],
          z: -10,
          itemStyle: {
            opacity: 0.5,
          },
        },
      ],
    },
  };

  function graphMaker(dataArr, renderItem) {
    let option = { ..._data.option };
    option.series[0].data = dataArr; //多个点构成的面
    option.series[1].renderItem = renderItem;
    return _data.option;
  }
  return {
    graphMaker,
  };
})();
export default main;
