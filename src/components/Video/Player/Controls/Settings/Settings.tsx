import { memo } from 'react';

import Btn from '../Btn/Btn';
import { ReactComponent as SettingIcon } from 'assets/icons/gear.svg';
import './Settings.scss';

interface SettingsProps {
  onToggle: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onToggle }) => {
  return (
    <div className="vp-controls__settings">
      <Btn label="Settings" onClick={onToggle}>
        <SettingIcon />
      </Btn>
    </div>
  );
};

export default memo(Settings);
