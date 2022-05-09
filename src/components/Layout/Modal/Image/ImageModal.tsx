import Modal from '../Modal';
import './ImageModal.scss';

interface ImageModalProps {
  on: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ on, src, alt, onClose }) => {
  return (
    <Modal on={on} onClose={onClose}>
      <img src={src} alt={alt} />
    </Modal>
  );
};

export default ImageModal;
