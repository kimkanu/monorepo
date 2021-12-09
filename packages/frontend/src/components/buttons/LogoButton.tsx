import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import LogoAlt from '../../assets/logo-alt.svg';
import Logo from '../../assets/logo.svg';
import themeState from '../../recoil/theme';
import { mergeClassNames } from '../../utils/style';

import styles from './LogoButton.module.css';

interface Props {
  onClick?: React.MouseEventHandler;
}

const LogoButton: React.FC<Props> = ({ onClick }) => {
  const theme = useRecoilValue(themeState.atom);
  const { t } = useTranslation('main');
  return (
    <button
      type="button"
      onClick={onClick}
      className={mergeClassNames(styles.button, styles[theme])}
    >
      <img src={['violet', 'pink'].includes(theme) ? Logo : LogoAlt} alt={`Blearn! ${t('logo')}`} />
    </button>
  );
};

export default LogoButton;
