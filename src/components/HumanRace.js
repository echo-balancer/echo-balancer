import { ReactComponent as AAPIFigure } from './figures/aapi.svg';
import { ReactComponent as BlackFigure } from './figures/black.svg';
import { ReactComponent as LatinoFigure } from './figures/latino.svg';
import { ReactComponent as OtherFigure } from './figures/other.svg';
import { ReactComponent as WhiteFigure } from './figures/white.svg';

const map = {
  All: OtherFigure,
  AAPI: AAPIFigure,
  Black: BlackFigure,
  Latino: LatinoFigure,
  Other: OtherFigure,
  White: WhiteFigure,
};

export function HumanRace({ race }) {
  const RaceComponent = map[race];
  return (
    <div>
      <p>Race: {race}</p>
      <RaceComponent />
    </div>
  );
}
