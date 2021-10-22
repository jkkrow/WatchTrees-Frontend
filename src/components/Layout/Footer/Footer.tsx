import "./Footer.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const copyrightYear =
    currentYear > 2021 ? `2021-${currentYear}` : currentYear;

  return (
    <footer className="footer">
      <small className="footer__copyright">
        Copyright &copy; {copyrightYear} WatchTrees
      </small>
    </footer>
  );
};

export default Footer;
