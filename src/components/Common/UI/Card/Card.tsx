import './Card.scss';

interface CardProps {
  className?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ className, style, children }) => {
  return (
    <div className={`card${className ? ` ${className}` : ''}`} style={style}>
      {children}
    </div>
  );
};

export default Card;
