import {
  Switch,
  Route,
  NavLink,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import { HumanRaceChart } from './HumanRaceChart';

const tabs = [
  { name: 'All', to: '' },
  { name: 'Black', to: '/black' },
  { name: 'AAPI', to: '/aapi' },
  { name: 'Latino', to: '/latino' },
  { name: 'White', to: '/white' },
  { name: 'Other', to: '/other' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Report({ diversityData }) {
  let { path, url } = useRouteMatch();

  return (
    <div className="mx-8 mt-2">
      <h2 id="diversity-report-navigation" className="font-bold text-gray-800">
        Your following's diversity distribution
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
              'text-gray-500',
              'bg-gray-100',
              'group relative min-w-0 flex-1 overflow-hidden rounded-full py-1 px-1 text-xs text-center focus:z-10'
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
  // TODO: support toggle to influencer mode
  // API format
  // const apiData = {
  //   influencer_other: 3,
  //   influencer_pctapi: 15,
  //   influencer_pctblack: 12,
  //   influencer_pcthispanic: 5,
  //   influencer_pctwhite: 65,
  //   influencer_total_count: 109,
  //   other: 3,
  //   pctapi: 19,
  //   pctblack: 12,
  //   pcthispanic: 5,
  //   pctwhite: 61,
  //   total_count: 129,
  // };
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
    races = ['Black', 'AAPI', 'Latino', 'White', 'Other'];
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
