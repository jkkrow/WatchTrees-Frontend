import './Tooltip.scss';

interface TooltipProps {
  style?: React.CSSProperties;
  text: string;
  invalid?: boolean;
  direction?: 'top' | 'left' | 'bottom' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({
  style,
  text,
  direction = 'right',
  invalid = false,
  children,
}) => {
  return text ? (
    <div
      className={`tooltip ${direction}${invalid ? ' invalid' : ''}`}
      data-text={text}
      style={style}
    >
      {children}
    </div>
  ) : null;
};

export default Tooltip;
