import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import PrivatePolicy from 'components/Document/PrivatePolicy/PrivatePolicy';

const PrivatePolicyPage: React.FC = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Private Policy - Watchtree</title>
      </Helmet>
      <PrivatePolicy />;
    </Fragment>
  );
};

export default PrivatePolicyPage;
