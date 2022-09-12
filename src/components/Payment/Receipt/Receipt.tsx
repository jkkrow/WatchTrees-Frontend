import { Link } from 'react-router-dom';

import { ReactComponent as CircleCheckIcon } from 'assets/icons/circle-check.svg';
import './Receipt.scss';

interface ReceiptProps {
  id: string;
  type: string;
  message: string;
}

const Receipt: React.FC<ReceiptProps> = ({ id, type, message }) => {
  return (
    <div className="receipt">
      <CircleCheckIcon className="receipt__check" />
      <h2>Thank you for purchase!</h2>
      <p>{message}</p>
      {type === 'subscription' && <Link to={'/user/premium'}>See details</Link>}
    </div>
  );
};

export default Receipt;
