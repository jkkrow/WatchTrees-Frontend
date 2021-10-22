import "./Tooltip.scss";

const Tooltip = ({ style, text, direction = "", children }) => {
  return (
    <div className={`tooltip ${direction}`} data-text={text} style={style}>
      {children}
    </div>
  );
};

export default Tooltip;
