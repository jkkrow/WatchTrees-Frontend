import { NavLink } from 'react-router-dom';

import './Navigation.scss';

const Navigation: React.FC = () => {
  return (
    <div className="navigation">
      <div className="navigation__toggle" />
      <ul>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? 'active' : '')}
            to="/"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? 'active' : '')}
            to="/recent"
          >
            Recent
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? 'active' : '')}
            to="/featured"
          >
            Featured
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
