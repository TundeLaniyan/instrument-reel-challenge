import "./InstrumentReel.css";

interface InstrumentProps {
  name: string;
  category: string;
  code: string;
  pair: string[];
  lastQuote: number;
  percentage?: number;
}

function Instrument({
  name,
  category,
  code,
  lastQuote,
  percentage,
}: InstrumentProps) {
  const valueClass = `value ${
    percentage &&
    (percentage > 0
      ? "value--positive"
      : percentage < 0
      ? "value--negative"
      : "")
  }`;
  return (
    <div className="instrument">
      <div className="svg-container">
        <img className="svg" src={`./${category}/${code}.svg`} />
      </div>
      <h4 className="trade">{name}</h4>
      <p className={valueClass}>{lastQuote}</p>
      <div className={valueClass}>
        {Boolean(percentage) && percentage > 0 && "+"}{" "}
        {(percentage && percentage.toFixed(3)) || 0}%
      </div>
    </div>
  );
}

export default Instrument;
