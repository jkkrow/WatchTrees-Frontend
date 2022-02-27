import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

const NotFoundPage: React.FC = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Not Found - WatchTrees</title>
      </Helmet>
      <h2 className="center">404 - Not Found</h2>
    </Fragment>
  );
};

export default NotFoundPage;
