import { useEffect, useState } from "react";
import {
  Switch,
  Route,
  NavLink,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { cachedFetch } from "../utils/cachedFetch";
import { HumanRaceChart } from "./HumanRaceChart";
import { LoadingSpin } from "./LoadingSpin";
import {ReactComponent as TwitterLogo } from "./figures/twitter-logo.svg";

const tabs = [
  { name: "All", to: "" },
  { name: "Black", to: "/black" },
  { name: "AAPI", to: "/aapi" },
  { name: "Latino", to: "/latino" },
  { name: "White", to: "/white" },
  { name: "Other", to: "/other" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Report({ diversityData }) {
  let { path, url } = useRouteMatch();

  return diversityData === null ? (
    <LoadingSpin />
  ) : (
    <div className="mx-8 mt-2">
      <h2 id="diversity-report-navigation" className="font-bold text-gray-800">
        Your influencer's diversity report
      </h2>
      <nav
        className="relative z-0 flex my-2 space-x-1"
        aria-labelledby="diversity-report-navigation"
        aria-label="Divesity report tabs"
      >
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            exact
            to={`${url}${tab.to}`}
            activeClassName="bg-indigo-100 text-gray-900"
            className={classNames(
              "text-gray-500",
              "bg-gray-100",
              "group relative min-w-0 flex-1 overflow-hidden rounded-full py-1 px-1 text-xs text-center focus:z-10"
            )}
            aria-current="page"
          >
            {tab.name}
          </NavLink>
        ))}
      </nav>

      <Switch>
        <Route exact path={path}>
          <RaceReport diversityData={diversityData} />
        </Route>
        <Route exact path={`${path}/:raceId`}>
          <RaceReport diversityData={diversityData} />
        </Route>
      </Switch>

      <p className="py-3 my-2 text-sm text-gray-800">
        We believe that informational diversity fuels innovation, scroll down to
        discover a variety of diverse influencers to follow!
      </p>

      <InfluencerRecommendations />
    </div>
  );
}

function RaceReport({ diversityData }) {
  const data = diversityData
    ? {
        total: diversityData.total_count,
        Black: diversityData.pctblack,
        AAPI: diversityData.pctapi,
        Latino: diversityData.pcthispanic,
        White: diversityData.pctwhite,
        Other: diversityData.other,
      }
    : {
        total: 0,
        Black: 0,
        AAPI: 0,
        Latino: 0,
        White: 0,
        Other: 0,
      };
  let { raceId } = useParams();
  const race = tabs.find((t) => t.to.includes(raceId))?.name;
  let races;
  if (!race) {
    races = ["Black", "AAPI", "Latino", "White", "Other"];
  } else {
    races = [race];
  }

  return (
    <div>
      <p className="text-xs font-semibold">
        Based on <span className="text-base font-bold">{data.total}</span> of
        your following accounts:
      </p>
      <HumanRaceChart races={races} data={data} />
    </div>
  );
}

function InfluencerRecommendations() {
  const [influencers, setInfluencers] = useState([]);

  async function loadRecommendations() {
    const { json } = await cachedFetch("/api/influencer_recommendations");
    if (!json) {
      return;
    }
    const mapped = json.users.map(
      ({ name, description, profile_image_url_https, screen_name }) => ({
        name,
        description,
        imageUrl: profile_image_url_https,
        handle: screen_name,
        url: `https://twitter.com/${screen_name}`,
      })
    );
    setInfluencers(shuffle(mapped).slice(0, 20));
  }
  useEffect(() => {
    loadRecommendations();
  }, []);

  return (
    <div>
      <span className="inline-flex">
        <TwitterLogo className="mr-1 text-blue-500 fill-current" />
        Recommended accounts to follow
      </span>
      <div className="flow-root">
        <ul className="">
          {influencers.map((person) => (
            <li key={person.handle} className="px-4 py-2 my-2 rounded shadow">
              <div className="flex items-center w-full space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={person.imageUrl}
                    alt={person.name}
                  />
                </div>
                <div className="w-full">
                  <div className="flex">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {person.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {"@" + person.handle}
                      </p>
                    </div>
                    <div>
                      <a
                        href={person.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center shadow-sm mr-2.5 px-3.5 py-1.5 text-sm leading-5 font-medium rounded-full text-white bg-blue-400 hover:bg-blue-500"
                      >
                        Follow
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      {person.description}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
