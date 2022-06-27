import { useEffect, useState, useRef } from 'react';

import Modal from '../Modal';
import Button from 'components/Common/Element/Button/Button';
import './FormModal.scss';

interface FormModalProps {
  on: boolean;
  header: string;
  content: React.ReactNode;
  footer: string;
  loading?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  preventEnterSubmit?: boolean;
  onConfirm: () => Promise<any>;
  onClose: () => void;
}

const FormModal: React.FC<FormModalProps> = ({
  on,
  header,
  content,
  footer,
  loading,
  disabled,
  invalid,
  preventEnterSubmit,
  onConfirm,
  onClose,
}) => {
  const [displayModal, setDisplayModal] = useState(on);
  const isUnmounted = useRef(false);

  useEffect(() => {
    setDisplayModal(on);
  }, [on]);

  useEffect(() => {
    return () => {
      isUnmounted.current = true;
    };
  }, []);

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    onConfirm && (await onConfirm());

    if (isUnmounted.current) return;

    setDisplayModal(false);
  };

  const closeModalHandler = () => {
    setDisplayModal(false);
  };

  const formKeyHandler = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && preventEnterSubmit) {
      event.preventDefault();
    }
  };

  return (
    <Modal on={displayModal} onClose={onClose}>
      <form
        className="form-modal"
        onSubmit={submitHandler}
        onKeyDown={formKeyHandler}
      >
        <h3 className="form-modal__header">{header}</h3>
        <div className="form-modal__content">{content}</div>
        <div className="form-modal__footer">
          <Button small invalid={invalid} loading={loading} disabled={disabled}>
            {footer.toUpperCase()}
          </Button>
          <Button small inversed type="button" onClick={closeModalHandler}>
            CANCEL
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;
