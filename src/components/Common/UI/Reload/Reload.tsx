import Button from 'components/Common/Element/Button/Button';
import { ReactComponent as ReloadIcon } from 'assets/icons/reload.svg';
import './Reload.scss';

interface ReloadProps {
  onReload: () => void;
}

const Reload: React.FC<ReloadProps> = ({ onReload }) => {
  return (
    <div className="reload">
      <Button inversed onClick={onReload}>
        <ReloadIcon />
      </Button>
    </div>
  );
};

export default Reload;
