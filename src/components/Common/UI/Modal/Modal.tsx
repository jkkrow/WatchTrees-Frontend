import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Button from 'components/Common/Element/Button/Button';
import './Modal.scss';

interface ModalProps {
  className?: string;
  style?: React.CSSProperties;
  on: boolean;
  data: any;
  onConfirm?: () => void;
  onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  className,
  style,
  on,
  data,
  onConfirm,
  onClose,
}) => {
  const [displayModal, setDisplayModal] = useState(!!on);
  const [modalData, setModalData] = useState(data || {});

  useEffect(() => {
    on && setDisplayModal(!!on);
    data && setModalData(data);
  }, [on, data]);

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
        <form
          className={`modal${className ? ' ' + className : ''}`}
          style={style}
          onSubmit={submitHandler}
        >
          <h3 className="modal__header">{modalData.header}</h3>
          <div className="modal__content">{modalData.content}</div>
          <div className="modal__footer">
            {modalData.type && (
              <Button
                small
                loading={modalData.loading}
                disabled={modalData.disabled}
              >
                {modalData.type}
              </Button>
            )}
            <Button type="button" small onClick={closeModalHandler}>
              {modalData.type ? 'CANCEL' : 'OK'}
            </Button>
          </div>
        </form>
      </CSSTransition>
      <CSSTransition
        in={displayModal}
        classNames="backdrop"
        timeout={200}
        mountOnEnter
        unmountOnExit
      >
        <div className="modal__backdrop" onClick={closeModalHandler} />
      </CSSTransition>
    </>,
    document.getElementById('modal-hook')!
  );
};

export default Modal;
