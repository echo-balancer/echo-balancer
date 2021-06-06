import { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import { CompareFriends } from "./CompareFriends";
import { LoadingSpin } from "./LoadingSpin";

function RadarChart({ diversityData, friends }) {
  const [friendLabel, setFriendLabel] = useState();
  const [friendDiversityData, setFriendDiversityData] = useState();

  const myData = {
    label: "Your network diversity",
    data: getScore(diversityData),
    fill: true,
    backgroundColor: "rgba(130, 232, 249, 0.4)",
    borderColor: "rgba(130, 232, 249)",
    pointBackgroundColor: "rgba(130, 232, 249)",
    pointBorderColor: "#fff",
    pointHoverBackgroundColor: "#fff",
    pointHoverBorderColor: "rgba(130, 232, 249)",
    pointStyle: "circle",
  };

  const compareData = {
    label: friendLabel,
    data: getScore(friendDiversityData),
    fill: true,
    backgroundColor: "rgba(165, 180, 252, 0.4)",
    borderColor: "rgba(165, 180, 252)",
    pointBackgroundColor: "rgba(165, 180, 252)",
    pointBorderColor: "#fff",
    pointHoverBackgroundColor: "#fff",
    pointHoverBorderColor: "rgba(165, 180, 252)",
    pointStyle: "circle",
  };

  const nationalData = {
    label: "National racial proportions*",
    data: [13.4, 76.3, 18.5, 6.0, 4.1].map(normalize),
    fill: true,
    backgroundColor: "rgba(209,209,209,0.2)",
    borderColor: "rgba(209,209,209,0.5)",
    pointBackgroundColor: "rgba(209,209,209)",
    pointBorderColor: "#fff",
    pointHoverBackgroundColor: "#fff",
    pointHoverBorderColor: "rgba(209,209,209)",
    pointStyle: "circle",
  };


  const [dataSet, setDataset] = useState([myData, nationalData]);

  const data = {
    labels: ["Black", "White", "Latino", "Other", "AAPI"],
    datasets: dataSet,
  };

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
            switch (value) {
              case 4:
                return ">=20%";
              case 3:
                return "15%";
              case 2:
                return "10%";
              default:
                return "";
            }
          },
        },
      },
    },
  };

  function getScore(diversity) {
    if (diversity) {
      return [
        diversity["influencer_pctblack"],
        diversity["influencer_pctwhite"],
        diversity["influencer_pcthispanic"],
        diversity["influencer_other"],
        diversity["influencer_pctapi"],
      ].map(normalize);
    } else {
      return [0, 0, 0, 0, 0].map(normalize);
    }
  }

  function normalize(score) {
    return Math.min(score, 20) / 5;
  }

  useEffect(() => {
    if (friendDiversityData) {
      setDataset([myData, compareData, nationalData]);
    }
  }, [friendLabel, friendDiversityData]);

  return diversityData === null ||
    (friendLabel && friendDiversityData === null) ? (
    <LoadingSpin />
  ) : (
    <>
      <Radar className="mt-8" data={data} options={options} />
      <CompareFriends
        friends={friends}
        setFriendLabel={setFriendLabel}
        setFriendDiversityData={setFriendDiversityData}
      />
    </>
  );
}

export default RadarChart;
