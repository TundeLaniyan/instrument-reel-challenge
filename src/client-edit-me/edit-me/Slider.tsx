import "./Slider.css";

function Slider({ children, length }: any) {
  const sliderQuick =
    "slider" +
    (!length || length > 3
      ? ""
      : length === 1
      ? " slider--very-quick"
      : " slider--quick");
  return (
    <div className="slider-container">
      <div className={sliderQuick}>{children}</div>
      <div className={sliderQuick}>{children}</div>
      <div className={sliderQuick}>{children}</div>
      <div className={sliderQuick}>{children}</div>
      <div className={sliderQuick}>{children}</div>
    </div>
  );
}

export default Slider;
