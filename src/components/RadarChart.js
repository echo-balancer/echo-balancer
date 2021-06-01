import { Radar } from "react-chartjs-2";

function RadarChart() {
  const data = {
    labels: [
      'Black',
      'White',
      'Latino',
      'Unknown',
      'AAPI',
    ],
    datasets: [{
      label: 'Your network diversity',
      data: [65, 59, 90, 81, 56],
      fill: true,
      backgroundColor: 'rgba(130, 232, 249, 0.4)',
      borderColor: 'rgba(130, 232, 249)',
      pointBackgroundColor: 'rgba(130, 232, 249)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(130, 232, 249)',
      pointStyle: 'circle'
    }, {
      label: "Alex Wong's network diversity",
      data: [28, 48, 40, 19, 96],
      fill: true,
      backgroundColor: 'rgba(165, 180, 252, 0.4)',
      borderColor: 'rgba(165, 180, 252)',
      pointBackgroundColor: 'rgba(165, 180, 252)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(165, 180, 252)',
      pointStyle: 'circle'
    }]
  }

  const options = {
    cale: {
      ticks: { beginAtZero: true },
    },
    scales: {
      r: {
          min: 0,
          max: 100,
      }
    }
  }

  return (
    <>
      <Radar data={data} options={options}/>
    </>
  );
}

export default RadarChart;
