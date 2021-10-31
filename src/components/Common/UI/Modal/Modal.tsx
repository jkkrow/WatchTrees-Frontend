import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from '../Backdrop/Backdrop';
import Button from 'components/Common/Element/Button/Button';
import './Modal.scss';

interface ModalProps {
  style?: React.CSSProperties;
  on: boolean;
  header: string;
  content: string | JSX.Element;
  footer?: string;
  loading?: boolean;
  disabled?: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  style,
  on,
  header,
  content,
  footer,
  loading,
  disabled,
  onConfirm,
  onClose,
}) => {
  const [displayModal, setDisplayModal] = useState(on);

  useEffect(() => {
    on && setDisplayModal(!!on);
  }, [on]);

  const submitHandler = (event: React.FormEvent): void => {
    event.preventDefault();

    onConfirm && onConfirm();
    setDisplayModal(false);
  };

  const closeModalHandler = (): void => {
    setDisplayModal(false);
  };

  return createPortal(
    <>
      <CSSTransition
        in={displayModal}
        classNames="modal"
        timeout={200}
        mountOnEnter
        unmountOnExit
        onExited={onClose}
      >
        <div className="modal">
          <form style={style} onSubmit={submitHandler}>
            <h3 className="modal__header">{header}</h3>
            <div className="modal__content">{content}</div>
            <div className="modal__footer">
              {footer && (
                <Button small loading={loading} disabled={disabled}>
                  {footer}
                </Button>
              )}
              <Button type="button" small onClick={closeModalHandler}>
                {footer ? 'CANCEL' : 'OK'}
              </Button>
            </div>
          </form>
        </div>
      </CSSTransition>
      <Backdrop className="modal__backdrop" on={displayModal} onClick={closeModalHandler} />
    </>,
    document.getElementById('modal-hook')!
  );
};

export default Modal;
