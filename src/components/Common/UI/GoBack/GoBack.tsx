import { useNavigate } from 'react-router-dom';

import { ReactComponent as ArrowLeftIcon } from 'assets/icons/arrow-left.svg';
import './GoBack.scss';

interface GoBackProps {
  to?: string;
}

const GoBack: React.FC<GoBackProps> = ({ to }) => {
  const navigate = useNavigate();

  const navigateHandler = () => {
    to ? navigate(to) : navigate(-1);
  };

  return (
    <div className="go-back">
      <ArrowLeftIcon className="btn" onClick={navigateHandler} />
    </div>
  );
};

export default GoBack;
