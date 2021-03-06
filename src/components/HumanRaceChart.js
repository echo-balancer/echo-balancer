import { ReactComponent as AAPIFigure } from './figures/aapi.svg';
import { ReactComponent as BlackFigure } from './figures/black.svg';
import { ReactComponent as LatinoFigure } from './figures/latino.svg';
import { ReactComponent as OtherFigure } from './figures/other.svg';
import { ReactComponent as WhiteFigure } from './figures/white.svg';
import { ReactComponent as DefaultFigure } from './figures/default.svg';

const map = {
  All: OtherFigure,
  AAPI: AAPIFigure,
  Black: BlackFigure,
  Latino: LatinoFigure,
  White: WhiteFigure,
  Other: OtherFigure,
  Default: DefaultFigure,
};

export function HumanRaceChart({ races, data }) {
  const stats = races.map((race) => ({ race, percentage: data[race] }));
  const defaultPercentage = stats.reduce(
    (remaining, curr) => remaining - curr.percentage,
    100
  );
  stats.push({ race: 'Default', percentage: defaultPercentage });
  const figures = stats.flatMap(({ race, percentage }) =>
    new Array(percentage).fill(map[race])
  );
  return (
    <div>
      <div className="flex justify-around my-2 space-x-1.5">
        {stats.slice(0, -1).map(({ race, percentage }) => (
          <FigureWithDescription key={race} race={race} percentage={percentage} />
        ))}
      </div>

      <div className="grid grid-cols-10">
        {figures.map((Component, index) => (
          <div key={index} className="flex justify-center">
            <Component />
          </div>
        ))}
      </div>
    </div>
  );
}

function FigureWithDescription({ race, percentage }) {
  const RaceComponent = map[race];
  return (
    <div className="flex flex-row items-center">
      <div className="flex flex-col">
        <span className="text-lg font-bold leading-5">{percentage}%</span>
        <span className="text-xs">{race}</span>
      </div>
      <RaceComponent />
    </div>
  );
}
