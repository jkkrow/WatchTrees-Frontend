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
  return (
    <div
      className={`tooltip ${direction}${invalid ? ' invalid' : ''}${
        !text ? ' hide' : ''
      }`}
      data-text={text}
      style={style}
    >
      {children}
    </div>
  );
};

export default Tooltip;
