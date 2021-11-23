import React from 'react';
import { useRecoilValue } from 'recoil';

import Logo from '../../assets/logo.svg';
import themeState from '../../recoil/theme';
import { mergeClassNames } from '../../utils/style';

import styles from './LogoButton.module.css';

interface Props {
  onClick?: React.MouseEventHandler;
}

const LogoButton: React.FC<Props> = ({ onClick }) => {
  const theme = useRecoilValue(themeState.atom);
  return (
    <button
      type="button"
      onClick={onClick}
      className={mergeClassNames(styles.button, styles[theme])}
    >
      <img src={Logo} alt="Blearn! 로고" />
    </button>
  );
};

export default LogoButton;
