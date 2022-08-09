import { Outlet, Navigate } from 'react-router-dom';

interface RouteProviderProps {
  on: boolean;
  redirect: string;
}

const RouteProvider: React.FC<RouteProviderProps> = ({ on, redirect }) => {
  return on ? <Outlet /> : <Navigate to={redirect} replace />;
};

export default RouteProvider;
