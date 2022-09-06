import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import TermsAndConditions from 'components/Document/TermsAndConditions/TermsAndConditions';

const TermsAndConditionsPage: React.FC = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Terms and Conditions - Watchtree</title>
      </Helmet>
      <TermsAndConditions />
    </Fragment>
  );
};

export default TermsAndConditionsPage;
