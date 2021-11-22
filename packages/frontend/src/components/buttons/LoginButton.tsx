import { Provider } from '@team-10/lib';
import React from 'react';

import GitHubLogo from '../../assets/github-logo.svg';
import NaverLogo from '../../assets/naver-logo.svg';

import Button from './Button';

import styles from './LoginButton.module.css';

interface Props {
  provider: Provider;
  onClick?: React.MouseEventHandler;
}

const providerDisplayName: Record<Provider, string> = {
  naver: '네이버 아이디로 로그인',
  github: 'GitHub 계정으로 로그인',
};
const providerClassName: Record<Provider, string> = {
  naver: 'w-5 h-5',
  github: 'w-7 h-7',
};
const logos = {
  naver: NaverLogo,
  github: GitHubLogo,
};

const LoginButton: React.FC<Props> = ({
  provider,
  onClick,
}) => (
  <div className="relative">
    <Button
      width="full"
      type="primary"
      text={providerDisplayName[provider]}
      className={styles[provider]}
      onClick={onClick}
    />
    <div style={{ width: 62 }} className="absolute h-12 left-0 top-0 flex justify-center items-center pointer-events-none select-none">
      <img src={logos[provider]} className={providerClassName[provider]} alt={`${provider.toLocaleUpperCase()} 로고`} />
    </div>
  </div>
);

export default LoginButton;
