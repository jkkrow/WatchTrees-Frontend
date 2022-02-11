import Toggle from 'components/Common/Element/Toggle/Toggle';
import { ReactComponent as ThemeLightIcon } from 'assets/icons/theme-light.svg';
import { ReactComponent as ThemeDarkIcon } from 'assets/icons/theme-dark.svg';
import './Theme.scss';
import { useTheme } from 'hooks/theme-hook';

const Theme: React.FC = () => {
  const [mode, setMode] = useTheme();

  const toggleThemeHandler = (checked: boolean) => {
    setMode(checked ? 'dark' : 'light');
  };

  return (
    <div className="theme">
      {mode === 'light' ? <ThemeLightIcon /> : <ThemeDarkIcon />}
      <Toggle
        name="Theme"
        onClick={toggleThemeHandler}
        initialChecked={mode === 'dark'}
      />
    </div>
  );
};

export default Theme;
