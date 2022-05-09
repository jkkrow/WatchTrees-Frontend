import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from '../Backdrop/Backdrop';
import './Modal.scss';

interface ModalProps {
  on: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ on, onClose, children }) => {
  const [displayModal, setDisplayModal] = useState(on);

  useEffect(() => {
    setDisplayModal(on);
  }, [on]);

  const closeModalHandler = () => {
    setDisplayModal(false);
  };

  return createPortal(
    <>
      <CSSTransition
        in={displayModal}
        classNames="modal"
        timeout={300}
        mountOnEnter
        unmountOnExit
        onExited={onClose}
      >
        <div className="modal">{children}</div>
      </CSSTransition>
      <Backdrop
        className="modal__backdrop"
        on={displayModal}
        onClick={closeModalHandler}
      />
    </>,
    document.getElementById('modal-hook')!
  );
};

export default Modal;
