import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import './NewVideo.scss';

interface NewVideoProps {
  onAdd: () => void;
}

const NewVideo: React.FC<NewVideoProps> = ({ onAdd }) => {
  return (
    <div className="new-video">
      <Button inversed onClick={onAdd}>
        <PlusIcon />
        NEW VIDEO
      </Button>
    </div>
  );
};

export default NewVideo;
