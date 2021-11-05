import './Tooltip.scss';

interface TooltipProps {
  style?: React.CSSProperties;
  text: string;
  direction?: 'top' | 'left' | 'bottom' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({
  style,
  text,
  direction = 'right',
  children,
}) => {
  return text ? (
    <div className={`tooltip ${direction}`} data-text={text} style={style}>
      {children}
    </div>
  ) : null;
};

export default Tooltip;
