export const optionsRadial = (theme) => {
  const primCol = theme.palette.primary.main.replace('rgb(', 'rgba(');
  const secCol = theme.palette.secondary.main.replace('rgb(', 'rgba(');

  return {
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24
          }
        },

        track: {
          background: '#fff',
          strokeWidth: '67%',
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35
          }
        },

        dataLabels: {
          showOn: 'always',
          name: {
            show: false,
            color: '#888',
            fontSize: '13px'
          },
          value: {
            formatter: function (val) {
              return val + '%';
            },
            color: '#111',
            offsetY: 7,
            fontSize: '18px',
            show: true
          }
        }
      }
    },
    fill: {
      colors: [primCol],
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: [secCol], // A light green color as the end of the gradient.
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: []
  };
};
