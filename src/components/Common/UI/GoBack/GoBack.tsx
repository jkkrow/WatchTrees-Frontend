import { useNavigate } from 'react-router-dom';

import { ReactComponent as ArrowLeftIcon } from 'assets/icons/arrow-left.svg';
import './GoBack.scss';

const GoBack: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="go-back">
      <ArrowLeftIcon className="btn" onClick={() => navigate(-1)} />
    </div>
  );
};

export default GoBack;
