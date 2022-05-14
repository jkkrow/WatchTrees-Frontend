import Toggle from 'components/Common/Element/Toggle/Toggle';
import { ReactComponent as ThemeLightIcon } from 'assets/icons/theme-light.svg';
import { ReactComponent as ThemeDarkIcon } from 'assets/icons/theme-dark.svg';
import { useTheme } from 'hooks/common/theme';
import './Theme.scss';

const Theme: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleThemeHandler = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className="theme">
      {theme === 'light' ? <ThemeLightIcon /> : <ThemeDarkIcon />}
      <Toggle
        name="Theme"
        onClick={toggleThemeHandler}
        initialChecked={theme === 'dark'}
      />
    </div>
  );
};

export default Theme;
