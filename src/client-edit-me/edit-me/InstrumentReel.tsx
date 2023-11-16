/**
 * ☑️ You can edit MOST of this file to add your own styles.
 */

/**
 * ✅ You can add/edit these imports
 */
import { InstrumentSymbol } from "../../common-leave-me";
import { InstrumentSocketClient } from "./InstrumentSocketClient";
import "./InstrumentReel.css";
import { useEffect, useState } from "react";
import Slider from "./Slider";
import Instrument from "./Instrument";

/**
 * ❌ Please do not edit this
 */
const client = new InstrumentSocketClient();

/**
 * ❌ Please do not edit this hook name & args
 */
function useInstruments(instrumentSymbols: InstrumentSymbol[]) {
  /**
   * ✅ You can edit inside the body of this hook
   */
}

export interface InstrumentReelProps {
  instrumentSymbols: InstrumentSymbol[];
}

type State = {
  name: string;
  category: string;
  code: string;
  pair: string[];
  lastQuote: number;
}[];

function InstrumentReel({ instrumentSymbols }: InstrumentReelProps) {
  /**
   * ❌ Please do not edit this
   */
  const instruments = useInstruments(instrumentSymbols);

  /**
   * ✅ You can edit from here down in this component.
   * Please feel free to add more components to this file or other files if you want to.
   */

  const [state, setState] = useState<State>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    client.initialise(instrumentSymbols);
    client.onUpdate((instruments) => {
      setState((prevState) =>
        instruments
          .filter((cur) => instrumentSymbols.includes(cur.code))
          .map((cur, idx) => ({
            ...cur,
            percentage:
              (100 * (cur.lastQuote - (prevState[idx]?.lastQuote || 0))) /
                prevState[idx]?.lastQuote || 0,
          }))
      );
      setIsLoading(false);
    });
  }, [instrumentSymbols]);

  return (
    <div className="instrument-reel">
      {isLoading ? (
        <div className="loading">Loading Instruments...</div>
      ) : (
        <Slider length={state.length}>
          {state.map((cur) => (
            <Instrument key={cur.name} {...cur} />
          ))}
        </Slider>
      )}
    </div>
  );
}

export default InstrumentReel;
