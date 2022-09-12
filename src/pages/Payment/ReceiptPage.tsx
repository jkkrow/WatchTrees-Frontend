import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import Receipt from 'components/Payment/Receipt/Receipt';

const ReceiptPage: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state) navigate('/');
  }, [location.state, navigate]);

  if (!params.id || !location.state) {
    return null;
  }

  const state = location.state as { type: string; message: string };

  return (
    <Fragment>
      <Helmet>
        <title>Receipt - WatchTree</title>
      </Helmet>

      <Receipt id={params.id} type={state.type} message={state.message} />
    </Fragment>
  );
};

export default ReceiptPage;
