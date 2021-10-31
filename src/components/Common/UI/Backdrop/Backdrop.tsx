import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './Backdrop.scss';

interface BackdropProps {
  className?: string;
  on: boolean;
  onClick: () => void;
}

const Backdrop: React.FC<BackdropProps> = ({ className, on, onClick }) =>
  createPortal(
    <CSSTransition in={on} classNames="backdrop" timeout={200} mountOnEnter unmountOnExit>
      <div className={`backdrop ${className}`} onClick={onClick} />
    </CSSTransition>,
    document.getElementById('backdrop-hook')!
  );

export default Backdrop;
