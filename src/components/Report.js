import {
  Switch,
  Route,
  NavLink,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { HumanRaceChart } from "./HumanRaceChart";

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

function LoadingSpin() {
  return (
    <div className="flex justify-around">
      <span className="inline-flex">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </span>
    </div>
  );
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

      <p className="text-gray-800 text-sm my-2 py-3">
        We believe that informational diversity fuels innovation, scroll down to
        discover a variety of diverse influencers to follow!
      </p>
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
