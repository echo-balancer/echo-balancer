import { useEffect, useState } from 'react'
import { Radar } from "react-chartjs-2";
import { CompareFriends } from "./CompareFriends";

function RadarChart({ friends }) {
  const myData = {
    label: 'Your network diversity',
    data: [4, 2.3, 3, 2.1, 1.5],
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
    scales: {
      r: {
        max: 4,
        min: 0,
        ticks: {
          stepSize: 1,
          showLabelBackdrop: false,
          color: "rgba(156, 163, 175, 0.75)",
          z: 5,
          callback: function (value, index, values) {
            switch(value) {
              case 4:
                return "High";
              case 3:
                return "Medium"
              case 2:
                return "Low"
              default:
                return ""
            }
          }
        },
      }
    },
  }

  useEffect(() => {
    if(compareData) {
      setDataset([myData, compareData]);
    }
  }, [compareData]);

  return (
    <>
      <Radar data={data} options={options}/>
      <CompareFriends friends={friends} compareData={compareData} setCompareData={setCompareData} />
    </>
  );
}

export default RadarChart;
