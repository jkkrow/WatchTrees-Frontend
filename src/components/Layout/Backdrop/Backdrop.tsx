import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './Backdrop.scss';

interface BackdropProps {
  on: boolean;
  className?: string;
  opacity?: number;
  onClick: () => void;
}

const Backdrop: React.FC<BackdropProps> = ({
  on,
  className,
  opacity = 0.7,
  onClick,
}) =>
  createPortal(
    <CSSTransition
      in={on}
      classNames="backdrop"
      timeout={300}
      mountOnEnter
      unmountOnExit
    >
      <div
        className={`backdrop ${className}`}
        style={{ backgroundColor: `rgba(0, 0, 0, ${opacity})` }}
        onClick={onClick}
      />
    </CSSTransition>,
    document.getElementById('backdrop-hook')!
  );

export default Backdrop;
