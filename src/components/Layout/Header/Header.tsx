import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Logo from 'components/Common/UI/Logo/Logo';
import Search from 'components/Common/UI/Search/Search';
import Menu from 'components/Layout/Menu/Menu';
import MenuButton from '../Menu/Button/MenuButton';
import './Header.scss';

const Header: React.FC = () => {
  const [displayMenu, setDisplayMenu] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setDisplayMenu(false);
  }, [location]);

  const displayMenuHandler = () => {
    setDisplayMenu((prev) => !prev);
  };

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        <Logo />
      </Link>
      <Search />
      <MenuButton active={displayMenu} onClick={displayMenuHandler} />
      <Menu on={displayMenu} onClose={() => setDisplayMenu(false)} />
    </header>
  );
};

export default Header;
