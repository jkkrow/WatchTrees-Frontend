import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import Logo from 'components/Common/UI/Logo/Logo';
import Search from 'components/Common/UI/Search/Search';
import Avatar from 'components/Common/UI/Avatar/Avatar';
import Menu from 'components/Layout/Menu/Menu';
import { useAppSelector } from 'hooks/store-hook';
import './Header.scss';

const Header: React.FC = () => {
  const [displayMenu, setDisplayMenu] = useState(false);

  const { userData } = useAppSelector((state) => state.auth);

  const location = useLocation();

  useEffect(() => {
    setDisplayMenu(false);
  }, [location]);

  const displayMenuHandler = () => {
    setDisplayMenu((prev) => !prev);
  };

  return (
    <header className="header">
      <NavLink exact to="/" className="header__logo">
        <Logo />
      </NavLink>

      <Search />

      {userData ? (
        <div onClick={displayMenuHandler}>
          <Avatar
            src={userData.picture}
            width="2.5rem"
            height="2.5rem"
            button
          />
        </div>
      ) : (
        <NavLink exact to="/auth">
          SIGN IN
        </NavLink>
      )}

      <Menu on={displayMenu} onClose={() => setDisplayMenu(false)} />
    </header>
  );
};

export default Header;
