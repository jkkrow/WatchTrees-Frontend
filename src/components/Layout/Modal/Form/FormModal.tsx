import { useEffect, useState } from 'react';

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
  onConfirm,
  onClose,
}) => {
  const [displayModal, setDisplayModal] = useState(on);

  useEffect(() => {
    setDisplayModal(on);
  }, [on]);

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    onConfirm && (await onConfirm());

    setDisplayModal(false);
  };

  const closeModalHandler = () => {
    setDisplayModal(false);
  };

  return (
    <Modal on={displayModal} onClose={onClose}>
      <form className="form-modal" onSubmit={submitHandler}>
        <h3 className="form-modal__header">{header}</h3>
        <div className="form-modal__content">{content}</div>
        <div className="form-modal__footer">
          <Button small invalid={invalid} loading={loading} disabled={disabled}>
            {footer}
          </Button>
          <Button type="button" small onClick={closeModalHandler}>
            CANCEL
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;
