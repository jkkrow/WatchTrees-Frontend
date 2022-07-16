import './Footer.scss';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const copyrightYear =
    currentYear > 2021 ? `2021-${currentYear}` : currentYear;

  return (
    <footer className="footer">
      <small className="footer__copyright">
        &copy; {copyrightYear} WatchTrees.
      </small>
    </footer>
  );
};

export default Footer;
