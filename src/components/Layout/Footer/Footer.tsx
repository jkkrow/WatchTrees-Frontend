import { Link } from 'react-router-dom';

import './Footer.scss';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const copyrightYear =
    currentYear > 2021 ? `2021-${currentYear}` : currentYear;

  return (
    <footer className="footer">
      <ul className="footer__nav">
        <li>
          <Link to="/private-policy">Private Policy</Link>
        </li>
        <li>
          <Link to="/terms-and-conditions">Terms and Conditions</Link>
        </li>
      </ul>
      <p className="footer__copyright">
        &copy; {copyrightYear} WatchTree. All rights reserved
      </p>
    </footer>
  );
};

export default Footer;
