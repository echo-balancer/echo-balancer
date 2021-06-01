import { useEffect, useState } from 'react'
import { Radar } from "react-chartjs-2";
import { CompareFriends } from "./CompareFriends";

function RadarChart() {

  const myData = {
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
  }

  const [compareData, setCompareData] = useState();
  const [dataSet, setDataset] = useState([myData]);

  const data = {
    labels: [
      'Black',
      'White',
      'Latino',
      'Unknown',
      'AAPI',
    ],
    datasets: dataSet,
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

  useEffect(() => {
    if(compareData) {
      setDataset([myData, compareData]);
    }
  }, [compareData]);

  return (
    <>
      <Radar data={data} options={options}/>
      <CompareFriends compareData={compareData} setCompareData={setCompareData} />
    </>
  );
}

export default RadarChart;
