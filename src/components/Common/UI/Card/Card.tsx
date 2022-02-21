import { forwardRef } from 'react';

import './Card.scss';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  style?: React.CSSProperties;
}

const Card = forwardRef<HTMLDivElement, React.PropsWithChildren<CardProps>>(
  ({ className, style, children, ...rest }, ref) => {
    return (
      <div
        {...rest}
        className={`card${className ? ` ${className}` : ''}`}
        style={style}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

export default Card;
