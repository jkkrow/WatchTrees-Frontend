import { Redirect, Route, RouteComponentProps } from 'react-router-dom';

interface ProtectedRouteProps {
  require: any;
  redirect?: string;
  exact: boolean;
  path: string;
  component:
    | React.ComponentType<any>
    | React.ComponentType<RouteComponentProps>
    | undefined;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  require,
  redirect = '/',
  exact,
  path,
  component,
}) => {
  return (
    <>
      {require ? (
        <Route exact={exact} path={path} component={component} />
      ) : (
        <Redirect to={redirect} />
      )}
    </>
  );
};

export default ProtectedRoute;
