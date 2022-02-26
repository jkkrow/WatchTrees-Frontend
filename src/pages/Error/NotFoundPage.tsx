import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

const NotFoundPage: React.FC = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Not Found - WatchTrees</title>
      </Helmet>
      <div className="layout">
        <h2 className="center">404 - Not Found</h2>
      </div>
    </Fragment>
  );
};

export default NotFoundPage;
