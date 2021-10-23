import './Tooltip.scss';

interface TooltipProps {
  style?: React.CSSProperties;
  text: string;
  direction?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  style,
  text,
  direction,
  children,
}) => {
  return (
    <div className={`tooltip ${direction}`} data-text={text} style={style}>
      {children}
    </div>
  );
};

export default Tooltip;
