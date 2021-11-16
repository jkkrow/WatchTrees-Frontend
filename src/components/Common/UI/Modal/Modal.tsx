import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from '../Backdrop/Backdrop';
import Button from 'components/Common/Element/Button/Button';
import './Modal.scss';

interface ModalProps {
  on: boolean;
  type: 'form' | 'image' | 'message';
  header?: string;
  footer?: string;
  disabled?: boolean;
  invalid?: boolean;
  onConfirm?: () => Promise<any>;
  onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  on,
  type,
  header,
  footer,
  disabled,
  invalid,
  onConfirm,
  onClose,
  children,
}) => {
  const [displayModal, setDisplayModal] = useState(on);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    on && setDisplayModal(!!on);
  }, [on]);

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    onConfirm && (await onConfirm());
    setLoading(false);
    setDisplayModal(false);
  };

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
        <div className="modal">
          {type === 'image' && children}
          {type !== 'image' && (
            <form onSubmit={submitHandler}>
              <h3 className="modal__header">{header}</h3>
              <div className="modal__content">{children}</div>
              <div className="modal__footer">
                {type === 'form' && (
                  <Button
                    small
                    invalid={invalid}
                    loading={loading}
                    disabled={disabled}
                  >
                    {footer}
                  </Button>
                )}
                <Button type="button" small onClick={closeModalHandler}>
                  {type === 'form' ? 'CANCEL' : 'OK'}
                </Button>
              </div>
            </form>
          )}
        </div>
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
