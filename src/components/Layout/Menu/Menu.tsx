import { createPortal } from 'react-dom';
import { NavLink, useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { logout } from 'store/actions/auth';
import { removeTree } from 'store/actions/upload';
import './Menu.scss';

interface MenuProps {
  on: boolean;
}

const Menu: React.FC<MenuProps> = ({ on }) => {
  const { uploadTree } = useAppSelector((state) => state.upload);
  const { userData } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const history = useHistory();

  const logoutHandler = () => {
    if (uploadTree) {
      const result = window.confirm(
        'There is unfinished uploading process. The process will be lost if you logout. Are you sure to proceed?'
      );

      if (!result) return;
    }

    dispatch(removeTree());
    dispatch(logout());
    history.push('/auth');
  };

  return createPortal(
    <CSSTransition in={on && !!userData} classNames="menu" timeout={300} mountOnEnter unmountOnExit>
      <div className="menu">
        <ul className="menu__list">
          <li>
            <NavLink activeStyle={{ opacity: 0.7 }} to="/account">
              Account
            </NavLink>
          </li>
          <li>
            <NavLink activeStyle={{ opacity: 0.7 }} to="/my-videos">
              My Videos
            </NavLink>
          </li>
          <li>
            <NavLink activeStyle={{ opacity: 0.7 }} to="/history">
              History
            </NavLink>
          </li>
          <li>
            <div className="link" onClick={logoutHandler}>
              Logout
            </div>
          </li>
        </ul>
      </div>
    </CSSTransition>,
    document.getElementById('menu-hook')!
  );
};

export default Menu;
