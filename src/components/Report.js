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

export function Report() {
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
          <RaceReport />
        </Route>
        <Route exact path={`${path}/:raceId`}>
          <RaceReport />
        </Route>
      </Switch>
    </div>
  );
}

function RaceReport() {
  const data = {
    total: 912,
    Black: 3,
    AAPI: 7,
    Latino: 12,
    White: 76,
    Other: 2,
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
        You are following{' '}
        <span className="text-base font-bold">{data.total}</span> accounts,
        among which:
      </p>
      <HumanRaceChart races={races} data={data} />
    </div>
  );
}
